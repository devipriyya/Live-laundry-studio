// Order Service - Manages orders across the application
import { isActiveStatus, isCompletedStatus } from '../utils/orderStatusUtils.js';

class OrderService {
  constructor() {
    this.storageKey = 'fabrico_orders';
    this.initializeOrders();
  }

  // Initialize with some sample orders if none exist
  initializeOrders() {
    const existingOrders = this.getAllOrders();
    if (existingOrders.length === 0) {
      const sampleOrders = [
        {
          id: 'ORD-001',
          service: 'Wash & Fold',
          status: 'wash-in-progress',
          orderDate: '2024-01-20',
          pickupDate: '2024-01-21',
          deliveryDate: '2024-01-23',
          estimatedDelivery: '2024-01-23 14:00',
          items: 12,
          weight: '4.5 lbs',
          total: 24.99,
          customer: {
            name: 'John Doe',
            address: '123 Main St, City, State 12345',
            phone: '+1 (555) 123-4567',
            email: 'john.doe@email.com'
          },
          itemsList: [
            { name: 'T-Shirts', quantity: 5, price: 10.00 },
            { name: 'Jeans', quantity: 2, price: 8.00 },
            { name: 'Shirts', quantity: 3, price: 6.99 },
          ],
          statusHistory: [
            { status: 'order-placed', timestamp: '2024-01-20T10:00:00Z', note: 'Order placed by customer' },
            { status: 'order-accepted', timestamp: '2024-01-20T11:00:00Z', note: 'Order accepted by admin' },
            { status: 'out-for-pickup', timestamp: '2024-01-21T08:00:00Z', note: 'Driver dispatched for pickup' },
            { status: 'pickup-completed', timestamp: '2024-01-21T10:30:00Z', note: 'Items collected successfully' },
            { status: 'wash-in-progress', timestamp: '2024-01-21T11:00:00Z', note: 'Washing process started' }
          ],
          createdAt: new Date('2024-01-20').toISOString()
        }
      ];
      this.saveOrders(sampleOrders);
    }
  }

  // Get all orders from localStorage
  getAllOrders() {
    try {
      const orders = localStorage.getItem(this.storageKey);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  // Save orders to localStorage
  saveOrders(orders) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving orders:', error);
      return false;
    }
  }

  // Add a new order
  addOrder(orderData) {
    try {
      const orders = this.getAllOrders();
      const newOrder = {
        id: orderData.id || `ORD-${Date.now()}`,
        service: orderData.service || 'Laundry Service',
        status: orderData.status || 'Pending',
        orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
        pickupDate: orderData.pickupDate || '',
        deliveryDate: orderData.deliveryDate || '',
        estimatedDelivery: orderData.estimatedDelivery || '',
        items: orderData.items || 0,
        weight: orderData.weight || '0 lbs',
        total: orderData.total || 0,
        customer: {
          name: orderData.customer?.name || 'Customer',
          address: orderData.customer?.address || '',
          phone: orderData.customer?.phone || '',
          email: orderData.customer?.email || ''
        },
        itemsList: orderData.itemsList || [],
        createdAt: new Date().toISOString(),
        ...orderData
      };

      orders.unshift(newOrder); // Add to beginning of array (most recent first)
      this.saveOrders(orders);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }

  // Get order by ID
  getOrderById(orderId) {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === orderId);
  }

  // Update order status
  updateOrderStatus(orderId, newStatus) {
    try {
      const orders = this.getAllOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].updatedAt = new Date().toISOString();
        this.saveOrders(orders);
        return orders[orderIndex];
      }
      return null;
    } catch (error) {
      console.error('Error updating order status:', error);
      return null;
    }
  }

  // Get orders by status
  getOrdersByStatus(status) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.status === status);
  }

  // Get recent orders (last N orders)
  getRecentOrders(limit = 5) {
    const orders = this.getAllOrders();
    return orders.slice(0, limit);
  }

  // Get active orders (not delivered or cancelled)
  getActiveOrders() {
    const orders = this.getAllOrders();
    return orders.filter(order => isActiveStatus(order.status));
  }

  // Delete order
  deleteOrder(orderId) {
    try {
      const orders = this.getAllOrders();
      const filteredOrders = orders.filter(order => order.id !== orderId);
      this.saveOrders(filteredOrders);
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  // Clear all orders (for testing)
  clearAllOrders() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing orders:', error);
      return false;
    }
  }

  // Get order statistics
  getOrderStats() {
    const orders = this.getAllOrders();
    const activeOrders = this.getActiveOrders();
    const completedOrders = orders.filter(order => isCompletedStatus(order.status));
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      totalOrders: orders.length,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      totalSpent: totalSpent,
      rewardPoints: Math.floor(totalSpent * 0.1) // 10% of total spent as reward points
    };
  }
}

// Create and export a singleton instance
const orderService = new OrderService();
export default orderService;
