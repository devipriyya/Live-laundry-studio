const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin only' });
};
const isDelivery = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') return next();
  return res.status(403).json({ message: 'Delivery only' });
};
module.exports = { isAdmin, isDelivery };
