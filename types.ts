export type PaginationResponse<T> = {
  posts: T[];
  total: number;
  page: number;
  limit: number;
};

export interface CommentType {
  id: number
  content: string
  parentId?: number
  createdAt: string
  userName: string
  userAvatar?: string
}

export enum PropertyType {
  APARTMENT = 'Căn hộ',
  HOUSE = 'Nhà phố',
  VILLA = 'Biệt thự',
  LAND = 'Đất nền',
  OFFICE = 'Văn phòng'
}

export enum TransactionType {
  SALE = 'Căn hộ ',
  RENT = 'Cho thuê',
  PROJECT = 'Dự án'
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  phone: string;
  verified: boolean;
  soldCount: number;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  district: string;
  city: string;
  price: number; // in Billion VND
  priceUnit: 'Tỷ' | 'Triệu/m2' | 'Triệu/tháng';
  area: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  type: PropertyType;
  transactionType: TransactionType;
  direction: string;
  legal: string;
  description: string;
  agent: Agent;
  isHot?: boolean;
  postedDate: string;
  coordinates: { lat: number, lng: number };
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'user' | 'agent' | 'admin';
  savedProperties: string[];
  email: string;
}

export interface Project {
  id: string;
  name: string;
  investor: string;
  status: 'Đang mở bán' | 'Sắp bàn giao' | 'Đã bàn giao';
  thumbnail: string;
  minPrice: string;
  location: string;
}


export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface Post {
  seller: {
    email: string;
    name: string;
    phone: string;
    avatar: string;
  };
  title: string;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: Comment[];
  shares: number;
  liked: boolean;
}
export type AuthStep = 'REGISTER' | 'OTP' | 'SUCCESS';

export interface RegisterFormData {
  fullName: string;
  contact: string; // Email or Phone
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

export interface OTPFormData {
  code: string;
}

export interface UserSession {
  emailOrPhone: string;
  fullName: string;
}