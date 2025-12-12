import React, { Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import './i18n'; // Initialize i18n
import './styles/analytics.css';

// Lazy load components to catch import errors
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const DashboardLayout = React.lazy(() => import('./components/DashboardLayout'));
const DashboardHome = React.lazy(() => import('./pages/dashboard/DashboardHome'));
const DashboardProfile = React.lazy(() => import('./pages/dashboard/DashboardProfile'));
const DashboardLaundry = React.lazy(() => import('./pages/dashboard/DashboardLaundry'));
const DashboardSchedule = React.lazy(() => import('./pages/dashboard/DashboardSchedule'));
const TestSchedule = React.lazy(() => import('./pages/dashboard/TestSchedule'));
const DashboardOrders = React.lazy(() => import('./pages/dashboard/DashboardOrders'));
const DashboardPayment = React.lazy(() => import('./pages/dashboard/DashboardPayment'));
const DashboardQuality = React.lazy(() => import('./pages/dashboard/DashboardQuality'));
const DashboardRate = React.lazy(() => import('./pages/dashboard/DashboardRate'));
const DashboardProducts = React.lazy(() => import('./pages/dashboard/DashboardProductsEnhanced'));
const DashboardCart = React.lazy(() => import('./pages/dashboard/DashboardCart'));
const DashboardWishlist = React.lazy(() => import('./pages/dashboard/DashboardWishlist'));
const DashboardCheckout = React.lazy(() => import('./pages/dashboard/DashboardCheckout'));
const DashboardStoreNew = React.lazy(() => import('./pages/dashboard/DashboardStoreNew'));
const DashboardLegal = React.lazy(() => import('./pages/dashboard/DashboardLegal'));
const DashboardAbout = React.lazy(() => import('./pages/dashboard/DashboardAbout'));
const DashboardNotifications = React.lazy(() => import('./pages/dashboard/DashboardNotifications'));
const DashboardShoeCleaning = React.lazy(() => import('./pages/dashboard/DashboardShoeCleaning'));
const DashboardStainRemoval = React.lazy(() => import('./pages/dashboard/DashboardStainRemoval'));
const DashboardSteamIroning = React.lazy(() => import('./pages/dashboard/DashboardSteamIroning'));
const DashboardDryCleaning = React.lazy(() => import('./pages/dashboard/DashboardDryCleaning'));
const DashboardRecommendations = React.lazy(() => import('./pages/dashboard/DashboardRecommendations'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminDashboardModern = React.lazy(() => import('./pages/AdminDashboardModern'));
const AdminOrderManagement = React.lazy(() => import('./pages/AdminOrderManagement'));
const AdminOrderManagementTest = React.lazy(() => import('./components/AdminOrderManagementTest'));
const TestConnection = React.lazy(() => import('./test-connection'));
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
const InventoryManagement = React.lazy(() => import('./pages/InventoryManagement'));
const CustomerManagementTestPage = React.lazy(() => import('./pages/CustomerManagementTestPage'));
const CustomerManagementDirect = React.lazy(() => import('./pages/CustomerManagementDirect'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const ChatSupport = React.lazy(() => import('./components/ChatSupport'));
const ErrorBoundary = React.lazy(() => import('./components/ErrorBoundary'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
const DebugRegistrationPage = React.lazy(() => import('./pages/DebugRegistrationPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const TestNotifications = React.lazy(() => import('./TestNotifications'));
const TestNotificationService = React.lazy(() => import('./TestNotificationService'));
const NotificationTest = React.lazy(() => import('./NotificationTest'));
const NotificationAPITest = React.lazy(() => import('./NotificationAPITest'));
const TestAnalytics = React.lazy(() => import('./TestAnalytics'));
const AuthTest = React.lazy(() => import('./AuthTest'));
// const TestTokenFlow = React.lazy(() => import('./TestTokenFlow'));
const EnhancedReportsAnalytics = React.lazy(() => import('./pages/EnhancedReportsAnalytics'));
const PaymentManagementPage = React.lazy(() => import('./pages/PaymentManagementPage'));
const EnhancedPaymentManagement = React.lazy(() => import('./components/EnhancedPaymentManagement'));
const TestPaymentManagement = React.lazy(() => import('./components/TestPaymentManagement'));
const Register = React.lazy(() => import('./pages/Register'));
const TestAdminDashboard = React.lazy(() => import('./TestAdminDashboard'));
const SimplifiedAdminDashboard = React.lazy(() => import('./SimplifiedAdminDashboard'));
const TestProtectedRoute = React.lazy(() => import('./TestProtectedRoute')); // Added test component
const TestCustomerSegment = React.lazy(() => import('./TestCustomerSegment'));
const CustomerSegmentDetails = React.lazy(() => import('./pages/CustomerSegmentDetails'));
const TestNaiveBayes = React.lazy(() => import('./pages/TestNaiveBayes'));
const DeliveryBoyManagementPage = React.lazy(() => import('./pages/DeliveryBoyManagement'));
const TestDeliveryLogin = React.lazy(() => import('./TestDeliveryLogin'));
const DeliveryBoyTest = React.lazy(() => import('./DeliveryBoyTest'));
const DeliveryBoyLogin = React.lazy(() => import('./DeliveryBoyLogin'));
const DebugDeliveryLogin = React.lazy(() => import('./DebugDeliveryLogin'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main App component
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <div className="min-h-screen bg-white">
            <Router>
              <AppRoutes />
            </Router>
          </div>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Separate component for routes to handle authentication context
const AppRoutes = () => {
  const { loading, user } = useContext(AuthContext);
  
  // Debug logging
  console.log('AppRoutes: Rendering with loading:', loading, 'user:', user);
  
  // Show loading spinner while authentication context is initializing
  if (loading) {
    console.log('AppRoutes: Showing loading spinner');
    return <LoadingSpinner />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login-test" element={<AdminLoginTest />} />
        <Route path="/admin-login-debug" element={<AdminLoginDebug />} />
        <Route path="/debug-registration" element={<DebugRegistrationPage />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/test-notifications" element={<TestNotifications />} />
        <Route path="/test-notification-service" element={<TestNotificationService />} />
        <Route path="/notification-test" element={<NotificationTest />} />
        <Route path="/notification-api-test" element={<NotificationAPITest />} />
        <Route path="/test-analytics" element={<TestAnalytics />} />
        <Route path="/auth-test" element={<AuthTest />} />
        {/* <Route path="/test-token-flow" element={<TestTokenFlow />} /> */}
        <Route path="/register" element={<Register />} />

        {/* Enhanced Reports & Analytics */}
        <Route 
          path="/enhanced-analytics" 
          element={
            <ProtectedRoute roles={['admin']}>
              <EnhancedReportsAnalytics />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect old reports route to enhanced version */}
        <Route 
          path="/reports" 
          element={<Navigate to="/enhanced-analytics" replace />} 
        />

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
          <Route path="steam-ironing" element={<DashboardSteamIroning />} />
          <Route path="dry-cleaning" element={<DashboardDryCleaning />} />
          <Route path="schedule" element={<DashboardSchedule />} />
          <Route path="test-schedule" element={<TestSchedule />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="payment" element={<DashboardPayment />} />
          <Route path="quality" element={<DashboardQuality />} />
          <Route path="rate" element={<DashboardRate />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="cart" element={<DashboardCart />} />
          <Route path="wishlist" element={<DashboardWishlist />} />
          <Route path="checkout" element={<DashboardCheckout />} />
          <Route path="store" element={<DashboardStoreNew />} />
          <Route path="legal" element={<DashboardLegal />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="recommendations" element={<DashboardRecommendations />} />
          <Route path="test-naive-bayes" element={<TestNaiveBayes />} />
        </Route>

        {/* Redirect old dashboard route to new dashboard */}
        <Route 
          path="/dashboard-old" 
          element={<Navigate to="/dashboard/home" replace />} 
        />

        {/* User Profile Page - accessible to all authenticated users */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Legacy Dashboard Route (for backward compatibility) */}
        <Route 
          path="/dashboard-old" 
          element={
            <ProtectedRoute roles={['customer', 'delivery']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Simplified Admin Dashboard Route */}
        <Route 
          path="/simplified-admin-dashboard" 
          element={
            <ProtectedRoute roles={['admin']}>
              <SimplifiedAdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Test Admin Dashboard Route */}
        <Route 
          path="/test-admin-dashboard" 
          element={
            <ProtectedRoute roles={['admin']}>
              <TestAdminDashboard />
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

        {/* Customer Management - only for admin */}
        <Route 
          path="/customer-management" 
          element={
            <ProtectedRoute roles={['admin']}>
              <CustomerManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Inventory Management - only for admin */}
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute roles={['admin']}>
              <InventoryManagement />
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

        {/* Delivery Boy Management */}
        <Route 
          path="/delivery-boy-management" 
          element={
            <ProtectedRoute roles={['admin']}>
              <DeliveryBoyManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Payment Management */}
        <Route 
          path="/admin-payments" 
          element={
            <ProtectedRoute roles={['admin']}>
              <PaymentManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Enhanced Payment Management */}
        <Route 
          path="/enhanced-payments" 
          element={
            <ProtectedRoute roles={['admin']}>
              <EnhancedPaymentManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Test Payment Management */}
        <Route 
          path="/test-payments" 
          element={<TestPaymentManagement />} 
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

        {/* Test Admin Order Management - for debugging */}
        <Route 
          path="/admin-orders-test" 
          element={<AdminOrderManagementTest />} 
        />

        {/* Protected Notifications Page */}
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />

        {/* Test Customer Segment Route */}
        <Route 
          path="/test-customer-segment" 
          element={<TestCustomerSegment />} 
        />

        {/* Customer Segment Details */}
        <Route 
          path="/customer-segment" 
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerSegmentDetails />
            </ProtectedRoute>
          } 
        />

        {/* Test Protected Route */}
        <Route 
          path="/test-protected-route" 
          element={
            <ProtectedRoute roles={['admin']}>
              <TestProtectedRoute />
            </ProtectedRoute>
          } 
        />

        {/* Simplified Admin Dashboard Route */}
        <Route 
          path="/simplified-admin-dashboard" 
          element={
            <ProtectedRoute roles={['admin']}>
              <SimplifiedAdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Test Delivery Login Route */}
        <Route 
          path="/test-delivery-login" 
          element={<TestDeliveryLogin />} 
        />
        
        {/* Delivery Boy Test Route */}
        <Route 
          path="/delivery-boy-test" 
          element={<DeliveryBoyTest />} 
        />
        
        {/* Delivery Boy Login Route */}
        <Route 
          path="/delivery-login" 
          element={<DeliveryBoyLogin />} 
        />
        
        {/* Debug Delivery Boy Login Route */}
        <Route 
          path="/debug-delivery-login" 
          element={<DebugDeliveryLogin />} 
        />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;