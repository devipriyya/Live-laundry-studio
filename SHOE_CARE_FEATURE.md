# Shoe Care Feature Documentation

## Overview
This document describes the implementation of the pickup address section for the Shoe Care service in the New Order page.

## Feature Description
When a user selects the "Shoe Care" service in the New Order page, a pickup address section is displayed in Step 2 (Schedule Pickup & Delivery) after the Pickup Time field. This section includes:

1. Street Address (required)
2. City (required)
3. State (required, dropdown)
4. ZIP Code (required)
5. Special Instructions (optional)

## Implementation Details

### File Modified
- `frontend/src/pages/NewOrder.jsx`

### Changes Made

1. **UI Changes**:
   - Added a conditional pickup address section in Step 2 that only appears when the "Shoe Care" service is selected
   - The section includes all required address fields with proper validation
   - The section is displayed after the Pickup Time field and before the navigation buttons

2. **Validation Changes**:
   - Updated the validation logic in Step 2 to require address fields when the "Shoe Care" service is selected
   - Added specific error messages for the address fields when they are required for the shoe care service

3. **State Management**:
   - The address fields use the existing address state structure in the orderData object
   - No additional state was needed as the address fields were already part of the orderData structure

## User Flow

1. User navigates to the New Order page
2. User selects the "Shoe Care" service
3. User clicks "Continue" to proceed to Step 2 (Schedule Pickup & Delivery)
4. User fills in the pickup and delivery schedule information
5. The pickup address section automatically appears after the Pickup Time field
6. User fills in the required address information
7. User clicks "Continue" to proceed to the next step
8. If any required address fields are missing, appropriate validation errors are displayed

## Validation Rules

When the "Shoe Care" service is selected, the following fields are required in Step 2:
- Street Address
- City
- State
- ZIP Code

If any of these fields are missing when the user tries to proceed to the next step, an error message will be displayed.

## Error Messages

- "Street address is required for shoe care service"
- "City is required for shoe care service"
- "State is required for shoe care service"
- "ZIP code is required for shoe care service"

## Testing

A test file has been created at `tests/new-order-shoe-care.test.js` to verify:
1. The pickup address section appears when the shoe care service is selected
2. The pickup address fields are properly validated when required

## Future Enhancements

1. Add more specific validation for ZIP code format
2. Add address autocomplete functionality
3. Add geolocation services to pre-fill address information
4. Add the ability to save addresses for future use