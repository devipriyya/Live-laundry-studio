import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const initialErrors = {
  email: "",
  password: "",
  general: "",
  success: "",
  reset: "",
};

export default function Login() {
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
      const errorMessage = error?.message || "Google sign-in failed. Please try again.";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-16 h-96 w-96 rounded-full bg-emerald-500/40 blur-3xl"></div>
        <div className="absolute top-10 -right-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-10 text-white">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-200">
                <SparklesIcon className="h-4 w-4" />
                WashLab Member Access
              </span>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Welcome back to your sustainable laundry hub
              </h1>
              <p className="max-w-lg text-lg text-emerald-100/80">
                Access your scheduled pickups, monitor garment care, and continue your eco-friendly routine with a single secure login.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-emerald-300/40 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Secure access</p>
                  <p className="text-xs text-emerald-100/80">Multi-layer protection on every login</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-emerald-300/40 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Real-time updates</p>
                  <p className="text-xs text-emerald-100/80">Track garment care progress instantly</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-100/80">
              Enjoy priority bookings, transparent garment tracking, and personalized sustainability stats every time you sign in.
            </div>
          </div>
          <div className="w-full">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 space-y-2 text-center">
                <h2 className="text-3xl font-bold text-white">Sign in to WashLab</h2>
                <p className="text-sm text-emerald-100/80">Continue managing your effortless laundry experience</p>
              </div>
              {errors.general && (
                <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errors.general}
                </div>
              )}
              {errors.success && (
                <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
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
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-4 text-lg font-semibold text-slate-950 transition duration-300 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/60 border-t-transparent"></div>
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
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 256 262" role="img" aria-label="Google logo">
                  <path fill="#4285F4" d="M255.68 131.19c0-8.76-.72-17.82-2.28-26.4H130.56v50.1h70.2c-2.82 15.24-11.34 28.26-24.12 36.96v30.72h38.88c22.68-20.88 35.16-51.66 35.16-91.38z" />
                  <path fill="#34A853" d="M130.56 261.1c32.4 0 59.58-10.74 79.44-29.13l-38.88-30.72c-10.8 7.2-24.66 11.31-40.56 11.31-31.14 0-57.48-20.79-66.84-48.9H23.64v30.6c19.74 39.42 60.84 66.84 106.92 66.84z" />
                  <path fill="#FBBC05" d="M63.72 163.66c-4.86-15.24-4.86-31.86 0-47.1V85.96H23.64c-19.8 39.48-19.8 86.04 0 125.52l40.08-29.88z" />
                  <path fill="#EA4335" d="M130.56 51.18c17.64-.3 34.32 6.12 47.1 18.12l35.19-35.19C190.08 11.13 161.01-.51 130.56.02 84.48.02 43.38 27.44 23.64 66.86l40.08 30.6c9.18-28.14 35.52-48.93 66.84-48.93z" />
                </svg>
                Continue with Google
              </button>
              <div className="mt-8 text-center text-sm text-emerald-100/70">
                Need an account?{" "}
                <Link to="/register" className="font-semibold text-white transition hover:text-emerald-200">
                  Create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <h3 className="text-2xl font-semibold text-white">Reset password</h3>
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
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-white placeholder:text-emerald-100/60 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(false)}
                  className="flex-1 rounded-2xl border border-white/15 bg-white/10 py-3 text-sm font-semibold text-emerald-100/80 transition duration-300 hover:border-emerald-300/40 hover:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
