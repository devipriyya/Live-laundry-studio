import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../frontend/src/context/AuthContext';
import NewOrder from '../frontend/src/pages/NewOrder';

// Mock the AuthContext
const mockUser = {
  displayName: 'Test User',
  email: 'test@example.com'
};

const MockAuthProvider = ({ children }) => (
  <AuthContext.Provider value={{ user: mockUser }}>
    {children}
  </AuthContext.Provider>
);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NewOrder - Shoe Care Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows pickup address section when shoe care service is selected', async () => {
    render(
      <MockAuthProvider>
        <BrowserRouter>
          <NewOrder />
        </BrowserRouter>
      </MockAuthProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Choose Your Services')).toBeInTheDocument();
    });

    // Find the Shoe Care service card
    const shoeCareCard = screen.getByText('Shoe Care').closest('.border-2');
    expect(shoeCareCard).toBeInTheDocument();

    // Click on the Shoe Care service
    fireEvent.click(shoeCareCard);

    // Click on the quantity increment button
    const incrementButton = screen.getByText('Shoe Care').closest('.border-2').querySelector('button:nth-child(3)');
    fireEvent.click(incrementButton);

    // Click Continue button to go to step 2
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Wait for step 2 to load
    await waitFor(() => {
      expect(screen.getByText('Schedule Pickup & Delivery')).toBeInTheDocument();
    });

    // Fill in pickup date and time
    const pickupDateInput = screen.getByLabelText('Pickup Date');
    fireEvent.change(pickupDateInput, { target: { value: '2023-12-01' } });

    const pickupTimeSelect = screen.getByLabelText('Pickup Time');
    fireEvent.change(pickupTimeSelect, { target: { value: '10:00 AM' } });

    // Fill in delivery date and time
    const deliveryDateInput = screen.getByLabelText('Delivery Date');
    fireEvent.change(deliveryDateInput, { target: { value: '2023-12-03' } });

    const deliveryTimeSelect = screen.getByLabelText('Delivery Time');
    fireEvent.change(deliveryTimeSelect, { target: { value: '2:00 PM' } });

    // Check if pickup address section is visible
    expect(screen.getByText('Pickup Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Street Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('City *')).toBeInTheDocument();
    expect(screen.getByLabelText('State *')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP Code *')).toBeInTheDocument();
    expect(screen.getByLabelText('Special Instructions (Optional)')).toBeInTheDocument();
  });

  test('validates pickup address fields for shoe care service', async () => {
    render(
      <MockAuthProvider>
        <BrowserRouter>
          <NewOrder />
        </BrowserRouter>
      </MockAuthProvider>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Choose Your Services')).toBeInTheDocument();
    });

    // Select shoe care service
    const shoeCareCard = screen.getByText('Shoe Care').closest('.border-2');
    fireEvent.click(shoeCareCard);

    // Set quantity to 1
    const incrementButton = screen.getByText('Shoe Care').closest('.border-2').querySelector('button:nth-child(3)');
    fireEvent.click(incrementButton);

    // Go to step 2
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Wait for step 2 to load
    await waitFor(() => {
      expect(screen.getByText('Schedule Pickup & Delivery')).toBeInTheDocument();
    });

    // Fill in only pickup date and time (leaving address fields empty)
    const pickupDateInput = screen.getByLabelText('Pickup Date');
    fireEvent.change(pickupDateInput, { target: { value: '2023-12-01' } });

    const pickupTimeSelect = screen.getByLabelText('Pickup Time');
    fireEvent.change(pickupTimeSelect, { target: { value: '10:00 AM' } });

    // Fill in delivery date and time
    const deliveryDateInput = screen.getByLabelText('Delivery Date');
    fireEvent.change(deliveryDateInput, { target: { value: '2023-12-03' } });

    const deliveryTimeSelect = screen.getByLabelText('Delivery Time');
    fireEvent.change(deliveryTimeSelect, { target: { value: '2:00 PM' } });

    // Try to continue to next step
    const continueButton2 = screen.getByText('Continue');
    fireEvent.click(continueButton2);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Street address is required for shoe care service')).toBeInTheDocument();
      expect(screen.getByText('City is required for shoe care service')).toBeInTheDocument();
      expect(screen.getByText('State is required for shoe care service')).toBeInTheDocument();
      expect(screen.getByText('ZIP code is required for shoe care service')).toBeInTheDocument();
    });
  });
});