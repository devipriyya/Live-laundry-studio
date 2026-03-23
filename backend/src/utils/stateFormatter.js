const User = require('../models/User');
const Order = require('../models/Order');

/**
 * Formats the system state for the RL agent
 */
const stateFormatter = {
  /**
   * Fetches necessary data and returns a clean state object
   */
  getSystemState: async (currentOrder) => {
    try {
      // 1. Get count of pending orders (placed, accepted, or being picked up)
      const pendingOrdersCount = await Order.countDocuments({
        status: { $in: ['order-placed', 'order-accepted', 'out-for-pickup'] }
      });

      // 2. Get available laundry staff with their workloads
      // We look for users with role 'laundryStaff' or 'staff' who are not blocked
      const availableStaff = await User.find({
        role: { $in: ['laundryStaff', 'staff'] },
        isBlocked: { $ne: true }
      }).limit(10); // Match RL MAX_STAFF_SLOTS

      console.log(`[RL State] Found ${availableStaff.length} available staff members for assignment.`);

      // 3. For each staff member, calculate current workload
      // Workload could be the count of orders assigned but not completed
      const staffWithWorkload = await Promise.all(availableStaff.map(async (staff) => {
        const workload = await Order.countDocuments({
          assignedLaundryStaff: staff._id,
          status: { $in: ['wash-in-progress', 'washing', 'drying', 'cleaning', 'pressing', 'quality-check'] }
        });

        return {
          staffId: staff._id.toString(),
          workload: workload,
          avgCompletionTime: staff.laundryStaffInfo?.avgCompletionTime 
            ? parseFloat(staff.laundryStaffInfo.avgCompletionTime) || 2.0 
            : 2.0 // Default 2 hours if not recorded
        };
      }));

      // 4. Calculate order age (in hours)
      const orderAge = currentOrder.createdAt 
        ? (new Date() - new Date(currentOrder.createdAt)) / (1000 * 60 * 60)
        : 0;

      return {
        pendingOrdersCount,
        availableStaff: staffWithWorkload,
        orderPriority: currentOrder.priority || 'normal',
        orderAge: parseFloat(orderAge.toFixed(2))
      };
    } catch (error) {
      console.error('Error formatting system state:', error);
      return null;
    }
  }
};

module.exports = stateFormatter;
