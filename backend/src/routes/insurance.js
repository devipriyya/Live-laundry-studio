const express = require('express');
const router = express.Router();
const InsuranceClaim = require('../models/InsuranceClaim');
const Order = require('../models/Order');
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// ─── Insurance Policy Config ───────────────────────────────────────
const INSURANCE_POLICIES = {
  basic: {
    name: 'Basic Protection',
    costPercent: 5,       // 5% of order total
    minCost: 1.99,
    maxCoverage: 200,
    coverageMultiplier: 2 // up to 2× the order total, capped at maxCoverage
  },
  premium: {
    name: 'Premium Protection',
    costPercent: 10,      // 10% of order total
    minCost: 3.99,
    maxCoverage: 500,
    coverageMultiplier: 5 // up to 5× the order total, capped at maxCoverage
  }
};

// GET /insurance/policies — public, returns available insurance plans
router.get('/policies', (req, res) => {
  const { orderTotal } = req.query;
  const total = parseFloat(orderTotal) || 0;

  const policies = Object.entries(INSURANCE_POLICIES).map(([key, policy]) => {
    const cost = Math.max(policy.minCost, +(total * policy.costPercent / 100).toFixed(2));
    const coverage = Math.min(policy.maxCoverage, +(total * policy.coverageMultiplier).toFixed(2));
    return {
      id: key,
      name: policy.name,
      cost,
      coverageAmount: coverage,
      costPercent: policy.costPercent,
      maxCoverage: policy.maxCoverage
    };
  });

  res.json({ policies });
});

// ─── Customer: Submit a damage claim ────────────────────────────────
router.post('/claims', protect, async (req, res) => {
  try {
    const { orderId, damagedItems } = req.body;

    if (!orderId || !damagedItems || !damagedItems.length) {
      return res.status(400).json({ message: 'Order ID and at least one damaged item are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.insurance || !order.insurance.enabled) {
      return res.status(400).json({ message: 'This order does not have insurance coverage' });
    }

    // Prevent duplicate claims per order
    const existingClaim = await InsuranceClaim.findOne({ orderId, status: { $nin: ['rejected'] } });
    if (existingClaim) {
      return res.status(400).json({ message: 'A claim already exists for this order', claim: existingClaim });
    }

    const totalClaimAmount = damagedItems.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

    const claim = new InsuranceClaim({
      orderId,
      userId: req.user._id,
      claimNumber: `CLM-${Date.now()}`,
      customerInfo: {
        name: order.customerInfo.name,
        email: order.customerInfo.email,
        phone: order.customerInfo.phone
      },
      damagedItems,
      totalClaimAmount,
      policyType: order.insurance.policyType,
      coverageAmount: order.insurance.coverageAmount,
      status: 'submitted',
      history: [{
        action: 'Claim submitted',
        performedBy: req.user._id,
        note: `Customer submitted damage claim for ${damagedItems.length} item(s)`
      }]
    });

    await claim.save();

    res.status(201).json({ message: 'Insurance claim submitted successfully', claim });
  } catch (error) {
    console.error('Error submitting insurance claim:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Customer: Get my claims ────────────────────────────────────────
router.get('/claims/my', protect, async (req, res) => {
  try {
    const claims = await InsuranceClaim.find({ userId: req.user._id })
      .populate('orderId', 'orderNumber totalAmount status insurance')
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    console.error('Error fetching my claims:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Get all claims ──────────────────────────────────────────
router.get('/claims', protect, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await InsuranceClaim.countDocuments(query);
    const claims = await InsuranceClaim.find(query)
      .populate('orderId', 'orderNumber totalAmount status insurance items')
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Stats
    const allClaims = await InsuranceClaim.find({});
    const stats = {
      total: allClaims.length,
      submitted: allClaims.filter(c => c.status === 'submitted').length,
      underReview: allClaims.filter(c => c.status === 'under-review').length,
      approved: allClaims.filter(c => ['approved', 'partially-approved'].includes(c.status)).length,
      rejected: allClaims.filter(c => c.status === 'rejected').length,
      compensated: allClaims.filter(c => c.status === 'compensated').length,
      totalClaimedAmount: allClaims.reduce((s, c) => s + c.totalClaimAmount, 0),
      totalApprovedAmount: allClaims.reduce((s, c) => s + c.approvedAmount, 0)
    };

    res.json({ claims, stats, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Get single claim detail ─────────────────────────────────
router.get('/claims/:id', protect, isAdmin, async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(req.params.id)
      .populate('orderId', 'orderNumber totalAmount status insurance items customerInfo')
      .populate('userId', 'name email phone')
      .populate('reviewedBy', 'name email')
      .populate('history.performedBy', 'name');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.json({ claim });
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Review a claim (approve / partially-approve / reject) ───
router.patch('/claims/:id/review', protect, isAdmin, async (req, res) => {
  try {
    const { status, approvedAmount, adminNotes, rejectionReason, compensationMethod } = req.body;

    if (!['approved', 'partially-approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }

    const claim = await InsuranceClaim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (['compensated'].includes(claim.status)) {
      return res.status(400).json({ message: 'This claim has already been processed' });
    }

    claim.status = status;
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    claim.adminNotes = adminNotes || claim.adminNotes;

    if (status === 'rejected') {
      claim.rejectionReason = rejectionReason || 'Claim does not meet policy criteria';
      claim.approvedAmount = 0;
      claim.compensationMethod = 'none';
    } else {
      const maxApproval = Math.min(claim.totalClaimAmount, claim.coverageAmount);
      claim.approvedAmount = Math.min(approvedAmount || claim.totalClaimAmount, maxApproval);
      claim.compensationMethod = compensationMethod || 'refund';
    }

    claim.history.push({
      action: `Claim ${status} by admin`,
      performedBy: req.user._id,
      note: adminNotes || (status === 'rejected' ? `Rejected: ${claim.rejectionReason}` : `Approved $${claim.approvedAmount}`)
    });

    await claim.save();

    res.json({ message: `Claim ${status} successfully`, claim });
  } catch (error) {
    console.error('Error reviewing claim:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Mark claim as compensated ───────────────────────────────
router.patch('/claims/:id/compensate', protect, isAdmin, async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (!['approved', 'partially-approved'].includes(claim.status)) {
      return res.status(400).json({ message: 'Only approved claims can be compensated' });
    }

    claim.status = 'compensated';
    claim.compensationProcessedAt = new Date();
    claim.history.push({
      action: 'Compensation processed',
      performedBy: req.user._id,
      note: `$${claim.approvedAmount} compensated via ${claim.compensationMethod}`
    });

    await claim.save();

    res.json({ message: 'Compensation processed successfully', claim });
  } catch (error) {
    console.error('Error processing compensation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
