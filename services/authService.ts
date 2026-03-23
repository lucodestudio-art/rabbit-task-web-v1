import { AuthResponse, User } from '../types';

const API_BASE_URL = '/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  name?: string;
  otp?: string;
  phone?: string;
}

export const loginApi = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailOrPhone,
        password: password
      } as LoginRequest)
    });

    const data: any = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }

    // Backend returns: { success, message, data: <token string> }
    let token: string | undefined;
    let user = data.user as any | undefined;

    // Get token from response data field
    if (data.data && typeof data.data === 'string') {
      token = data.data;
    } else if (data.token) {
      token = data.token;
    }

    if (!token) {
      throw new Error('Phản hồi không hợp lệ từ máy chủ: thiếu token');
    }

    // If user object is not provided, try to decode token payload
    if (!user) {
      try {
        const parts = token.split('.');
        if (parts.length < 2) throw new Error('Invalid token');
        const payload = parts[1];
        // base64url -> base64
        let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const json = decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const parsed = JSON.parse(json);

        user = {
          id: parsed.sub?.toString() || parsed.id?.toString() || '',
          name: parsed.fullName || parsed.name || '',
          avatar: '',
          role: (parsed.roles && parsed.roles[0] ? parsed.roles[0].toString().toLowerCase() : 'user'),
          savedProperties: [],
          email: parsed.email || ''
        };
      } catch (e) {
        throw new Error('Không thể giải token để lấy thông tin người dùng');
      }
    }

    return {
      token: token,
      user: user
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Đăng nhập thất bại');
  }
};

export const registerApi = async (
  email: string,
  password: string,
  fullName: string,
  otp: string,
  role: 'customer' | 'saler' = 'customer',
  phone?: string,
  companyName?: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
        // also include `name` to match possible backend DTO naming
        name: fullName,
        otp,
        phone
        ,
        companyName
      } as RegisterRequest)
    });

    const data = await response.json();

    // Backend returns ApiResponse(success, message, userDTO)
    if (!response.ok || !data.success) {
      throw new Error(data?.message || 'Đăng ký thất bại');
    }

    // Backend returns user data in data.data field
    const userPayload = data.data;
    if (!userPayload) {
      throw new Error(data?.message || 'Phản hồi không hợp lệ từ máy chủ');
    }

    // Map backend UserDTO to frontend User type
    return {
      id: userPayload.id?.toString() || '',
      name: userPayload.fullName || userPayload.name || '',
      avatar: userPayload.avatar || '',
      role: userPayload.role || 'user',
      savedProperties: userPayload.savedProperties || [],
      email: userPayload.email || email
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Đăng ký thất bại');
  }
};

export const registerSellerApi = async (email: string, password: string, fullName: string, otp: string, phone?: string, companyName?: string) =>
  registerApi(email, password, fullName, otp, 'saler', phone, companyName);

export const sendOtpApi = async (emailOrPhone: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: emailOrPhone })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Không thể gửi mã OTP');
    }

    return { success: true, message: data.message || 'OTP sent' };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Không thể gửi mã OTP');
  }
};

export const verifyOtpApi = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data?.message || 'OTP không hợp lệ');
    }

    return { success: true, message: data.message || 'OTP hợp lệ' };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Không thể xác minh OTP');
  }
};
