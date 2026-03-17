const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const s = new Service(req.body);
    await s.save();
    res.json(s);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
