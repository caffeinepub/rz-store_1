import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat; // Price in cents/paise
    imageUrl : Text;
    category : Text;
    stock : Nat;
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type OrderItem = {
    productId : Text;
    name : Text;
    price : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Text;
    userId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    status : Text;
    paymentMethod : Text;
    timestamp : Time.Time;
  };

  public type Feedback = {
    id : Nat;
    name : Text;
    rating : Nat; // 1-5
    comment : Text;
    productId : ?Text; // Null for general feedback
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
  };

  // Internal state
  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Text, Order>();
  var orderIdCounter : Nat = 1;
  let feedbacks = List.empty<Feedback>();
  var feedbackIdCounter : Nat = 1;
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  include MixinAuthorization(accessControlState);

  // Helper Functions
  func getCartItems(userId : Principal) : List.List<CartItem> {
    switch (carts.get(userId)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public query func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // Cart Management
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let items = getCartItems(caller);
    items.add(item);
    carts.add(caller, items);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    getCartItems(caller).toArray();
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    let items = getCartItems(caller);
    let filteredItems = items.toArray().filter(func(item : CartItem) : Bool {
      item.productId != productId
    });
    carts.add(caller, List.fromArray<CartItem>(filteredItems));
  };

  public shared ({ caller }) func updateCartQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    let items = getCartItems(caller);
    let updatedItems = items.toArray().map(func(item : CartItem) : CartItem {
      if (item.productId == productId) {
        { productId = item.productId; quantity = quantity };
      } else {
        item;
      };
    });
    carts.add(caller, List.fromArray<CartItem>(updatedItems));
  };

  // Orders
  public shared ({ caller }) func placeOrder(paymentMethod : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = getCartItems(caller);
    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty");
    };

    var total : Nat = 0;
    let orderItems = cart.toArray().map(
      func(cartItem : CartItem) : OrderItem {
        switch (products.get(cartItem.productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?product) {
            total += product.price * cartItem.quantity;
            {
              productId = product.id;
              name = product.name;
              price = product.price;
              quantity = cartItem.quantity;
            };
          };
        };
      }
    );

    let orderId = orderIdCounter.toText() # "-" # caller.toText();
    orderIdCounter += 1;

    let order : Order = {
      id = orderId;
      userId = caller;
      items = orderItems;
      totalAmount = total;
      status = "Pending";
      paymentMethod;
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    carts.remove(caller); // Clear cart after placing order
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order : Order) : Bool {
      order.userId == caller;
    });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  // Feedback
  public shared ({ caller }) func submitFeedback(name : Text, rating : Nat, comment : Text, productId : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let feedback : Feedback = {
      id = feedbackIdCounter;
      name;
      rating;
      comment;
      productId;
      timestamp = Time.now();
    };

    feedbacks.add(feedback);
    feedbackIdCounter += 1;
  };

  public query func getAllFeedback() : async [Feedback] {
    feedbacks.toArray();
  };

  // Seed Data - Admin only
  public shared ({ caller }) func seedProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed products");
    };

    let sampleProducts : [Product] = [
      {
        id = "prod-1";
        name = "Wireless Headphones";
        description = "Premium noise-cancelling wireless headphones with 30-hour battery life";
        price = 799900; // ₹7999.00
        imageUrl = "https://example.com/headphones.jpg";
        category = "electronics";
        stock = 50;
      },
      {
        id = "prod-2";
        name = "Smart Watch";
        description = "Fitness tracking smartwatch with heart rate monitor";
        price = 1299900; // ₹12999.00
        imageUrl = "https://example.com/smartwatch.jpg";
        category = "electronics";
        stock = 30;
      },
      {
        id = "prod-3";
        name = "Cotton T-Shirt";
        description = "Comfortable 100% cotton t-shirt available in multiple colors";
        price = 49900; // ₹499.00
        imageUrl = "https://example.com/tshirt.jpg";
        category = "clothing";
        stock = 100;
      },
      {
        id = "prod-4";
        name = "Denim Jeans";
        description = "Classic fit denim jeans with stretch fabric";
        price = 149900; // ₹1499.00
        imageUrl = "https://example.com/jeans.jpg";
        category = "clothing";
        stock = 75;
      },
      {
        id = "prod-5";
        name = "Leather Wallet";
        description = "Genuine leather bifold wallet with RFID protection";
        price = 89900; // ₹899.00
        imageUrl = "https://example.com/wallet.jpg";
        category = "accessories";
        stock = 60;
      },
      {
        id = "prod-6";
        name = "Sunglasses";
        description = "UV protection polarized sunglasses";
        price = 129900; // ₹1299.00
        imageUrl = "https://example.com/sunglasses.jpg";
        category = "accessories";
        stock = 40;
      },
      {
        id = "prod-7";
        name = "Bluetooth Speaker";
        description = "Portable waterproof Bluetooth speaker with 12-hour battery";
        price = 249900; // ₹2499.00
        imageUrl = "https://example.com/speaker.jpg";
        category = "electronics";
        stock = 45;
      },
      {
        id = "prod-8";
        name = "Running Shoes";
        description = "Lightweight running shoes with cushioned sole";
        price = 349900; // ₹3499.00
        imageUrl = "https://example.com/shoes.jpg";
        category = "clothing";
        stock = 55;
      },
      {
        id = "prod-9";
        name = "Backpack";
        description = "Durable laptop backpack with multiple compartments";
        price = 179900; // ₹1799.00
        imageUrl = "https://example.com/backpack.jpg";
        category = "accessories";
        stock = 35;
      },
      {
        id = "prod-10";
        name = "Wireless Mouse";
        description = "Ergonomic wireless mouse with adjustable DPI";
        price = 59900; // ₹599.00
        imageUrl = "https://example.com/mouse.jpg";
        category = "electronics";
        stock = 80;
      },
    ];

    for (product in sampleProducts.vals()) {
      products.add(product.id, product);
    };
  };

  // Stripe Integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
