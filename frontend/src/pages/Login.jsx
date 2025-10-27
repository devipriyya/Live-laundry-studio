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
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-16 h-96 w-96 rounded-full bg-pink-100 blur-3xl"></div>
        <div className="absolute top-10 -right-32 h-[28rem] w-[28rem] rounded-full bg-pink-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-100 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,182,193,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,182,193,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-10 text-pink-900">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600">
                <SparklesIcon className="h-4 w-4" />
                Premium Eco Laundry
              </span>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Seamlessly continue your WashLab journey
              </h1>
              <p className="max-w-lg text-lg text-pink-700">
                Sign in to manage smart pickups, review garment timelines, and stay synced with your sustainable care plan.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 transition duration-300 hover:border-pink-200 hover:bg-pink-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-400">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pink-900">Trusted garment care</p>
                  <p className="text-xs text-pink-700">Dedicated fabric specialists for every order</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-pink-50 p-5 transition duration-300 hover:border-pink-200 hover:bg-pink-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-300 to-rose-300">
                  <LockClosedIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pink-900">Protected & private</p>
                  <p className="text-xs text-pink-700">Secure sign-ins with real-time sync</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-6 text-sm text-pink-700">
              Access loyalty perks, transparent garment tracking, and carbon-conscious insights from your WashLab dashboard.
            </div>
          </div>
          <div className="w-full">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 space-y-2 text-center">
                <h2 className="text-3xl font-bold text-pink-900">Sign in to WashLab</h2>
                <p className="text-sm text-pink-700">Continue managing your effortless laundry experience</p>
              </div>
              {errors.general && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.general}
                </div>
              )}
              {errors.success && (
                <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {errors.success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="relative">
                    <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-pink-100 bg-white px-12 py-4 text-pink-900 placeholder:text-pink-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-pink-100 bg-white px-12 py-4 pr-14 text-pink-900 placeholder:text-pink-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 transition hover:text-pink-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-pink-50 px-4 py-3 text-sm text-pink-700">
                  <label className="flex items-center gap-3">
                    <span className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-lg border transition ${rememberMe ? "border-pink-300 bg-pink-500" : "border-pink-200 bg-white"}`}
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
                    className="rounded-xl border border-pink-200 px-3 py-1 font-semibold text-pink-600 transition hover:border-pink-300 hover:bg-pink-100 hover:text-pink-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-6 py-4 text-lg font-semibold text-white transition duration-300 hover:from-pink-400 hover:via-rose-400 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
              <div className="mt-6 space-y-4 text-center">
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-pink-400">
                  <div className="h-px flex-1 bg-pink-100"></div>
                  or
                  <div className="h-px flex-1 bg-pink-100"></div>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-pink-200 bg-white px-6 py-4 text-sm font-semibold text-pink-900 transition duration-300 hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-5 w-5" viewBox="0 0 256 262" role="img" aria-label="Google logo">
                    <path fill="#4285F4" d="M255.68 131.19c0-8.76-.72-17.82-2.28-26.4H130.56v50.1h70.2c-2.82 15.24-11.34 28.26-24.12 36.96v30.72h38.88c22.68-20.88 35.16-51.66 35.16-91.38z" />
                    <path fill="#34A853" d="M130.56 261.1c32.4 0 59.58-10.74 79.44-29.13l-38.88-30.72c-10.8 7.2-24.66 11.31-40.56 11.31-31.14 0-57.48-20.79-66.84-48.9H23.64v30.6c19.74 39.42 60.84 66.84 106.92 66.84z" />
                    <path fill="#FBBC05" d="M63.72 163.66c-4.86-15.24-4.86-31.86 0-47.1V85.96H23.64c-19.8 39.48-19.8 86.04 0 125.52l40.08-29.88z" />
                    <path fill="#EA4335" d="M130.56 51.18c17.64-.3 34.32 6.12 47.1 18.12l35.19-35.19C190.08 11.13 161.01-.51 130.56.02 84.48.02 43.38 27.44 23.64 66.86l40.08 30.6c9.18-28.14 35.52-48.93 66.84-48.93z" />
                  </svg>
                  Continue with Google
                </button>
                <p className="text-sm text-pink-700">
                  Need an account?
                  <Link to="/register" className="ml-2 font-semibold text-pink-600 transition hover:text-pink-800">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-pink-100 bg-white p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-2 text-center">
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-pink-600">
                Secure recovery
              </span>
              <h3 className="text-2xl font-semibold text-pink-900">Reset password</h3>
              <p className="text-sm text-pink-700">
                Enter your email address and we'll send you a secure reset link.
              </p>
            </div>
            {errors.reset && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.reset}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-2xl border border-pink-100 bg-white px-12 py-4 text-pink-900 placeholder:text-pink-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(false)}
                  className="flex-1 rounded-2xl border border-pink-200 bg-white py-3 text-sm font-semibold text-pink-700 transition duration-300 hover:border-pink-300 hover:bg-pink-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-3 text-sm font-semibold text-white transition duration-300 hover:from-pink-400 hover:via-rose-400 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
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
