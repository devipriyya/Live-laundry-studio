# Dry Cleaning Order Feature

## Overview
This feature allows users to place dry cleaning orders through the application. When a user selects the "Shoe Care" service and completes the order form, the order details are stored in MongoDB with all the required information.

## Implementation Details

### Frontend (NewOrder.jsx)
1. When a user selects the "Shoe Care" service, the form collects the following information:
   - Shoe type (from service selection)
   - Service type (shoe-care)
   - Number of pairs (quantity from item selection)
   - Pickup date and time
   - Pickup address (street, city, state, ZIP code, and special instructions)
   - Contact information (name, phone number, and email)

2. On form submission, if a dry cleaning order is detected (shoe-care service selected), the data is sent to the `/api/orders/dry-cleaning` endpoint.

### Backend (Order Routes)
1. A new endpoint `/api/orders/dry-cleaning` was added to handle dry cleaning orders specifically.
2. The endpoint validates all required fields before creating the order.
3. It ensures that complete pickup address information is provided for shoe care services.
4. The order is then saved to MongoDB with a success confirmation response.

### Database (Order Model)
1. The Order model was enhanced with pre-save validation to ensure that shoe care orders have complete address information.
2. All required fields are stored in the database as specified.

## Required Fields Storage
The following information is stored in MongoDB when a dry cleaning order is placed:

- **Shoe type**: Derived from the service name
- **Service type**: 'shoe-care'
- **Number of pairs**: From the quantity field
- **Pickup date**: From the form date selection
- **Pickup time**: From the form time selection
- **Pickup address**:
  - Street
  - City
  - State
  - ZIP code
  - Special instructions
- **Contact information**:
  - Name
  - Phone number
  - Email

## API Endpoints

### Create Dry Cleaning Order
- **URL**: `POST /api/orders/dry-cleaning`
- **Description**: Creates a new dry cleaning order with validation
- **Response**: Success confirmation with order details

### Standard Order Creation
- **URL**: `POST /api/orders`
- **Description**: Creates a standard order (also handles dry cleaning orders)
- **Response**: Success confirmation with order details

## Validation
The system validates that all required fields are present before storing the order in MongoDB. If any required information is missing, an appropriate error message is returned to the user.

## Testing
Unit tests have been created to verify:
1. Proper validation of incomplete addresses for shoe care orders
2. Successful creation of dry cleaning orders with all required fields

To run tests:
```bash
npm test tests/dry-cleaning-order.test.js
```