/**
 * OTP Service - Handles generation, hashing, and verification of OTPs
 * Used for secure delivery verification
 */

const crypto = require('crypto');

// OTP Configuration
const OTP_LENGTH = 6; // 6-digit OTP
const OTP_EXPIRY_MINUTES = 30; // OTP expires in 30 minutes
const MAX_ATTEMPTS = 3; // Maximum verification attempts

/**
 * Generate a random numeric OTP
 * @returns {string} - Plain text OTP
 */
const generateOTP = () => {
  // Generate cryptographically secure random OTP
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  const otp = crypto.randomInt(min, max + 1).toString();
  return otp;
};

/**
 * Hash an OTP for secure storage
 * @param {string} otp - Plain text OTP
 * @returns {string} - Hashed OTP
 */
const hashOTP = (otp) => {
  return crypto
    .createHash('sha256')
    .update(otp.toString())
    .digest('hex');
};

/**
 * Verify OTP against hashed value
 * @param {string} plainOTP - OTP entered by user
 * @param {string} hashedOTP - Stored hashed OTP
 * @returns {boolean} - Whether OTP matches
 */
const verifyOTP = (plainOTP, hashedOTP) => {
  const hashedInput = hashOTP(plainOTP);
  return hashedInput === hashedOTP;
};

/**
 * Generate expiry time for OTP
 * @returns {Date} - Expiry timestamp
 */
const getOTPExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRY_MINUTES);
  return expiry;
};

/**
 * Check if OTP has expired
 * @param {Date} expiryTime - OTP expiry timestamp
 * @returns {boolean} - Whether OTP has expired
 */
const isOTPExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return new Date() > new Date(expiryTime);
};

/**
 * Check if max attempts exceeded
 * @param {number} attempts - Current attempt count
 * @param {number} maxAttempts - Maximum allowed attempts (optional)
 * @returns {boolean} - Whether max attempts exceeded
 */
const isMaxAttemptsExceeded = (attempts, maxAttempts = MAX_ATTEMPTS) => {
  return attempts >= maxAttempts;
};

/**
 * Generate OTP data for order
 * @returns {Object} - OTP data object with plain OTP and hashed data
 */
const generateDeliveryOTP = () => {
  const plainOTP = generateOTP();
  const hashedOTP = hashOTP(plainOTP);
  const expiresAt = getOTPExpiry();
  
  return {
    plainOTP,      // Send to customer
    otpData: {     // Store in database
      code: hashedOTP,
      generatedAt: new Date(),
      expiresAt: expiresAt,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      verified: false,
      verifiedAt: null
    }
  };
};

/**
 * Validate OTP input format
 * @param {string} otp - OTP to validate
 * @returns {boolean} - Whether OTP format is valid
 */
const isValidOTPFormat = (otp) => {
  if (!otp) return false;
  const otpString = otp.toString().trim();
  return /^\d{6}$/.test(otpString);
};

/**
 * Calculate remaining attempts
 * @param {number} currentAttempts - Current attempts made
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {number} - Remaining attempts
 */
const getRemainingAttempts = (currentAttempts, maxAttempts = MAX_ATTEMPTS) => {
  return Math.max(0, maxAttempts - currentAttempts);
};

/**
 * Format OTP for display/messaging
 * @param {string} otp - Plain OTP
 * @returns {string} - Formatted OTP (with spaces for readability)
 */
const formatOTPForDisplay = (otp) => {
  if (!otp || otp.length !== OTP_LENGTH) return otp;
  // Split into groups of 3 for better readability: 123 456
  return `${otp.slice(0, 3)} ${otp.slice(3)}`;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiry,
  isOTPExpired,
  isMaxAttemptsExceeded,
  generateDeliveryOTP,
  isValidOTPFormat,
  getRemainingAttempts,
  formatOTPForDisplay,
  OTP_LENGTH,
  OTP_EXPIRY_MINUTES,
  MAX_ATTEMPTS
};
