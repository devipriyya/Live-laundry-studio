import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load components to catch import errors
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const DashboardLayout = React.lazy(() => import('./components/DashboardLayout'));
const DashboardHome = React.lazy(() => import('./pages/dashboard/DashboardHome'));
const DashboardProfile = React.lazy(() => import('./pages/dashboard/DashboardProfile'));
const DashboardLaundry = React.lazy(() => import('./pages/dashboard/DashboardLaundry'));
const DashboardSchedule = React.lazy(() => import('./pages/dashboard/DashboardSchedule'));
const DashboardOrders = React.lazy(() => import('./pages/dashboard/DashboardOrders'));
const DashboardPayment = React.lazy(() => import('./pages/dashboard/DashboardPayment'));
const DashboardQuality = React.lazy(() => import('./pages/dashboard/DashboardQuality'));
const DashboardRate = React.lazy(() => import('./pages/dashboard/DashboardRate'));
const DashboardProducts = React.lazy(() => import('./pages/dashboard/DashboardProducts'));
const DashboardStore = React.lazy(() => import('./pages/dashboard/DashboardStore'));
const DashboardLegal = React.lazy(() => import('./pages/dashboard/DashboardLegal'));
const DashboardAbout = React.lazy(() => import('./pages/dashboard/DashboardAbout'));
const DashboardShoeCleaning = React.lazy(() => import('./pages/dashboard/DashboardShoeCleaning'));
const DashboardStainRemoval = React.lazy(() => import('./pages/dashboard/DashboardStainRemoval'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminDashboardModern = React.lazy(() => import('./pages/AdminDashboardModern'));
const AdminOrderManagement = React.lazy(() => import('./pages/AdminOrderManagement'));
const DeliveryBoyDashboard = React.lazy(() => import('./pages/DeliveryBoyDashboard'));
const AdminLoginDebug = React.lazy(() => import('./pages/AdminLoginDebug'));
const AdminDashboardTest = React.lazy(() => import('./pages/AdminDashboardTest'));
const AdminDashboardFixed = React.lazy(() => import('./pages/AdminDashboardFixed'));
const AdminLoginTest = React.lazy(() => import('./pages/AdminLoginTest'));
const AdminTest = React.lazy(() => import('./pages/AdminTest'));
const NewOrder = React.lazy(() => import('./pages/NewOrder'));
const SchedulePickup = React.lazy(() => import('./pages/SchedulePickup'));
const TrackOrder = React.lazy(() => import('./pages/TrackOrder'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ProfileTest = React.lazy(() => import('./pages/ProfileTest'));
const LaundrySegment = React.lazy(() => import('./pages/LaundrySegment'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));
const Invoice = React.lazy(() => import('./pages/Invoice'));
const MyOrders = React.lazy(() => import('./pages/MyOrders'));
const CustomerManagementPage = React.lazy(() => import('./pages/CustomerManagementPage'));
const CustomerManagementTestPage = React.lazy(() => import('./pages/CustomerManagementTestPage'));
const CustomerManagementDirect = React.lazy(() => import('./pages/CustomerManagementDirect'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const ChatSupport = React.lazy(() => import('./components/ChatSupport'));
const ErrorBoundary = React.lazy(() => import('./components/ErrorBoundary'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin-login-test" element={<AdminLoginTest />} />
            <Route path="/admin-login-debug" element={<AdminLoginDebug />} />

            {/* Protected Dashboard with nested routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={['customer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/home" replace />} />
              <Route path="home" element={<DashboardHome />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="laundry" element={<DashboardLaundry />} />
              <Route path="shoe-cleaning" element={<DashboardShoeCleaning />} />
              <Route path="stain-removal" element={<DashboardStainRemoval />} />
              <Route path="schedule" element={<DashboardSchedule />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="payment" element={<DashboardPayment />} />
              <Route path="quality" element={<DashboardQuality />} />
              <Route path="rate" element={<DashboardRate />} />
              <Route path="products" element={<DashboardProducts />} />
              <Route path="store" element={<DashboardStore />} />
              <Route path="legal" element={<DashboardLegal />} />
              <Route path="about" element={<DashboardAbout />} />
            </Route>

            {/* Legacy Dashboard Route (for backward compatibility) */}
            <Route 
              path="/dashboard-old" 
              element={
                <ProtectedRoute roles={['customer', 'delivery']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Dashboard */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboardModern />
                </ProtectedRoute>
              } 
            />
            
            {/* Original Admin Dashboard (for comparison) */}
            <Route 
              path="/admin-dashboard-original" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Order Management */}
            <Route 
              path="/admin-orders" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminOrderManagement />
                </ProtectedRoute>
              } 
            />

            {/* Customer Management */}
            <Route 
              path="/customer-management" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <CustomerManagementPage />
                </ProtectedRoute>
              } 
            />

            {/* Customer Management Test Page */}
            <Route 
              path="/customer-management-test" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <CustomerManagementTestPage />
                </ProtectedRoute>
              } 
            />

            {/* Customer Management Direct Page */}
            <Route 
              path="/customer-management-direct" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <CustomerManagementDirect />
                </ProtectedRoute>
              } 
            />

            {/* Delivery Boy Dashboard */}
            <Route 
              path="/delivery-dashboard" 
              element={
                <ProtectedRoute roles={['deliveryBoy']}>
                  <DeliveryBoyDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected New Order */}
            <Route 
              path="/new-order" 
              element={
                <ProtectedRoute>
                  <NewOrder />
                </ProtectedRoute>
              } 
            />

            {/* Protected Schedule Pickup */}
            <Route 
              path="/schedule-pickup" 
              element={
                <ProtectedRoute>
                  <SchedulePickup />
                </ProtectedRoute>
              } 
            />

            {/* Protected Track Order */}
            <Route 
              path="/track-order" 
              element={
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              } 
            />

            {/* Profile - accessible without authentication */}
            <Route 
              path="/profile" 
              element={
                <ErrorBoundary>
                  <Profile />
                </ErrorBoundary>
              } 
            />
            
            {/* Profile Test Route */}
            <Route 
              path="/profile-test" 
              element={<ProfileTest />} 
            />

            {/* Protected Laundry Segment */}
            <Route 
              path="/laundry-segment" 
              element={
                <ProtectedRoute>
                  <LaundrySegment />
                </ProtectedRoute>
              } 
            />

            {/* Protected Order Success */}
            <Route 
              path="/order-success" 
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } 
            />

            {/* Protected Invoice */}
            <Route 
              path="/invoice/:orderId" 
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              } 
            />

            {/* Protected My Orders */}
            <Route 
              path="/my-orders" 
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global Chat Support */}
          <ChatSupport />
        </Suspense>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
