const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Generate invoice for an order
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'name email')
      .populate('serviceId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate invoice details
    const subtotal = order.totalAmount;
    const tax = subtotal * 0.10; // 10% tax
    const discount = 0; // Can be calculated based on promo codes
    const total = subtotal + tax - discount;

    const invoice = {
      invoiceNumber: `INV-${order.orderNumber}`,
      invoiceDate: new Date(),
      orderNumber: order.orderNumber,
      orderDate: order.orderDate,
      customer: {
        name: order.customerInfo.name,
        email: order.customerInfo.email,
        phone: order.customerInfo.phone,
        address: order.customerInfo.address
      },
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      paymentInfo: {
        method: order.paymentMethod || 'Razorpay',
        paymentId: order.paymentId,
        paymentStatus: order.paymentStatus
      },
      pricing: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2)
      },
      status: order.status,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      specialInstructions: order.specialInstructions,
      companyInfo: {
        name: 'Fabrico Laundry Services',
        address: '123 Main Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'support@fabrico.com',
        website: 'www.fabrico.com',
        taxId: 'TAX-123456'
      }
    };

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices for a customer (by email)
router.get('/customer/:email', async (req, res) => {
  try {
    const orders = await Order.find({ 
      'customerInfo.email': req.params.email,
      paymentStatus: 'paid'
    }).sort({ createdAt: -1 });

    const invoices = orders.map(order => ({
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      invoiceDate: order.createdAt,
      total: order.totalAmount,
      status: order.paymentStatus,
      orderId: order._id
    }));

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice as PDF (mock endpoint - would need PDF library)
router.get('/:orderId/download', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // In a real application, generate PDF here
    // For now, return JSON that frontend can use
    res.json({
      message: 'PDF generation endpoint - implement with libraries like pdfkit or puppeteer',
      downloadUrl: `/invoices/${order.orderNumber}.pdf`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
