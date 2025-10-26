import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import api from "../api";

const initialErrors = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  general: "",
  success: "",
};

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
      validationErrors.name = "Name can only contain letters and spaces";
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
    } else if (calculatePasswordStrength(form.password) < 3) {
      validationErrors.password =
        "Password is too weak. Include uppercase, lowercase, numbers, and special characters";
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
      console.log("Step 1: Registering with Firebase");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      firebaseUser = userCredential.user;
      console.log("Firebase registration successful:", firebaseUser.uid);

      await updateProfile(firebaseUser, { displayName: form.name });
      console.log("Firebase profile updated");

      try {
        console.log("Step 2: Registering with backend API");
        const backendResponse = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
          firebaseUid: firebaseUser.uid,
        });

        console.log("Backend registration successful:", backendResponse.data);

        setErrors((prev) => ({
          ...prev,
          success: "Registration successful! Please sign in to continue...",
        }));

        console.log("Registration completed successfully");

        setTimeout(() => navigate("/login"), 2000);
      } catch (backendError) {
        console.error("Backend registration failed:", backendError);
        console.log("Step 3: Cleaning up Firebase user after backend failure");

        try {
          console.log("Attempting to delete Firebase user:", firebaseUser?.uid);
          if (firebaseUser) {
            await firebaseUser.delete();
            console.log("Firebase user deleted successfully");
          } else {
            console.log("No Firebase user to delete");
          }
        } catch (deleteError) {
          console.error("Failed to delete Firebase user:", deleteError);
          console.warn("User exists in Firebase but not in MongoDB - cleanup failed");
        }

        const errorMessage = backendError.response?.data?.message || "Registration failed. Please try again.";
        console.log("Throwing error with message:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Registration process error:", error);

      let errorMessage = "Registration failed. Please try again.";

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
          if (error.message) {
            errorMessage = error.message;
          }
          break;
      }

      console.log("Setting error message for user:", errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
      console.log("Registration process completed");
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
        });
      } catch (backendError) {
        console.warn("Backend registration failed:", backendError);
      }

      navigate("/dashboard");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: "Google sign-up failed. Please try again." }));
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
                Premium Eco Laundry
              </span>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Reimagine laundry care with WashLab
              </h1>
              <p className="max-w-lg text-lg text-emerald-100/80">
                Create an account to unlock zero-contact pickups, smart scheduling, and detailed garment tracking crafted for modern households.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-emerald-300/40 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Trusted garment care</p>
                  <p className="text-xs text-emerald-100/80">Dedicated fabric specialists for every order</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-emerald-300/40 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <LockClosedIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Protected & private</p>
                  <p className="text-xs text-emerald-100/80">Secure account creation with real-time sync</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-100/80">
              Enjoy personalized recommendations, priority express slots, loyalty perks, and more inside your WashLab dashboard.
            </div>
          </div>

          <div className="w-full">
            <div className="mx-auto w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 space-y-2 text-center">
                <h2 className="text-3xl font-bold text-white">Register into WashLab</h2>
                <p className="text-sm text-emerald-100/80">Sign up to schedule your first pickup in minutes</p>
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

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-white placeholder:text-emerald-100/50 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-200">{errors.name}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 text-white placeholder:text-emerald-100/50 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
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
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 pr-14 text-white placeholder:text-emerald-100/50 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/70 transition hover:text-white"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-emerald-100/70">
                        <span>Password strength</span>
                        <span className="font-semibold text-white">{getPasswordStrengthText()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-200">{errors.password}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-200/70" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-12 py-4 pr-14 text-white placeholder:text-emerald-100/50 focus:border-emerald-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-100/70 transition hover:text-white"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-200">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-4 text-lg font-semibold text-slate-950 transition duration-300 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/60 border-t-transparent"></span>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <div className="mt-6 space-y-4 text-center">
                <p className="text-sm text-emerald-100/70">
                  Already have an account?
                  <Link to="/login" className="ml-2 font-semibold text-emerald-200 transition hover:text-white">
                    Sign in
                  </Link>
                </p>

                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-emerald-100/60">
                  <div className="h-px flex-1 bg-white/10"></div>
                  or
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
