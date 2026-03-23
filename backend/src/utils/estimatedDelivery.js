/**
 * Estimated Delivery Calculator
 * Calculates estimated delivery time based on service types, item count, and current workload.
 */

// Base processing hours per service type
const SERVICE_HOURS = {
  'schedule-wash': 2,   // washing
  'wash':          2,
  'washing':       2,
  'steam-ironing': 1,
  'ironing':       1,
  'stain-removal': 3,
  'stain':         3,
  'shoe-polish':   2,
  'shoe-care':     2,
  'dry-cleaning':  4,
  'dry':           4,
  'drying':        2,
  'default':       3,   // fallback
};

// Fixed pipeline stages (hours) applied to every order
const PIPELINE_HOURS = {
  pickup:   2,   // time until pickup
  drying:   2,   // after wash
  pressing: 1,   // ironing / folding
  delivery: 2,   // out-for-delivery window
};

/**
 * Determine processing hours for a set of order items.
 * @param {Array} items - order items array [{ name, service, quantity }]
 * @returns {number} total processing hours
 */
function getProcessingHours(items = []) {
  if (!items || items.length === 0) return SERVICE_HOURS.default;

  let maxServiceHours = 0;

  for (const item of items) {
    const serviceKey = (item.service || item.name || '').toLowerCase();
    let hours = SERVICE_HOURS.default;

    for (const [key, val] of Object.entries(SERVICE_HOURS)) {
      if (serviceKey.includes(key)) {
        hours = val;
        break;
      }
    }

    // Scale slightly with quantity (every 5 extra items adds 0.5 h)
    const qty = item.quantity || 1;
    const scaled = hours + Math.floor(qty / 5) * 0.5;
    if (scaled > maxServiceHours) maxServiceHours = scaled;
  }

  return maxServiceHours || SERVICE_HOURS.default;
}

/**
 * Get a workload multiplier based on active order count.
 * @param {number} activeOrders - number of orders currently in processing
 * @returns {number} multiplier (1.0 – 1.5)
 */
function getWorkloadMultiplier(activeOrders = 0) {
  if (activeOrders <= 5)  return 1.0;
  if (activeOrders <= 15) return 1.2;
  if (activeOrders <= 30) return 1.35;
  return 1.5;
}

/**
 * Calculate estimated delivery datetime string.
 * @param {Array}  items        - order items
 * @param {Date|string} pickupDate - scheduled pickup date
 * @param {number} activeOrders - current workload count
 * @returns {string} human-readable estimated delivery string
 */
function calculateEstimatedDelivery(items = [], pickupDate = new Date(), activeOrders = 0) {
  const processingHours = getProcessingHours(items);
  const multiplier = getWorkloadMultiplier(activeOrders);

  const totalHours =
    PIPELINE_HOURS.pickup +
    Math.ceil(processingHours * multiplier) +
    PIPELINE_HOURS.drying +
    PIPELINE_HOURS.pressing +
    PIPELINE_HOURS.delivery;

  const base = pickupDate ? new Date(pickupDate) : new Date();
  const estimated = new Date(base.getTime() + totalHours * 60 * 60 * 1000);

  // Format: "Mon, 23 Mar 2026 at 02:00 PM"
  return estimated.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Recalculate estimated delivery from the current moment based on remaining stages.
 * Called when status progresses (e.g., wash-in-progress, wash-completed).
 * @param {string} currentStatus
 * @param {Array}  items
 * @param {number} activeOrders
 * @returns {string}
 */
function recalculateFromStatus(currentStatus, items = [], activeOrders = 0) {
  const processingHours = getProcessingHours(items);
  const multiplier = getWorkloadMultiplier(activeOrders);

  // Remaining hours based on how far along the order is
  const remainingMap = {
    'order-placed':        PIPELINE_HOURS.pickup + Math.ceil(processingHours * multiplier) + PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'order-accepted':      PIPELINE_HOURS.pickup + Math.ceil(processingHours * multiplier) + PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'out-for-pickup':      1 + Math.ceil(processingHours * multiplier) + PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'pickup-completed':    Math.ceil(processingHours * multiplier) + PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'wash-in-progress':    Math.ceil((processingHours * multiplier) / 2) + PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'wash-completed':      PIPELINE_HOURS.drying + PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery,
    'out-for-delivery':    PIPELINE_HOURS.delivery,
    'delivery-completed':  0,
    'delivered':           0,
  };

  const hoursLeft = remainingMap[currentStatus] ?? (PIPELINE_HOURS.pressing + PIPELINE_HOURS.delivery);
  if (hoursLeft === 0) return 'Delivered';

  const estimated = new Date(Date.now() + hoursLeft * 60 * 60 * 1000);
  return estimated.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

module.exports = { calculateEstimatedDelivery, recalculateFromStatus, getProcessingHours, getWorkloadMultiplier };
