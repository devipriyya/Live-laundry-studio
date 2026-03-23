import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const initialErrors = {
  email: "",
  password: "",
  general: "",
  success: "",
  reset: "",
};

export default function LoginForm({ onSwitchToRegister, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setUser, deliveryBoyLogin, universalLogin } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = { ...initialErrors };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
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

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'deliveryBoy':
        navigate("/delivery-dashboard");
        break;
      case 'laundryStaff':
      case 'staff':
        navigate("/laundry-staff-dashboard");
        break;
      case 'admin':
      case 'assistant':
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", success: "" }));

    try {
      const result = await universalLogin(form.email, form.password);
      
      if (result.success) {
        navigateBasedOnRole(result.role);
        if (onClose) onClose();
        return;
      } else {
        setErrors((prev) => ({ ...prev, general: result.error || "Login failed. Please try again.", success: "" }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: "Login failed. Please try again.", success: "" }));
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

      let role = 'customer';

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
        const response = await fetch(`${API_BASE_URL}/auth/firebase-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0]
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          role = data.user.role;
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0],
            role: role
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (tokenError) {
        console.error('Failed to exchange Firebase token for JWT:', tokenError);
        if (user.email === "admin@gmail.com") {
          role = 'admin';
        }
      }

      navigateBasedOnRole(role);
      if (onClose) onClose();
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
      setErrors((prev) => ({ ...prev, reset: "Email is required" }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrors((prev) => ({ ...prev, reset: "Please enter a valid email" }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setForgotPasswordModal(false);
      setResetEmail("");
      setErrors({ ...initialErrors, success: "Password reset email sent! Check your inbox." });
    } catch (error) {
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      }
      setErrors((prev) => ({ ...prev, reset: errorMessage }));
    }
  };

  const handleResetEmailChange = (event) => {
    setResetEmail(event.target.value);
    if (errors.reset) {
      setErrors((prev) => ({ ...prev, reset: "" }));
    }
  };

  const closeForgotPassword = () => {
    setForgotPasswordModal(false);
    setResetEmail("");
    setErrors((prev) => ({ ...prev, reset: "" }));
  };

  return (
    <>
      <div className="space-y-6 bg-white p-6 rounded-2xl">
        <div className="space-y-3 text-center mb-8">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-100 border border-indigo-200 shadow-lg mb-4">
            <SparklesIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-600 font-medium">Sign in to continue to your account</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotPasswordModal(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
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
            {errors.password && <p className="text-red-600 text-xs mt-1 ml-4 font-medium">{errors.password}</p>}
          </div>

          <div className="flex items-center px-1">
            <input
              id="modal-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
            />
            <label htmlFor="modal-remember-me" className="ml-2 block text-sm text-gray-600 font-medium">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 uppercase tracking-wide"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Or sign in with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
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

        <p className="text-center text-gray-600 text-sm font-medium mt-8">
          New to WashLab?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors underline-offset-4"
          >
            Create Account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scaleIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
            <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>
            
            {errors.reset && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-medium">
                {errors.reset}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group/input">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex-1 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
