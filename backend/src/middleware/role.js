const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin only' });
};

const isDeliveryBoy = (req, res, next) => {
  if (req.user && req.user.role === 'deliveryBoy') return next();
  return res.status(403).json({ message: 'Delivery staff only' });
};

const isAdminOrDeliveryBoy = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'deliveryBoy')) return next();
  return res.status(403).json({ message: 'Admin or delivery staff only' });
};

module.exports = { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy };
