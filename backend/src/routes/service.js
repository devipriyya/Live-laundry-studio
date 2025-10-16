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
  const s = new Service(req.body);
  await s.save();
  res.json(s);
});

module.exports = router;
