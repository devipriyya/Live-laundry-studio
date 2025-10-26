import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import api from "../api";

const DebugRegisterForm = ({ onSwitchToLogin, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
    success: "",
  });
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  const validateForm = () => {
    const validationErrors = { ...errors };

    if (!form.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      validationErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return (
      !validationErrors.name &&
      !validationErrors.email &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (errors.general || errors.success) {
      setErrors((prev) => ({ ...prev, general: "", success: "" }));
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", success: "" }));
    setDebugInfo([]);

    addDebugInfo("Starting registration process");

    try {
      addDebugInfo("Step 1: Registering with Firebase");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      addDebugInfo(`Firebase registration successful. UID: ${userCredential.user.uid}`);
      
      await updateProfile(userCredential.user, { displayName: form.name });
      addDebugInfo("Firebase profile updated");

      // Then, register with our backend
      try {
        addDebugInfo("Step 2: Registering with backend API");
        addDebugInfo(`Sending request to: ${api.defaults.baseURL}/auth/register`);
        addDebugInfo(`Request data: ${JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
          firebaseUid: userCredential.user.uid,
        })}`);
        
        const backendResponse = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
          firebaseUid: userCredential.user.uid,
        });
        
        addDebugInfo(`Backend registration response status: ${backendResponse.status}`);
        addDebugInfo(`Backend registration response data: ${JSON.stringify(backendResponse.data)}`);
        
        // Registration successful
        setErrors((prev) => ({
          ...prev,
          success: "Registration successful!",
        }));
        
        addDebugInfo("Registration completed successfully");
        
        // Close the modal after successful registration
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (backendError) {
        addDebugInfo(`Backend registration failed: ${backendError.message}`);
        addDebugInfo(`Backend error response: ${JSON.stringify(backendError.response?.data)}`);
        
        // If backend registration fails, we should delete the Firebase user
        // to avoid having a user in Firebase but not in our database
        try {
          addDebugInfo("Attempting to delete Firebase user");
          await userCredential.user.delete();
          addDebugInfo("Firebase user deleted successfully");
        } catch (deleteError) {
          addDebugInfo(`Failed to delete Firebase user: ${deleteError.message}`);
        }
        
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error) {
      addDebugInfo(`Registration process failed: ${error.message}`);
      
      let errorMessage = "Registration failed. Please try again.";

      // Handle Firebase-specific errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password registration is currently disabled.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection and try again.";
          break;
        default:
          // Handle our custom error from backend failure
          if (error.message) {
            errorMessage = error.message;
          }
          break;
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
      addDebugInfo("Registration process completed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Debug Registration</h2>
      
      {/* Error Messages */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      {errors.success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {errors.success}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name Field */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Debug Information */}
      {debugInfo.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h3 className="font-bold text-gray-800 mb-2">Debug Information:</h3>
          <div className="text-sm text-gray-700 max-h-40 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1 font-mono text-xs">
                {info}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Switch to Login */}
      <div className="mt-4 text-center">
        <button 
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default DebugRegisterForm;