import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import api from "./api";
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
};

export default function DebugDeliveryLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();
  const { deliveryBoyLogin } = useContext(AuthContext);

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
    setDebugInfo("");

    try {
      console.log("DebugDeliveryLogin: Starting authentication process");
      console.log("DebugDeliveryLogin: API config:", {
        baseURL: api.defaults.baseURL,
        headers: api.defaults.headers
      });
      
      // Log the request data
      console.log("DebugDeliveryLogin: Sending login request with:", {
        email: form.email,
        password: form.password
      });

      // Direct API call to test
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      console.log("DebugDeliveryLogin: Raw API response:", response);

      if (response.data && response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setDebugInfo("Login successful! Redirecting...");
        
        // Small delay before redirect
        setTimeout(() => {
          navigate('/delivery-dashboard');
        }, 1000);
      } else {
        setErrors((prev) => ({ ...prev, general: "Invalid response from server" }));
      }
    } catch (err) {
      console.error("DebugDeliveryLogin: Login error:", err);
      console.error("DebugDeliveryLogin: Error response:", err.response);
      
      // Log detailed error information
      const errorInfo = {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        } : null,
        request: err.request ? "Request made but no response received" : "No request made"
      };
      
      console.error("DebugDeliveryLogin: Detailed error info:", errorInfo);
      setDebugInfo(`Error: ${JSON.stringify(errorInfo, null, 2)}`);
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setErrors((prev) => ({ ...prev, general: "Bad request - check your credentials" }));
            break;
          case 401:
            setErrors((prev) => ({ ...prev, general: "Invalid email or password" }));
            break;
          case 403:
            setErrors((prev) => ({ ...prev, general: "Access denied. You may not have delivery boy permissions." }));
            break;
          case 500:
            setErrors((prev) => ({ ...prev, general: "Server error. Please try again later." }));
            break;
          default:
            setErrors((prev) => ({ ...prev, general: err.response.data?.message || "Login failed. Please try again." }));
        }
      } else {
        setErrors((prev) => ({ ...prev, general: "Network error. Please check your connection." }));
      }
    } finally {
      setLoading(false);
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
        <div className="grid w-full max-w-md gap-8">
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <LockClosedIcon className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Debug Delivery Boy Login</h2>
              <p className="mt-2 text-emerald-100/80">
                Debug login for delivery boy accounts
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-emerald-100">
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border-0 bg-white/10 py-3 pl-10 pr-3 text-white placeholder:text-emerald-200/50 focus:ring-2 focus:ring-emerald-500 sm:text-sm ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-emerald-100">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border-0 bg-white/10 py-3 pl-10 pr-10 text-white placeholder:text-emerald-200/50 focus:ring-2 focus:ring-emerald-500 sm:text-sm ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-emerald-300 hover:text-emerald-100" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-emerald-300 hover:text-emerald-100" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {errors.general && (
                <div className="rounded-lg bg-red-500/20 p-3">
                  <p className="text-sm text-red-200">{errors.general}</p>
                </div>
              )}

              {errors.success && (
                <div className="rounded-lg bg-emerald-500/20 p-3">
                  <p className="text-sm text-emerald-200">{errors.success}</p>
                </div>
              )}

              {debugInfo && (
                <div className="rounded-lg bg-yellow-500/20 p-3">
                  <p className="text-sm text-yellow-200 whitespace-pre-wrap">{debugInfo}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-emerald-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Debug Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-transparent px-2 text-emerald-200/80">
                    Predefined Test Accounts
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <div className="rounded-lg bg-white/5 p-3 text-xs">
                  <div className="font-medium text-emerald-200">Mike Johnson</div>
                  <div className="text-emerald-100/80">mike.delivery@fabrico.com / delivery123</div>
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-xs">
                  <div className="font-medium text-emerald-200">Sarah Miller</div>
                  <div className="text-emerald-100/80">sarah.delivery@fabrico.com / delivery123</div>
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-xs">
                  <div className="font-medium text-emerald-200">Tom Wilson</div>
                  <div className="text-emerald-100/80">tom.delivery@fabrico.com / delivery123</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-emerald-200/60">
            <a href="/" className="font-medium text-emerald-400 hover:text-emerald-300">
              Back to main login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}