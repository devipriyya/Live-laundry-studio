import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
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

const Register = () => {
  const { t } = useTranslation();
  const initialErrors = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
    success: "",
  };

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
      validationErrors.name = t('auth.errors.name_required');
    } else if (form.name.trim().length < 2) {
      validationErrors.name = t('auth.errors.name_min_length');
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      validationErrors.name = t('auth.errors.name_letters_only');
    }

    if (!form.email.trim()) {
      validationErrors.email = t('auth.errors.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = t('auth.errors.email_invalid');
    }

    if (!form.password) {
      validationErrors.password = t('auth.errors.password_required');
    } else if (form.password.length < 8) {
      validationErrors.password = t('auth.errors.password_min_length');
    } else if (calculatePasswordStrength(form.password) < 3) {
      validationErrors.password = t('auth.errors.password_weak');
    }

    if (!form.confirmPassword) {
      validationErrors.confirmPassword = t('auth.errors.confirm_password_required');
    } else if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = t('auth.errors.passwords_not_match');
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
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "customer",
          firebaseUid: firebaseUser.uid,
        });

        setErrors((prev) => ({
          ...prev,
          success: t('auth.registration_success_msg'),
        }));

        setTimeout(() => navigate("/login"), 2000);
      } catch (backendError) {
        if (backendError.response?.data?.message?.includes("User already exists")) {
          setErrors((prev) => ({ 
            ...prev, 
            general: t('auth.errors.email_exists'),
            success: ""
          }));
        } else {
          try {
            if (firebaseUser) await firebaseUser.delete();
          } catch (deleteError) {
            console.error("Failed to delete Firebase user:", deleteError);
          }

          const errorMessage = backendError.response?.data?.message || t('auth.errors.generic_failure');
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      let errorMessage = t('auth.errors.generic_failure');

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = t('auth.errors.email_exists');
          break;
        case "auth/invalid-email":
          errorMessage = t('auth.errors.email_invalid');
          break;
        case "auth/weak-password":
          errorMessage = t('auth.errors.password_weak_firebase');
          break;
        case "auth/operation-not-allowed":
          errorMessage = t('auth.errors.registration_disabled');
          break;
        case "auth/network-request-failed":
          errorMessage = t('auth.errors.network_error');
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
        });
      } catch (backendError) {
        console.warn("Backend registration failed:", backendError);
      }

      navigate("/dashboard");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: t('auth.errors.google_failure') }));
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
    if (passwordStrength <= 2) return t('auth.strength.weak');
    if (passwordStrength <= 3) return t('auth.strength.fair');
    if (passwordStrength <= 4) return t('auth.strength.good');
    return t('auth.strength.strong');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7] overflow-hidden px-4 py-12 font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#FBBF24]/5 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-200/10 blur-[100px] animate-pulse delay-1000"></div>
      
      <div className="relative w-full max-w-[480px] animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 rounded-[2rem] bg-white shadow-xl shadow-amber-100/50 mb-6 group transition-all duration-500 hover:rotate-6">
            <SparklesIcon className="h-10 w-10 text-[#FBBF24]" />
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight mb-2">WashLab</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">{t('dashboard.hero_subtitle')}</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 sm:p-14 shadow-[0_25px_50px_-12px_rgba(251,191,36,0.15)] border border-amber-50 relative overflow-hidden">
          <div className="absolute top-4 right-8">
            <LanguageToggle />
          </div>
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-[#0F172A] mb-2">{t('auth.create_account')}</h2>
              <p className="text-slate-400 font-medium text-sm">{t('auth.join_revolution')}</p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs font-bold animate-shake">
                {errors.general}
              </div>
            )}
            
            {errors.success && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-700 text-xs font-bold">
                {errors.success}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.name_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-300 group-focus-within:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.email_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-300 group-focus-within:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder="name@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.password_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-300 group-focus-within:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-[#0F172A] transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-3 px-1">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                      <span className="text-slate-400">{t('auth.strength_label')}</span>
                      <span className={passwordStrength > 3 ? "text-emerald-500" : "text-amber-500"}>{getPasswordStrengthText()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.confirm_password_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-300 group-focus-within:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-[#0F172A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#0F172A] text-[#FBBF24] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-[#1E293B] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('common.processing')}</span>
                  </div>
                ) : (
                  t('auth.create_account')
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{t('auth.or_signup_with')}</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-3.15.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('auth.google_account')}
            </button>

            <p className="mt-10 text-center text-slate-400 text-sm font-medium">
              {t('auth.already_have_account')}{" "}
              <Link
                to="/login"
                className="text-[#FBBF24] font-black hover:text-amber-600 transition-all underline decoration-amber-200 underline-offset-8"
              >
                {t('auth.sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
