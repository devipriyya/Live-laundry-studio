import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const initialErrors = {
  email: "",
  password: "",
  general: "",
  success: "",
  reset: "",
};

export default function LoginForm({ onSwitchToRegister, onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { ...initialErrors };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (errors.general || errors.success) {
      setErrors((prev) => ({ ...prev, general: "", success: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", success: "" }));

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      if (user.email === "admin@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, general: errorMessage, success: "" }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrors((prev) => ({ ...prev, general: "", success: "" }));

      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      if (user.email === "admin@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: "Google sign-in failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, reset: "", success: "", general: "" }));

    if (!resetEmail.trim()) {
      setErrors((prev) => ({ ...prev, reset: "Please enter your email address" }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrors((prev) => ({ ...prev, reset: "Please enter a valid email address" }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setForgotPasswordModal(false);
      setResetEmail("");
      setErrors({ ...initialErrors, success: "Password reset email sent! Please check your inbox." });
    } catch (error) {
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      }
      setErrors((prev) => ({ ...prev, reset: errorMessage }));
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Login to Laundrokart</h2>
      </div>

      {/* Error Messages */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {errors.general}
        </div>
      )}

      {errors.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          {errors.success}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-4 pr-12 bg-gray-100 border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setForgotPasswordModal(true)}
            className="text-sm text-pink-500 hover:text-pink-600 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-lg rounded-full hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              LOGGING IN...
            </div>
          ) : (
            "LOGIN"
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center">
        <button 
          onClick={onSwitchToRegister}
          className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
        >
          Want to Register?
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 text-center">
        <p className="text-gray-500 text-sm">Login with your social media account</p>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center gap-4">
        {/* Facebook Button */}
        <button
          onClick={() => {/* Add Facebook login logic */}}
          disabled={loading}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a secure reset link.
            </p>

            {errors.reset && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {errors.reset}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(event) => {
                    setResetEmail(event.target.value);
                    if (errors.reset) {
                      setErrors((prev) => ({ ...prev, reset: "" }));
                    }
                  }}
                  className="w-full px-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordModal(false);
                    setResetEmail("");
                    setErrors((prev) => ({ ...prev, reset: "" }));
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
