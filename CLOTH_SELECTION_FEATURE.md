# Cloth Selection & Payment Feature

## Overview
Added comprehensive cloth selection functionality with integrated Razorpay payment processing to the Schedule Pickup page.

## Features Added

### 1. Cloth Selection Interface
- **4 Categories of clothing items:**
  - Basic Garments (9 items)
  - Formal / Outerwear (5 items) 
  - Ethnic & Delicate Wear (5 items)
  - Household Items (6 items)

### 2. Pricing Structure
All items have individual pricing in INR (₹):
- Basic items: ₹15-35
- Formal wear: ₹15-120
- Ethnic wear: ₹40-150
- Household items: ₹15-100

### 3. Interactive Quantity Selection
- Plus/minus buttons for each item
- Real-time subtotal calculation per item
- Dynamic total price calculation
- Visual feedback for selected items

### 4. Payment Integration
- **Razorpay payment gateway** integration
- Secure payment processing before order confirmation
- Payment validation and error handling
- Demo mode fallback when Razorpay is not loaded

### 5. Enhanced Order Management
- Updated order data structure to include selected clothes
- Payment ID tracking
- Improved validation to ensure items are selected
- Better error messaging

## Technical Implementation

### Files Modified
- `frontend/src/pages/SchedulePickup.jsx` - Main component with cloth selection UI
- `frontend/index.html` - Added Razorpay script

### Key Functions Added
- `updateClothQuantity()` - Manages item quantity changes
- `processPayment()` - Handles Razorpay payment flow
- Enhanced `validateForm()` - Includes cloth selection validation
- Updated `handleSubmit()` - Processes payment before order creation

### State Management
- `selectedClothes` - Tracks selected items and quantities
- `totalPrice` - Real-time total calculation
- Enhanced error handling for payment scenarios

## Usage Instructions

1. **Select Items**: Choose clothing items and set quantities using +/- buttons
2. **Review Total**: Check the total amount in the summary section
3. **Fill Details**: Complete pickup schedule and address information
4. **Payment**: Click "Pay ₹X & Schedule Pickup" to process payment
5. **Confirmation**: Order is created after successful payment

## Payment Configuration

**Note**: Update the Razorpay key in `SchedulePickup.jsx`:
```javascript
key: 'rzp_test_9WseLfh9QCcoWD', // Replace with your actual Razorpay key
```

## Error Handling
- Validates minimum item selection
- Payment cancellation handling
- Network error recovery
- Form validation with visual feedback

## Future Enhancements
- Bulk selection options
- Discount codes
- Subscription pricing
- Item categories filtering
- Saved item preferences
