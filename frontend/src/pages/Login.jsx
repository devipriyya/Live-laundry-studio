import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  GoogleAuthProvider 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { SparklesIcon, ShieldCheckIcon, LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LanguageToggle from "../components/LanguageToggle";

const initialErrors = {
  email: "",
  password: "",
  general: "",
  success: "",
  reset: "",
};

export default function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { universalLogin, assistantDemoLogin } = useContext(AuthContext);

  const handleAssistantDemo = async () => {
    try {
      setLoading(true);
      await assistantDemoLogin();
      navigate("/admin-dashboard");
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: t('auth.errors.login_failed') }));
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", success: "" }));

    try {
      const result = await universalLogin(form.email, form.password);
      
      if (result.success) {
        switch (result.role) {
          case 'deliveryBoy':
            navigate("/delivery-dashboard");
            break;
          case 'admin':
          case 'assistant':
            navigate("/admin-dashboard");
            break;
          case 'laundryStaff':
            navigate("/laundry-staff-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
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

      if (user.email === "admin@gmail.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error?.message || t('auth.errors.google_failure');
      setErrors((prev) => ({ ...prev, general: errorMessage }));
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

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7] overflow-hidden px-4 py-12 font-sans">
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#FBBF24]/5 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-200/10 blur-[100px] animate-pulse delay-1000"></div>
      
      <div className="relative w-full max-w-[480px] animate-fadeIn">
        {/* Brand Identity */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 rounded-[2rem] bg-white shadow-xl shadow-amber-100/50 mb-6 group transition-all duration-500 hover:rotate-6">
            <SparklesIcon className="h-10 w-10 text-[#FBBF24]" />
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight mb-2">WashLab</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">{t('landing.footer_desc').substring(0, 22)}</p>
        </div>

        {/* Professional Login Card */}
        <div className="bg-white rounded-[3rem] p-8 sm:p-14 shadow-[0_25px_50px_-12px_rgba(251,191,36,0.15)] border border-amber-50 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-black text-[#0F172A] mb-2 font-sans">{t('auth.login_title')}</h2>
              <p className="text-slate-400 font-medium text-sm">{t('auth.sign_in_subtitle')}</p>
            </div>

            {errors.general && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs font-bold animate-shake">
                {errors.general}
              </div>
            )}
            
            {errors.success && (
              <div className="mb-8 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-700 text-xs font-bold">
                {errors.success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.email_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-300 group-focus-within/input:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder={t('auth.email_placeholder')}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('auth.password_label')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-300 group-focus-within/input:text-[#FBBF24] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[#0F172A] placeholder-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/20 focus:border-[#FBBF24] focus:bg-white transition-all duration-300"
                    placeholder={t('auth.password_placeholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-[#0F172A] transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <div className="relative flex items-center h-5">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="w-4 h-4 text-[#FBBF24] border-slate-200 rounded focus:ring-[#FBBF24] cursor-pointer"
                    />
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-slate-500 cursor-pointer">
                    {t('auth.remember_me')}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(true)}
                  className="text-xs font-bold text-[#FBBF24] hover:text-amber-600 transition-colors"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#0F172A] text-[#FBBF24] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-[#1E293B] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('common.processing')}</span>
                  </div>
                ) : (
                  t('auth.sign_in')
                )}
              </button>
            </form>

            <div className="my-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{t('auth.or_sign_in_with')}</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-3.15.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t('auth.google_account').split(' ')[0]}
              </button>
              <button
                onClick={handleAssistantDemo}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-amber-700 font-bold text-xs hover:bg-amber-100 transition-all active:scale-[0.98]"
              >
                <ShieldCheckIcon className="h-4 w-4" />
                Demo
              </button>
            </div>

            <p className="mt-10 text-center text-slate-400 text-sm font-medium">
              {t('auth.dont_have_account')}{" "}
              <Link
                to="/register"
                className="text-[#FBBF24] font-black hover:text-amber-600 transition-all underline decoration-amber-200 underline-offset-8"
              >
                {t('auth.create_account_link')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
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
                  onChange={(event) => setResetEmail(event.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder={t('auth.reset_email_placeholder')}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForgotPasswordModal(false)}
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
    </div>
  );
}