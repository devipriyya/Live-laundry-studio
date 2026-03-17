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
      newErrors.email = t('auth.errors.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('auth.errors.email_invalid');
    }

    if (!form.password) {
      newErrors.password = t('auth.errors.password_required');
    } else if (form.password.length < 6) {
      newErrors.password = t('auth.errors.password_min_length');
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
        setErrors((prev) => ({ ...prev, general: result.error || t('auth.errors.login_failed'), success: "" }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: t('auth.errors.login_failed'), success: "" }));
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
      setErrors((prev) => ({ ...prev, general: t('auth.errors.google_failure') }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, reset: "", success: "", general: "" }));

    if (!resetEmail.trim()) {
      setErrors((prev) => ({ ...prev, reset: t('auth.errors.reset_email_required') }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setErrors((prev) => ({ ...prev, reset: t('auth.errors.reset_email_invalid') }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setForgotPasswordModal(false);
      setResetEmail("");
      setErrors({ ...initialErrors, success: t('auth.errors.reset_email_sent') });
    } catch (error) {
      let errorMessage = t('auth.errors.generic_failure');
      if (error.code === "auth/user-not-found") {
        errorMessage = t('auth.errors.user_not_found');
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
      <div className="space-y-8 bg-transparent p-2 text-white">
        <div className="space-y-3 text-center mb-10">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl mb-6 group cursor-default">
            <SparklesIcon className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{t('auth.welcome_back')}</h2>
          <p className="text-blue-100/60 font-medium">
            {t('auth.sign_in_subtitle')}
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-100 text-sm animate-shake">
            {errors.general}
          </div>
        )}
        {errors.success && (
          <div className="mb-6 p-4 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 rounded-2xl text-teal-100 text-sm">
            {errors.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-blue-100/90 ml-1">{t('auth.email_label')}</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                placeholder={t('auth.email_placeholder')}
              />
            </div>
            {errors.email && <p className="text-red-300 text-xs mt-1 ml-4 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-blue-100/90">{t('auth.password_label')}</label>
              <button
                type="button"
                onClick={() => setForgotPasswordModal(true)}
                className="text-xs font-bold text-white/60 hover:text-white transition-colors"
              >
                {t('auth.forgot_password')}
              </button>
            </div>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-white/40 group-focus-within/input:text-white transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                placeholder={t('auth.password_placeholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-300 text-xs mt-1 ml-4 font-medium">{errors.password}</p>}
          </div>

          <div className="flex items-center px-1">
            <input
              id="modal-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500 transition-colors"
            />
            <label htmlFor="modal-remember-me" className="ml-2 block text-sm text-white/60 font-medium">
              {t('auth.remember_me')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0 active:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-[3px] border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
                <span>{t('common.authentication')}</span>
              </div>
            ) : (
              t('auth.sign_in')
            )}
          </button>
        </form>

        <div className="mt-8 mb-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{t('auth.or_sign_in_with')}</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
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

        <p className="mt-8 text-center text-white/50 text-sm font-medium">
          {t('auth.new_to_washlab')}{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-white font-black hover:underline transition-colors decoration-blue-400 underline-offset-4"
          >
            {t('auth.create_account_link')}
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-scaleIn">
            <h3 className="text-2xl font-bold text-white mb-2">{t('auth.reset_password')}</h3>
            <p className="text-white/60 mb-6">{t('auth.reset_password_subtitle')}</p>
            
            {errors.reset && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-100 text-sm">
                {errors.reset}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-white/40 group-focus-within/input:text-white" />
                </div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={handleResetEmailChange}
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder={t('auth.reset_email_placeholder')}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  {t('auth.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  {t('auth.send_link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
