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

const isLaundryStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'laundryStaff' || req.user.role === 'staff')) return next();
  return res.status(403).json({ message: 'Laundry staff only' });
};

const isAdminOrLaundryStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'laundryStaff' || req.user.role === 'staff')) return next();
  return res.status(403).json({ message: 'Admin or laundry staff only' });
};

const isAdminOrAssistant = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'assistant')) return next();
  return res.status(403).json({ message: 'Admin or Assistant access required' });
};

module.exports = { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy, isLaundryStaff, isAdminOrLaundryStaff, isAdminOrAssistant };
