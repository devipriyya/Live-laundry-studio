import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HelpSupportNew from './HelpSupportNew';

const HelpSupportWrapper = () => {
  // HelpSupport doesn't require any props from context
  return <HelpSupportNew />;
};

export default HelpSupportWrapper;