import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DeliveryDashboardHome from './DeliveryDashboardHome';

const DeliveryDashboardHomeWrapper = () => {
  const { stats, expandedSections, toggleSection } = useOutletContext();
  
  return (
    <DeliveryDashboardHome 
      stats={stats}
      expandedSections={expandedSections}
      toggleSection={toggleSection}
    />
  );
};

export default DeliveryDashboardHomeWrapper;
