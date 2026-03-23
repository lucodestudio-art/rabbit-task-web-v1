import { User } from '../types';

const API_BASE_URL = '/api';

export const uploadAvatarApi = async (file: File): Promise<Partial<User>> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/data/user/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload avatar');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Avatar upload failed');
  }

  const userPayload = result.data;
  
  const partialUser: Partial<User> = {
      name: userPayload.fullName,
      avatar: userPayload.avatar,
      email: userPayload.email,
      role: userPayload.role?.toLowerCase() === 'customer' ? 'user' : userPayload.role?.toLowerCase(),
  };

  return partialUser;
};
