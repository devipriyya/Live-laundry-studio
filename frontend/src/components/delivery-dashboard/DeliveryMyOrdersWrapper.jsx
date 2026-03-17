import React from 'react';
import AssignedOrdersListModern from './AssignedOrdersListModern';

const DeliveryMyOrdersWrapper = () => {
  // Using the new modern AssignedOrdersList component which fetches data independently
  // and displays all required order details with a fresh modern design
  return <AssignedOrdersListModern />;
};

export default DeliveryMyOrdersWrapper;