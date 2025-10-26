// Simulate the exact scenario where Firebase registration succeeds but backend fails
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser } = require("firebase/auth");

// Firebase config (same as in your app)
const firebaseConfig = {
  apiKey: "AIzaSyCO91cmzF77qbKLCLbtMWCcnw_O--4l9pU",
  authDomain: "ecowashtracker.firebaseapp.com",
  projectId: "ecowashtracker",
  storageBucket: "ecowashtracker.firebasestorage.app",
  messagingSenderId: "357697203907",
  appId: "1:357697203907:web:8f9647cbc21e64856b7c76",
  measurementId: "G-7KKHPMMRXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function simulateFirebaseOnlyRegistration() {
  console.log('Simulating Firebase-only registration (backend failure)...\n');
  
  const email = `firebaseonly${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  
  try {
    console.log('1. Registering user with Firebase...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase registration successful');
    console.log('   UID:', userCredential.user.uid);
    console.log('   Email:', userCredential.user.email);
    
    // Update profile
    await updateProfile(userCredential.user, { displayName: 'Firebase Only User' });
    console.log('✅ Profile updated');
    
    // Now simulate backend failure
    console.log('\n2. Simulating backend registration failure...');
    console.log('   This would happen if the backend API call fails');
    console.log('   Status: 500 Internal Server Error');
    console.log('   Message: Database connection failed');
    
    // In the real frontend, this is where the Firebase user should be deleted
    console.log('\n3. Proper error handling should delete Firebase user...');
    try {
      await deleteUser(userCredential.user);
      console.log('✅ Firebase user deleted successfully');
    } catch (deleteError) {
      console.log('❌ Failed to delete Firebase user:', deleteError.message);
    }
    
    console.log('\n4. User should see error message in frontend');
    console.log('   Message: "Registration failed. Please try again."');
    
  } catch (error) {
    console.log('❌ Firebase registration failed:', error.code, error.message);
  } finally {
    // Clean up any remaining auth state
    try {
      await signOut(auth);
    } catch (signOutError) {
      // Ignore sign out errors
    }
  }
}

simulateFirebaseOnlyRegistration();