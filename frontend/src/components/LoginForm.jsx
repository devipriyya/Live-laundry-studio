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

      // Exchange Firebase token for backend JWT token
      try {
        const response = await fetch('http://localhost:5000/api/auth/firebase-login', {
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
        }
      } catch (tokenError) {
        console.error('Failed to exchange Firebase token for JWT:', tokenError);
        // Continue with login even if token exchange fails
      }

      if (user.email === "admin@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
      if (onClose) {
        onClose();
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

      // Exchange Firebase token for backend JWT token
      try {
        const response = await fetch('http://localhost:5000/api/auth/firebase-login', {
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
        }
      } catch (tokenError) {
        console.error('Failed to exchange Firebase token for JWT:', tokenError);
        // Continue with login even if token exchange fails
      }

      if (user.email === "admin@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
      if (onClose) {
        onClose();
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
      <div className="space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-6 text-white shadow-2xl">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            <SparklesIcon className="h-4 w-4" />
            WashLab Access
          </span>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-sm text-emerald-100/80">
            Sign in to pick up where you left off with eco-friendly scheduling and garment tracking.
          </p>
        </div>
        {errors.general && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errors.general}
          </div>
        )}
        {errors.success && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {errors.success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-white placeholder:text-emerald-100/60 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs text-red-200">{errors.email}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 pr-14 text-white placeholder:text-emerald-100/60 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/70 transition hover:text-white"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-200">{errors.password}</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-emerald-100/80">
            <label className="flex items-center gap-3">
              <span className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition ${rememberMe ? "border-emerald-400 bg-emerald-500" : "border-white/30 bg-white/5"}`}
                >
                  {rememberMe && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </span>
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordModal(true)}
              className="font-semibold text-emerald-200 transition hover:text-white"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-sm font-semibold text-white shadow-xl transition hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/60">or</span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 py-4 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
        <div className="text-center text-sm text-emerald-100/80">
          Need an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-white transition hover:text-emerald-200"
          >
            Create one
          </button>
        </div>
      </div>
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
            <h3 className="text-2xl font-semibold">Reset password</h3>
            <p className="mt-2 text-sm text-emerald-100/80">
              Enter your email address and we'll send you a secure reset link.
            </p>
            {errors.reset && (
              <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errors.reset}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="mt-6 space-y-6">
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  placeholder="Your email address"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-white placeholder:text-emerald-100/60 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex-1 rounded-2xl border border-white/15 bg-white/10 py-3 text-sm font-semibold text-emerald-100/80 transition hover:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white transition hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                >
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
