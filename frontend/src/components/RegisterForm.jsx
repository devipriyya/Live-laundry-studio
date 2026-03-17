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
        const backendResponse = await api.post("/auth/register", {
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
      
        const errorMessage = backendError.response?.data?.message || t('auth.errors.generic_failure');
        throw new Error(errorMessage);
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
          firebaseUid: result.user.uid,
        });
      
        setErrors((prev) => ({
          ...prev,
          success: t('auth.registration_success_msg'),
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
      
        const errorMessage = backendError.response?.data?.message || t('auth.errors.google_failure');
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || t('auth.errors.google_failure');
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
    if (passwordStrength <= 4) return "bg-pink-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return t('auth.strength.weak');
    if (passwordStrength <= 3) return t('auth.strength.fair');
    if (passwordStrength <= 4) return t('auth.strength.good');
    return t('auth.strength.strong');
  };

  return (
    <div className="space-y-6 bg-transparent p-2 text-white">
      <div className="space-y-3 text-center mb-10">
        <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl mb-6 group cursor-default">
          <SparklesIcon className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('auth.create_account')}</h2>
        <p className="text-blue-100/60 font-medium">{t('auth.join_revolution')}</p>
      </div>

      {errors.general && (
        <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-100 text-sm animate-shake">
          {errors.general}
        </div>
      )}

      {errors.success && (
        <div className="p-4 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 rounded-2xl text-teal-100 text-sm">
          {errors.success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-100/90 ml-1">{t('auth.name_label') || t('full_name')}</label>
          <div className="relative group/input">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
            <input
              type="text"
              name="name"
              placeholder={t('auth.name_placeholder') || t('full_name')}
              value={form.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
            />
          </div>
          {errors.name && <p className="text-red-300 text-xs mt-1 ml-4 font-medium">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-100/90 ml-1">{t('auth.email_label')}</label>
          <div className="relative group/input">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
            <input
              type="email"
              name="email"
              placeholder={t('auth.email_placeholder')}
              value={form.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
            />
          </div>
          {errors.email && <p className="text-red-300 text-xs mt-1 ml-4 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-100/90 ml-1">{t('auth.mobile_label') || "Phone Number (Optional)"}</label>
          <div className="relative group/input">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              type="tel"
              name="mobile"
              placeholder={t('auth.mobile_placeholder') || "+1 (555) 000-0000"}
              value={form.mobile || ''}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative group/input">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t('auth.password_placeholder')}
              value={form.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          
          {passwordStrength > 0 && (
            <div className="mt-3 px-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2">
                <span>{t('auth.strength_label')}</span>
                <span className={passwordStrength > 3 ? "text-indigo-300" : "text-white/40"}>{getPasswordStrengthText()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-300 text-xs mt-2 ml-4 font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-blue-100/90 ml-1">{t('auth.confirm_password')}</label>
          <div className="relative group/input">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-300 text-xs mt-1 ml-4 font-medium">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0 active:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 uppercase tracking-wider"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-[3px] border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
              <span>{t('common.processing')}</span>
            </div>
          ) : (
            t('auth.sign_up')
          )}
        </button>
      </form>

      <p className="text-center text-white/50 text-sm font-medium">
        {t('auth.already_have_account')}{" "}
        <button 
          onClick={onSwitchToLogin}
          className="text-white font-black hover:underline transition-colors decoration-blue-400 underline-offset-4"
        >
          {t('auth.sign_in')}
        </button>
      </p>

      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{t('auth.or_sign_up_with')}</span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-semibold hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-3.15.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {t('auth.google_account')}
      </button>
    </div>
  );
};

export default RegisterForm;
