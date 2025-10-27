const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs').promises;

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

// Download invoice as PDF
router.get('/:orderId/download', async (req, res) => {
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

    // Create a document
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add a border around the entire document
    doc.rect(20, 20, 555, 800).stroke();

    // Add company header with enhanced styling
    doc.fontSize(24).font('Helvetica-Bold').text('FABRICO LAUNDRY SERVICES', 50, 50, { align: 'left' });
    doc.fontSize(12).font('Helvetica').text('123 Main Street, City, State 12345', 50, 85);
    doc.text('Phone: +1 (555) 123-4567', 50, 105);
    doc.text('Email: support@fabrico.com', 50, 125);
    doc.text('Tax ID: TAX-123456', 50, 145);

    // Add invoice title and details with better formatting
    doc.fontSize(28).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' });
    doc.fontSize(12).font('Helvetica').text(`Invoice #: INV-${order.orderNumber}`, 400, 90, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 110, { align: 'right' });
    doc.text(`Order #: ${order.orderNumber}`, 400, 130, { align: 'right' });

    // Add a horizontal line separator
    doc.moveTo(30, 160).lineTo(560, 160).stroke();

    // Add customer information with enhanced styling
    doc.fontSize(16).font('Helvetica-Bold').text('Bill To:', 50, 180);
    doc.fontSize(12).font('Helvetica').text(order.customerInfo.name, 50, 205);
    doc.text(`${order.customerInfo.address.street}`, 50, 225);
    doc.text(`${order.customerInfo.address.city}, ${order.customerInfo.address.state} ${order.customerInfo.address.zipCode}`, 50, 245);
    doc.text(`Phone: ${order.customerInfo.phone}`, 50, 265);
    doc.text(`Email: ${order.customerInfo.email}`, 50, 285);

    // Add order details with enhanced styling
    const orderDetailsY = 320;
    doc.fontSize(16).font('Helvetica-Bold').text('Order Details:', 300, orderDetailsY);
    doc.fontSize(12).font('Helvetica').text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 300, orderDetailsY + 30);
    doc.text(`Pickup Date: ${order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : 'TBD'}`, 300, orderDetailsY + 50);
    doc.text(`Delivery Date: ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'TBD'}`, 300, orderDetailsY + 70);
    doc.text(`Status: ${order.status}`, 300, orderDetailsY + 90);

    // Add a horizontal line separator
    doc.moveTo(30, orderDetailsY + 110).lineTo(560, orderDetailsY + 110).stroke();

    // Add items table header with enhanced styling
    const tableTop = orderDetailsY + 130;
    doc.fontSize(12).font('Helvetica-Bold').text('Item', 50, tableTop);
    doc.text('Qty', 250, tableTop);
    doc.text('Price', 350, tableTop);
    doc.text('Amount', 450, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Add items with alternating row colors for better visual appeal
    let yPosition = tableTop + 30;
    order.items.forEach((item, index) => {
      // Alternate row background color
      if (index % 2 === 0) {
        doc.fillColor('#f5f5f5').rect(45, yPosition - 5, 510, 20).fill();
      }
      
      doc.fillColor('#000000'); // Reset to black color
      const itemTotal = item.quantity * item.price;
      doc.font('Helvetica').text(item.name, 50, yPosition);
      doc.text(item.quantity.toString(), 250, yPosition);
      doc.text(`₹${item.price.toFixed(2)}`, 350, yPosition);
      doc.text(`₹${itemTotal.toFixed(2)}`, 450, yPosition);
      yPosition += 25;
    });

    // Add totals with enhanced styling and border
    const totalsY = yPosition + 20;
    doc.moveTo(350, totalsY).lineTo(550, totalsY).stroke();
    doc.font('Helvetica').text('Subtotal:', 350, totalsY + 15);
    doc.text(`₹${subtotal.toFixed(2)}`, 450, totalsY + 15);
    doc.text('Tax (10%):', 350, totalsY + 35);
    doc.text(`₹${tax.toFixed(2)}`, 450, totalsY + 35);
    doc.text('Discount:', 350, totalsY + 55);
    doc.text(`₹${discount.toFixed(2)}`, 450, totalsY + 55);
    doc.moveTo(350, totalsY + 75).lineTo(550, totalsY + 75).stroke();
    doc.fontSize(14).font('Helvetica-Bold').text('Total:', 350, totalsY + 85);
    doc.text(`₹${total.toFixed(2)}`, 450, totalsY + 85);

    // Add payment information with enhanced styling
    const paymentY = totalsY + 130;
    doc.fontSize(16).font('Helvetica-Bold').text('Payment Information:', 50, paymentY);
    doc.fontSize(12).font('Helvetica').text(`Payment Method: ${order.paymentMethod || 'Razorpay'}`, 50, paymentY + 30);
    doc.text(`Payment Status: ${order.paymentStatus}`, 50, paymentY + 50);
    doc.text(`Payment ID: ${order.paymentId}`, 50, paymentY + 70);

    // Add a horizontal line separator
    doc.moveTo(30, paymentY + 90).lineTo(560, paymentY + 90).stroke();

    // Add footer with enhanced styling
    const footerY = paymentY + 110;
    doc.fontSize(10).font('Helvetica').text('Thank you for choosing Fabrico Laundry Services!', 50, footerY, { align: 'center' });
    doc.text('For any queries, please contact us at support@fabrico.com or +1 (555) 123-4567', 50, footerY + 20, { align: 'center' });
    doc.fontSize(8).text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 40, { align: 'center' });

    // Finalize PDF file
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF invoice' });
  }
});

module.exports = router;