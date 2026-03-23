import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Home, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { loginApi } from '../services/authService';
import { useStore } from '../store/useStore';
import Input from './Input';
import SocialButton from './SocialButton';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginStore } = useStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const doLogin = async (emailArg: string, passwordArg: string) => {
    // Reset states
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!emailArg || !passwordArg) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginApi(emailArg, passwordArg);

      // Lưu token và user vào localStorage
      localStorage.setItem('auth_token', response.token);
      try { localStorage.setItem('auth_user', JSON.stringify(response.user)); } catch (e) {}

      // Lưu user và token vào store
      loginStore(response.user, response.token);

      setSuccess(true);

      // Chuyển hướng sang Home sau 1 giây
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await doLogin(email, password);
  };

  // Quick test helpers: autofill and optionally auto-submit
  const quickFill = (emailVal: string, passwordVal: string, submit = false) => {
    setEmail(emailVal);
    setPassword(passwordVal);
    if (submit) {
      // fire-and-forget: doLogin will handle navigation
      doLogin(emailVal, passwordVal);
    }
  };

  // Custom SVGs for Brands
  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );

  const ZaloIcon = () => (
    <svg className="h-5 w-5 text-[#0068FF]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24Z" fill="#0068FF"/>
       <path d="M16 26.5V21H27V19H16V17.5H29.5V26.5H19.5L19 28H29.5V29.5H16V26.5Z" fill="white"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Split - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-green overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-80"
          style={{ backgroundImage: `url('https://picsum.photos/1200/1600?grayscale')` }} // Using abstract/architectural placeholder
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white pb-24">
          <div className="inline-flex items-center space-x-2 mb-6">
             <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                <Home className="w-8 h-8 text-white" />
             </div>
             <span className="text-xl font-bold tracking-wider uppercase">Vin Grand Park Homes</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Tìm tổ ấm <br/> lý tưởng của bạn
          </h1>
          <p className="text-lg text-gray-200 max-w-md leading-relaxed">
            Mua – Thuê – Đầu tư bất động sản Vin Grand Park với hệ sinh thái tiện ích đẳng cấp quốc tế.
          </p>
          
          <div className="mt-8 flex gap-4">
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Thông tin xác thực</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Giá tốt nhất</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Hỗ trợ 24/7</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Split - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white">
             <Home className="w-6 h-6" />
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <div className="flex items-center justify-center space-x-2 text-brand-green font-medium">
               <span className="h-px w-8 bg-brand-green/30"></span>
               <span className="text-sm uppercase tracking-wide text-brand-orange">An cư – Đầu tư – Sinh lời</span>
               <span className="h-px w-8 bg-brand-green/30"></span>
            </div>
          </div>

          {/* Success / Error Messages */}
          {success ? (
             <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
               <CheckCircle className="w-5 h-5 mr-2" />
               <span>Đăng nhập thành công! Đang chuyển hướng...</span>
             </div>
          ) : (
             error && (
               <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
                 <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                 <span>{error}</span>
               </div>
             )
          )}

          {/* Quick test users */}
          {/* <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Test users:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => quickFill('admin@example.com', 'admin123', true)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill('saler@example.com', 'saler123', true)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
              >
                Saler
              </button>
              <button
                type="button"
                onClick={() => quickFill('customer@example.com', 'cust123', true)}
                className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
              >
                Customer
              </button>
            </div>
          </div> */}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              placeholder="seller@test.com"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />
            
            <Input
              label="Mật khẩu"
              placeholder="123456"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-brand-orange transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input 
                   type="checkbox" 
                   checked={rememberMe}
                   onChange={(e) => setRememberMe(e.target.checked)}
                   className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange" 
                />
                <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-brand-orange hover:text-brand-orangeHover font-medium hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className={`
                w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold text-base
                transition-all duration-200 shadow-lg shadow-brand-orange/20
                ${isLoading || success 
                  ? 'bg-brand-orange/70 cursor-not-allowed' 
                  : 'bg-brand-orange hover:bg-brand-orangeHover hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"> </div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
             <SocialButton icon={<GoogleIcon />} label="Google" className="hidden sm:flex" />
             <SocialButton icon={<GoogleIcon />} label="" className="flex sm:hidden" />
             
             <SocialButton icon={<ZaloIcon />} label="Zalo" className="hidden sm:flex" />
             <SocialButton icon={<ZaloIcon />} label="" className="flex sm:hidden" />
             
             <SocialButton icon={<FacebookIcon />} label="Facebook" className="hidden sm:flex" />
             <SocialButton icon={<FacebookIcon />} label="" className="flex sm:hidden" />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-brand-orange font-semibold hover:underline">
              Đăng ký ngay
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <a href="#" className="inline-flex items-center text-gray-500 hover:text-brand-green transition-colors text-sm font-medium group">
               Xem tin không cần đăng nhập 
               <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>

        </div>
        
        {/* Mobile footer copy */}
        <p className="absolute bottom-6 text-xs text-gray-400 lg:hidden">
           © 2024 Vin Grand Park Homes. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;