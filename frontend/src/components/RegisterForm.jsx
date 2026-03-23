import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import api from "../api";

const initialErrors = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  general: "",
  success: "",
};

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const validateForm = () => {
    const validationErrors = { ...initialErrors };

    if (!form.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      validationErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      validationErrors.name = "Name can only contain letters";
    }

    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      validationErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    } else if (calculatePasswordStrength(form.password) < 3) {
      validationErrors.password = "Password is too weak";
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

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

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

    let firebaseUser = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: form.name });

      try {
        const backendResponse = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
          firebaseUid: firebaseUser.uid,
        });
      
        setErrors((prev) => ({
          ...prev,
          success: "Registration successful! Redirecting...",
        }));
      
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (backendError) {
        try {
          if (firebaseUser) {
            await firebaseUser.delete();
          }
        } catch (deleteError) {
          console.error("Failed to delete Firebase user:", deleteError);
        }
      
        const errorMessage = backendError.response?.data?.message || "Registration failed. Please try again.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Registration is currently disabled";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
          break;
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setErrors((prev) => ({ ...prev, general: "", success: "" }));

      const result = await signInWithPopup(auth, googleProvider);

      try {
        await api.post("/auth/register", {
          name: result.user.displayName,
          email: result.user.email,
          role: "customer",
          firebaseUid: result.user.uid,
        });
      
        setErrors((prev) => ({
          ...prev,
          success: "Registration successful! Redirecting...",
        }));
    
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (backendError) {
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error("Failed to sign out user:", signOutError);
        }
      
        const errorMessage = backendError.response?.data?.message || "Google sign-up failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "Google sign-up failed";
      setErrors((prev) => ({ 
        ...prev, 
        general: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-emerald-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl">
      <div className="space-y-3 text-center mb-8">
        <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-100 border border-indigo-200 shadow-lg mb-4">
          <SparklesIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <p className="text-gray-600 font-medium">Join the laundry revolution</p>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium">
          {errors.general}
        </div>
      )}

      {errors.success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-sm font-medium">
          {errors.success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
          <div className="relative group/input">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
            />
          </div>
          {errors.name && <p className="text-red-600 text-xs mt-1 ml-4 font-medium">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
          <div className="relative group/input">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
            />
          </div>
          {errors.email && <p className="text-red-600 text-xs mt-1 ml-4 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number (Optional)</label>
          <div className="relative group/input">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              type="tel"
              name="mobile"
              placeholder="+1 (555) 000-0000"
              value={form.mobile || ''}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
          <div className="relative group/input">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          
          {passwordStrength > 0 && (
            <div className="mt-3 px-1">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-2">
                <span>Password Strength</span>
                <span className={passwordStrength > 3 ? "text-green-600" : "text-amber-600"}>{getPasswordStrengthText()}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-600 text-xs mt-2 ml-4 font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
          <div className="relative group/input">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 ml-4 font-medium">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 uppercase tracking-wide"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "SIGN UP"
          )}
        </button>
      </form>

      <p className="text-center text-gray-600 text-sm font-medium">
        Already have an account?{" "}
        <button 
          onClick={onSwitchToLogin}
          className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors underline-offset-4"
        >
          Sign In
        </button>
      </p>

      <div className="mt-6 mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Or sign up with</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full py-3.5 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-3 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-[0.98]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-3.15.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
};

export default RegisterForm;
