# RZ Store

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Welcome Page (Page 1)**: Full-screen animated welcome landing page with "WELCOME TO RZ STORE.IN" headline, animated logo/banner GIF-style animation, animated entrance effects, and a "Enter Store" CTA button.
- **Store Page (Page 2)**: Product listing grid with sample products, each having an image, name, price, "Add to Cart" and "Buy Now" buttons.
- **Cart**: Slide-in cart drawer showing added items, quantities, subtotals, and a "Proceed to Checkout" button.
- **Checkout / Payment Page**: Order summary + payment method selection (Net Banking, Credit/Debit Card, UPI, Google Pay) with animated transitions and a "Place Order" confirmation flow.
- **Feedback Page**: Customer feedback/review form with star rating, comment field, and submit button. Also displays existing feedback.
- **Navigation**: Top navbar visible on all pages except welcome, with links to Store, Cart (with item count badge), and Feedback.
- **Animations**: Page entrance animations, button hover effects, cart badge pulse, and smooth page transitions throughout.

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Backend: Products catalog (list/get), Cart management (add/remove/update), Orders (place order), Feedback (submit/list).
2. Frontend:
   - WelcomePage: animated headline, floating particles or shimmer animation, enter button.
   - StorePage: product grid with add-to-cart and buy-now actions.
   - CartDrawer: slide-in panel with item list, quantity controls, total, checkout button.
   - CheckoutPage: payment method tabs (Net Banking, Credit/Debit Card, UPI, Google Pay), form fields per method, order placement.
   - FeedbackPage: star rating component, comment form, feedback list display.
   - App routing between pages with animated transitions.
