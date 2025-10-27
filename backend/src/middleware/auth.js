const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = null;
  console.log('Protect middleware - Headers:', req.headers);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Protect middleware - Token extracted from header:', token);
    console.log('Protect middleware - Token length:', token ? token.length : 0);
  } else {
    console.log('Protect middleware - No Bearer token in authorization header');
    console.log('Protect middleware - Authorization header value:', req.headers.authorization);
  }
  
  if (!token) {
    console.log('Protect middleware - No token found, returning 401');
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    console.log('Protect middleware - Verifying token with secret:', process.env.JWT_SECRET);
    console.log('Protect middleware - Secret length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Protect middleware - Token decoded successfully:', decoded);
    
    req.user = await User.findById(decoded.id).select('-password');
    console.log('Protect middleware - User found in database:', req.user);
    
    if (!req.user) {
      console.log('Protect middleware - User not found in database, returning 401');
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('Protect middleware - Authentication successful');
    next();
  } catch (err) {
    console.log('Protect middleware - Token verification failed:', err);
    console.log('Protect middleware - Error name:', err.name);
    console.log('Protect middleware - Error message:', err.message);
    return res.status(401).json({ message: 'Token failed' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = { protect, optionalAuth };