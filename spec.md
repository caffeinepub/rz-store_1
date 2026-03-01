# RZ Store

## Current State
The checkout page (`CheckoutPage.tsx`) shows only:
1. Payment method selection (UPI, Card, Net Banking, Google Pay)
2. Order summary sidebar
3. Place Order button

There is no shipping address collection before payment.

## Requested Changes (Diff)

### Add
- A **Shipping Address step** that appears before the payment step in the checkout flow.
- Fields required:
  - Full Name (text input)
  - Place / City (text input)
  - Address (textarea)
  - House No (text input)
  - Pincode (6-digit numeric input)
  - Location button ("Use My Location") that auto-fills pincode/city via browser Geolocation API
  - Select State (dropdown -- all Indian states)
  - Select District (dropdown -- populates based on selected state)
- Step-based checkout UI: Step 1 = Shipping Address, Step 2 = Payment
- A "Continue to Payment" button on Step 1 that validates all fields before proceeding
- On Step 2, show a summary of the filled shipping address above the payment method tabs
- The `handlePlaceOrder` function includes the shipping address in the order metadata

### Modify
- `CheckoutPage.tsx` -- wrap existing payment UI in Step 2. Add Step 1 shipping form. Add step indicator (1 → 2) at top.

### Remove
- Nothing removed

## Implementation Plan
1. Add INDIA_STATES_DISTRICTS data (all Indian states + districts per state) as a constant in CheckoutPage.tsx
2. Add ShippingForm component (Step 1) with all required fields, geolocation button, state/district dropdowns
3. Add step state (`step: 'shipping' | 'payment'`) to CheckoutPage
4. Render step indicator at the top
5. On Step 1 "Continue to Payment": validate all fields, then set step to 'payment'
6. On Step 2: show read-only shipping address summary card, then payment tabs
7. Pass shippingAddress as part of order placement (include in paymentMethod string or as extra metadata)
