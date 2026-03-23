import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Home, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import Input from './Input';
import { sendOtpApi, verifyOtpApi, registerApi } from '../services/authService';

type RegisterStep = 'email' | 'otp' | 'password' | 'verify' | 'complete';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<RegisterStep>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'customer' | 'saler'>('customer');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setError(null);

    if (!fullName || !email) {
      setError('Vui lòng điền đầy đủ họ tên và email.');
      return;
    }

    if (role === 'saler' && !phone) {
      setError('Vui lòng nhập số điện thoại cho vai trò Người bán.');
      return;
    }

    // Simple phone validation for sellers
    if (role === 'saler') {
      const phoneRegex = /^[0-9]{9,15}$/;
      if (!phoneRegex.test(phone)) {
        setError('Số điện thoại không hợp lệ (9-15 chữ số).');
        return;
      }
    }
    setIsLoading(true);
    try {
      // Backend only supports email for OTP sending; always send to email
      const to = email;
      const res = await sendOtpApi(to);
      setOtpSent(true);
      setStep('otp');
      setSuccess(res.message || 'Mã OTP đã được gửi tới email của bạn');
    } catch (err: any) {
      setError(err.message || 'Không thể gửi OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    setError(null);

    if (!otp || otp.length < 6) {
      setError('Vui lòng nhập mã OTP hợp lệ (6 ký tự).');
      return;
    }

    setIsLoading(true);
    try {
      // Backend verify expects email param; always verify against email
      const target = email;
      const res = await verifyOtpApi(target, otp);
      setStep('password');
      setSuccess(res.message || 'OTP xác minh thành công!');
    } catch (err: any) {
      setError(err.message || 'Xác minh OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Enter password
  const handlePasswordStep = async () => {
    setError(null);

    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setStep('verify');
    setSuccess(null);
  };

  // Step 4: Robot verification
  const handleVerifyRobot = async () => {
    setError(null);

    if (!isRobotVerified) {
      setError('Vui lòng xác minh bạn không phải robot.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerApi(email, password, fullName, otp, role, phone, companyName);
      setSuccess('Đăng ký thành công!');
      setStep('complete');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    
    if (step === 'email') {
      handleSendOtp();
    } else if (step === 'otp') {
      handleVerifyOtp();
    } else if (step === 'password') {
      handlePasswordStep();
    } else if (step === 'verify') {
      handleVerifyRobot();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Split - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-green overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-80"
          style={{ backgroundImage: `url('https://picsum.photos/1200/1600?grayscale')` }}
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
            Tạo tài khoản <br/> nhanh chóng
          </h1>
          <p className="text-lg text-gray-200 max-w-md leading-relaxed">
            Đăng ký để quản lý tin, lưu yêu thích và nhận thông báo bất động sản.
          </p>
          
          <div className="mt-8 flex gap-4">
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Quản lý tin dễ dàng</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Lưu yêu thích</span>
             </div>
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <CheckCircle className="w-5 h-5 text-brand-orange" />
               <span>Nhận thông báo</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Split - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white">
             <Home className="w-6 h-6" />
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký</h2>
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
               <span>{success}</span>
             </div>
          ) : (
             error && (
               <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2">
                 <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                 <span>{error}</span>
               </div>
             )
          )}

          {/* Progress indicator */}
          <div className="mb-6 flex justify-center space-x-2">
            <div className={`h-2 w-8 rounded ${step === 'email' || step === 'otp' || step === 'password' || step === 'verify' || step === 'complete' ? 'bg-brand-orange' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded ${step === 'otp' || step === 'password' || step === 'verify' || step === 'complete' ? 'bg-brand-orange' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded ${step === 'password' || step === 'verify' || step === 'complete' ? 'bg-brand-orange' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-8 rounded ${step === 'verify' || step === 'complete' ? 'bg-brand-orange' : 'bg-gray-200'}`}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Step 1: Email & Full Name */}
            {(step === 'email') && (
              <>
                <div className="text-sm font-semibold text-gray-700 mb-4">Bước 1: Xác nhận email</div>
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">Chọn vai trò</div>
                      <div className="flex gap-3">
                        <label className={`px-3 py-2 rounded-lg border cursor-pointer ${role === 'customer' ? 'bg-brand-orange text-white border-transparent' : 'bg-white border-gray-200'}`}>
                          <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} className="hidden" />
                          Người mua
                        </label>
                        <label className={`px-3 py-2 rounded-lg border cursor-pointer ${role === 'saler' ? 'bg-brand-orange text-white border-transparent' : 'bg-white border-gray-200'}`}>
                          <input type="radio" name="role" value="saler" checked={role === 'saler'} onChange={() => setRole('saler')} className="hidden" />
                          Người bán
                        </label>
                      </div>
                    </div>
                <Input
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  label="Email "
                  placeholder="user@test.com"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />
                {role === 'saler' && (
                  <Input
                    label="Số điện thoại"
                    placeholder="0987654321"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                )}
                {role === 'saler' && (
                  <Input
                    label="Tên công ty (tùy chọn)"
                    placeholder="Công ty ABC"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                )}
              </>
            )}

            {/* Step 2: OTP Verification */}
            {(step === 'otp') && (
              <>
                <div className="text-sm font-semibold text-gray-700 mb-4">Bước 2: Xác minh OTP</div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                  Mã OTP đã được gửi tới <strong>{email}</strong>
                </div>
                <Input
                  label="Mã OTP (6 ký tự)"
                  placeholder="123456"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm text-brand-orange hover:underline"
                >
                  ← Quay lại
                </button>
              </>
            )}

            {/* Step 3: Password */}
            {(step === 'password') && (
              <>
                <div className="text-sm font-semibold text-gray-700 mb-4">Bước 3: Tạo mật khẩu</div>
                <Input
                  label="Mật khẩu"
                  placeholder="••••••••"
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

                <Input
                  label="Xác nhận mật khẩu"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="text-sm text-brand-orange hover:underline"
                >
                  ← Quay lại
                </button>
              </>
            )}

            {/* Step 4: Robot Verification */}
            {(step === 'verify') && (
              <>
                <div className="text-sm font-semibold text-gray-700 mb-4">Bước 4: Xác minh robot</div>
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="robot-check"
                      checked={isRobotVerified}
                      onChange={(e) => setIsRobotVerified(e.target.checked)}
                      className="w-5 h-5 text-brand-orange rounded focus:ring-brand-orange mt-1 cursor-pointer"
                    />
                    <div className="ml-3">
                      <label htmlFor="robot-check" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-brand-orange" />
                        Tôi không phải robot
                      </label>
                      <p className="text-xs text-gray-500 mt-1">reCAPTCHA</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="text-sm text-brand-orange hover:underline"
                >
                  ← Quay lại
                </button>
              </>
            )}

            {/* Step 5: Complete */}
            {(step === 'complete') && (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-700 font-semibold">Đăng ký thành công!</p>
                <p className="text-gray-600 text-sm mt-2">Chuyển hướng sang trang đăng nhập...</p>
              </div>
            )}

            {step !== 'complete' && (
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold text-base
                  transition-all duration-200 shadow-lg shadow-brand-orange/20
                  ${isLoading 
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
                  <>
                    {step === 'email' && 'Gửi OTP'}
                    {step === 'otp' && 'Xác minh OTP'}
                    {step === 'password' && 'Tiếp tục'}
                    {step === 'verify' && 'Hoàn tất đăng ký'}
                  </>
                )}
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <a href="/login" className="text-brand-orange font-semibold hover:underline">
              Đăng nhập
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <a href="#" className="inline-flex items-center text-gray-500 hover:text-brand-green transition-colors text-sm font-medium group">
               Xem tin không cần đăng nhập 
               <span className="text-gray-400 ml-1">→</span>
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

export default Register;