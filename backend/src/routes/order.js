const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// create order (customer)
router.post('/', protect, async (req, res) => {
  const order = new Order({ ...req.body, userId: req.user._id });
  await order.save();
  res.json(order);
});

// my orders
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('serviceId').populate('deliveryBoyId', 'name email');
  res.json(orders);
});

// admin: get all orders
router.get('/', protect, isAdmin, async (req, res) => {
  const orders = await Order.find().populate('userId','name email').populate('serviceId');
  res.json(orders);
});

// admin: assign to delivery boy
router.patch('/:id/assign', protect, isAdmin, async (req, res) => {
  const { deliveryBoyId } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { deliveryBoyId }, { new: true });
  res.json(order);
});

// delivery boy updates status
router.patch('/:id/status', protect, async (req, res) => {
  // allow only delivery or admin to update to certain statuses
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  // delivery boy can only update if assigned to him or admin
  if (req.user.role === 'delivery' && order.deliveryBoyId?.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not allowed' });
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
});

module.exports = router;
