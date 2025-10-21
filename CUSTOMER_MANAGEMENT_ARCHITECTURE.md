# Customer Management - Architecture & Flow

## System Architecture

```mermaid
graph TB
    A[Admin Dashboard] --> B[Customer Management Component]
    B --> C[User Table Display]
    B --> D[Search & Filter Panel]
    B --> E[Statistics Cards]
    
    C --> F[View Details Modal]
    C --> G[Edit User Modal]
    C --> H[Delete Confirmation Modal]
    C --> I[Block/Unblock Action]
    
    F --> J[Order History Display]
    G --> K[Update API Call]
    H --> L[Delete API Call]
    I --> M[Block API Call]
    
    K --> N[Backend API /auth/users]
    L --> N
    M --> N
    J --> O[Backend API /orders]
    
    N --> P[(MongoDB Users Collection)]
    O --> Q[(MongoDB Orders Collection)]
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant Database
    
    Admin->>Frontend: Access Customer Management
    Frontend->>API: GET /auth/users (with JWT)
    API->>Database: Query all users
    Database-->>API: Return users data
    API-->>Frontend: Users array
    Frontend-->>Admin: Display user table
    
    Admin->>Frontend: Click Edit User
    Frontend->>Frontend: Open Edit Modal
    Admin->>Frontend: Submit changes
    Frontend->>API: PUT /auth/users/:id
    API->>Database: Update user
    Database-->>API: Confirm update
    API-->>Frontend: Updated user data
    Frontend-->>Admin: Show success message
```

## Component Structure

```
CustomerManagement
├── State Management
│   ├── customers (array)
│   ├── filteredCustomers (array)
│   ├── searchTerm (string)
│   ├── statusFilter (string)
│   ├── roleFilter (string)
│   ├── loading (boolean)
│   ├── error (string)
│   └── modals (showModal, showEditModal, showDeleteModal)
│
├── Data Fetching
│   ├── fetchCustomers()
│   └── fetchCustomerOrders()
│
├── User Actions
│   ├── handleViewCustomer()
│   ├── handleEditCustomer()
│   ├── handleUpdateCustomer()
│   ├── handleDeleteCustomer()
│   ├── confirmDelete()
│   └── handleToggleBlock()
│
├── UI Components
│   ├── Statistics Cards
│   ├── Search & Filter Bar
│   ├── User Table
│   └── Modals
│       ├── CustomerDetailModal
│       ├── EditCustomerModal
│       └── DeleteConfirmationModal
│
└── Utilities
    ├── getStatusColor()
    └── getRoleDisplayName()
```

## Backend API Architecture

```
Auth Routes (/api/auth)
├── Authentication Middleware
│   ├── protect (JWT verification)
│   └── isAdmin (Role check)
│
├── User Management Endpoints
│   ├── GET /users
│   │   ├── Query: role, search, status
│   │   └── Response: { users: [] }
│   │
│   ├── GET /users/:id
│   │   └── Response: User object
│   │
│   ├── PUT /users/:id
│   │   ├── Body: user data
│   │   └── Response: { message, user }
│   │
│   ├── DELETE /users/:id
│   │   └── Response: { message }
│   │
│   ├── PATCH /users/:id/block
│   │   ├── Body: { isBlocked }
│   │   └── Response: { message, user }
│   │
│   └── GET /users/:id/orders
│       └── Response: { orders: [] }
│
└── Error Handling
    ├── User not found (404)
    ├── Email already exists (400)
    └── Server error (500)
```

## Database Schema Relations

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        ObjectId _id
        string name
        string email
        string password
        string phone
        string role
        boolean isBlocked
        array addresses
        object preferences
        object stats
        date createdAt
        date updatedAt
    }
    ORDER {
        ObjectId _id
        ObjectId userId
        string orderNumber
        number totalAmount
        string status
        object customerInfo
        date createdAt
    }
```

## Security Flow

```mermaid
graph LR
    A[User Request] --> B{Has Token?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Valid Token?}
    D -->|No| C
    D -->|Yes| E{Is Admin?}
    E -->|No| F[403 Forbidden]
    E -->|Yes| G[Process Request]
    G --> H{Valid Data?}
    H -->|No| I[400 Bad Request]
    H -->|Yes| J[Execute Action]
    J --> K[Return Response]
```

## Feature Integration Points

### Integrates With:
1. **Authentication System** - Admin login/JWT
2. **Order Management** - User order history
3. **User Profile** - User data management
4. **Dashboard** - Admin dashboard navigation

### Dependencies:
- React (Frontend framework)
- Express (Backend framework)
- MongoDB (Database)
- JWT (Authentication)
- Heroicons (UI icons)
- Tailwind CSS (Styling)

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Loaded: Fetch Success
    Loading --> Error: Fetch Failed
    
    Loaded --> Filtering: User Types
    Filtering --> Loaded: Filter Applied
    
    Loaded --> ViewingDetails: Click View
    ViewingDetails --> Loaded: Close Modal
    
    Loaded --> Editing: Click Edit
    Editing --> Saving: Submit Form
    Saving --> Loaded: Save Success
    Saving --> Editing: Save Failed
    
    Loaded --> Deleting: Click Delete
    Deleting --> Confirming: Confirm Modal
    Confirming --> Loaded: Cancelled
    Confirming --> Processing: Confirmed
    Processing --> Loaded: Delete Success
    
    Loaded --> Blocking: Click Block/Unblock
    Blocking --> Loaded: Toggle Success
    
    Error --> Loading: Retry
```

## API Response Flow

### Success Response
```
Request → Middleware Check → Database Operation → Success Response
   ↓            ↓                    ↓                    ↓
  JWT       IsAdmin?            MongoDB              200 OK
Validate    Check              Update/Query         + Data
```

### Error Response
```
Request → Middleware Check → Error Detected → Error Response
   ↓            ↓                  ↓               ↓
  JWT       IsAdmin?          Validation      400/401/403/404/500
Validate    Check              Failed          + Error Message
```

## Performance Considerations

1. **Data Fetching**: Single API call loads all users
2. **Client-Side Filtering**: Fast search/filter without API calls
3. **Lazy Loading Orders**: Orders fetched only when viewing details
4. **Optimistic Updates**: UI updates before confirmation for better UX
5. **Error Recovery**: Graceful error handling with retry options

## Scalability Notes

**Current Implementation**: Loads all users at once  
**Future Optimization**: 
- Implement pagination (50-100 users per page)
- Server-side search for large datasets
- Caching strategies for frequently accessed data
- Debounced search for API efficiency
