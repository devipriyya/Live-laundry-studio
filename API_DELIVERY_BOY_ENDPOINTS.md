# 🚚 Delivery Boy API Endpoints

## Overview
This document describes all API endpoints related to the Delivery Boy functionality in the Fabrico Laundry Service application.

## Authentication Headers
All protected endpoints require the following header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🛡️ Role Protection
- **Admin Only**: Endpoints accessible only to users with `role: 'admin'`
- **Delivery Boy Only**: Endpoints accessible only to users with `role: 'deliveryBoy'`
- **Admin or Delivery Boy**: Endpoints accessible to both roles

---

## User Management Endpoints

### Get All Delivery Boys
**GET** `/api/auth/delivery-boys`
- **Role**: Admin Only
- **Description**: Retrieve all delivery boy accounts
- **Query Parameters**: None
- **Response**:
```json
{
  "deliveryBoys": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "deliveryBoy",
      "status": "Active|On Leave|Inactive",
      "activeOrders": "number",
      "completedOrders": "number"
    }
  ]
}
```

### Create Delivery Boy
**POST** `/api/auth/delivery-boys`
- **Role**: Admin Only
- **Description**: Create a new delivery boy account
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "message": "Delivery boy created successfully",
  "deliveryBoy": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "deliveryBoy"
  }
}
```

### Update Delivery Boy
**PUT** `/api/auth/delivery-boys/:id`
- **Role**: Admin Only
- **Description**: Update an existing delivery boy account
- **Path Parameters**: 
  - `id`: Delivery boy ID
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```
- **Response**:
```json
{
  "message": "Delivery boy updated successfully",
  "deliveryBoy": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "deliveryBoy"
  }
}
```

### Delete Delivery Boy
**DELETE** `/api/auth/delivery-boys/:id`
- **Role**: Admin Only
- **Description**: Delete a delivery boy account
- **Path Parameters**: 
  - `id`: Delivery boy ID
- **Response**:
```json
{
  "message": "Delivery boy deleted successfully"
}
```

### Block/Unblock Delivery Boy
**PATCH** `/api/auth/delivery-boys/:id/block`
- **Role**: Admin Only
- **Description**: Block or unblock a delivery boy account
- **Path Parameters**: 
  - `id`: Delivery boy ID
- **Request Body**:
```json
{
  "isBlocked": "boolean"
}
```
- **Response**:
```json
{
  "message": "Delivery boy blocked/unblocked successfully",
  "deliveryBoy": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "deliveryBoy",
    "isBlocked": "boolean"
  }
}
```

### Get Delivery Boy Order History
**GET** `/api/auth/delivery-boys/:id/orders`
- **Role**: Admin Only
- **Description**: Retrieve order history for a specific delivery boy
- **Path Parameters**: 
  - `id`: Delivery boy ID
- **Response**:
```json
{
  "orders": [
    {
      "_id": "string",
      "orderNumber": "string",
      "status": "string",
      "totalAmount": "number",
      "customerInfo": {
        "name": "string",
        "email": "string"
      },
      "createdAt": "date"
    }
  ]
}
```

---

## Order Management Endpoints

### Get Assigned Orders
**GET** `/api/orders/my-deliveries`
- **Role**: Delivery Boy Only
- **Description**: Retrieve orders assigned to the logged-in delivery boy
- **Query Parameters**:
  - `status`: Filter by status ('all', 'pending', 'completed')
- **Response**:
```json
{
  "orders": [
    {
      "_id": "string",
      "orderNumber": "string",
      "status": "string",
      "customerInfo": {
        "name": "string",
        "phone": "string",
        "address": {
          "street": "string",
          "city": "string",
          "state": "string",
          "zipCode": "string"
        }
      },
      "items": [
        {
          "name": "string",
          "quantity": "number",
          "price": "number"
        }
      ],
      "totalAmount": "number",
      "pickupDate": "date",
      "estimatedDelivery": "string"
    }
  ]
}
```

### Get Delivery Statistics
**GET** `/api/orders/my-deliveries/stats`
- **Role**: Delivery Boy Only
- **Description**: Retrieve performance statistics for the logged-in delivery boy
- **Response**:
```json
{
  "totalDeliveries": "number",
  "activeDeliveries": "number",
  "completedToday": "number",
  "pendingPickups": "number",
  "pendingDeliveries": "number"
}
```

### Update Delivery Status
**PATCH** `/api/orders/:id/delivery-status`
- **Role**: Delivery Boy Only
- **Description**: Update the delivery status of an assigned order
- **Path Parameters**: 
  - `id`: Order ID or order number
- **Request Body**:
```json
{
  "status": "out-for-pickup|pickup-completed|out-for-delivery|delivery-completed",
  "note": "string (optional)",
  "location": "string (optional)"
}
```
- **Response**:
```json
{
  "message": "Status updated successfully",
  "order": {
    "_id": "string",
    "orderNumber": "string",
    "status": "string",
    "customerInfo": {
      "name": "string",
      "email": "string"
    }
  }
}
```

### Get Delivery Boys List (for Assignment)
**GET** `/api/orders/delivery-boys/list`
- **Role**: Admin Only
- **Description**: Retrieve list of delivery boys for order assignment
- **Response**:
```json
{
  "deliveryBoys": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "profilePicture": "string",
      "activeOrders": "number",
      "completedOrders": "number"
    }
  ]
}
```

### Assign Delivery Boy to Order
**PATCH** `/api/orders/:id/assign`
- **Role**: Admin Only
- **Description**: Assign a delivery boy to an order
- **Path Parameters**: 
  - `id`: Order ID or order number
- **Request Body**:
```json
{
  "deliveryBoyId": "string"
}
```
- **Response**:
```json
{
  "_id": "string",
  "orderNumber": "string",
  "deliveryBoyId": "string",
  "statusHistory": [
    {
      "status": "string",
      "timestamp": "date",
      "updatedBy": "string",
      "note": "string"
    }
  ]
}
```

---

## Error Responses

### Unauthorized Access
```json
{
  "message": "Delivery staff only" // or "Admin only" or "Admin or delivery staff only"
}
```
**Status Code**: 403

### Order Not Found
```json
{
  "message": "Order not found"
}
```
**Status Code**: 404

### Invalid Status
```json
{
  "message": "Invalid status. Delivery boys can only update pickup and delivery statuses."
}
```
**Status Code**: 400

### Not Authorized to Update Order
```json
{
  "message": "Not authorized to update this order"
}
```
**Status Code**: 403

---

## Status Transitions

### Delivery Boy Allowed Statuses
Delivery boys can only update orders to these statuses:
- `out-for-pickup`
- `pickup-completed`
- `out-for-delivery`
- `delivery-completed`

### Status Flow
```
out-for-pickup → pickup-completed → out-for-delivery → delivery-completed
```

---

## Rate Limiting
All endpoints are subject to rate limiting to prevent abuse:
- **Anonymous Requests**: 100 requests/hour
- **Authenticated Requests**: 1000 requests/hour

---

## Version History
- **v1.0.0** (December 2025): Initial release with complete delivery boy functionality

---
**Last Updated**: December 4, 2025