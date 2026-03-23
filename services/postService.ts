import { Post, Comment } from '../types';

const API_BASE_URL = "/api";

export const createPost = async (formData) => {
  const token = localStorage.getItem("auth_token");

  console.log(
    "[PostService] createPost - Token:",
    token ? "Present" : "Missing"
  );

  const response = await fetch(`${API_BASE_URL}/saler/new-post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ KHÔNG set Content-Type khi dùng FormData
    },
    body: formData,
  });

  console.log("[PostService] createPost - Response status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("[PostService] createPost - Error response:", text);
    throw new Error(text || "Network response was not ok");
  }

  const result = await response.json();
  console.log("[PostService] createPost - Success response:", result);

  return result;
};

export const getFullProjectData = async () => {
  const token = localStorage.getItem("auth_token");

  console.log("[ProjectService] getFullProjectData - Token:", token ? "Present" : "Missing");

  const response = await fetch(`${API_BASE_URL}/data/full-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  console.log("[ProjectService] getFullProjectData - Response status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("[ProjectService] getFullProjectData - Error response:", text);
    throw new Error(text || "Network response was not ok");
  }

  const result = await response.json();
  console.log("[ProjectService] getFullProjectData - Success response:", result);

  return result;
};

/**
 * Lấy danh sách khu (zones)
 */
export const listZonesApi = async () => {
  const token = localStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/data/zones`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(txt || 'Failed to load zones');
  }

  const res = await response.json();
  return res?.data ?? res;
};

/**
 * Lấy danh sách tòa nhà theo zoneId
 */
export const listBuildingsApi = async (zoneId: number | string) => {
  const token = localStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/data/buildings?zoneId=${zoneId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(txt || 'Failed to load buildings');
  }

  const res = await response.json();
  return res?.data ?? res;
};

/**
 * Lấy danh sách căn hộ theo buildingId
 */
export const listApartmentsApi = async (buildingId: number | string) => {

  if (buildingId === null || buildingId === undefined) return [];

  const id = Number(buildingId);

  if (isNaN(id)) {
    console.error("Invalid buildingId:", buildingId);
    return [];
  }

  const url = `${API_BASE_URL}/data/apartments?buildingId=${id}`;

  console.log("GET", url);

  const token = localStorage.getItem('auth_token');

  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    const txt = await response.text();
    console.error("API ERROR:", txt);
    throw new Error(txt || "Failed to load apartments");
  }

  const res = await response.json();

  // backend returns ApiResponse<T> { success, message, data }
  return res?.data ?? res;
};

/**
 * Lấy danh sách bài viết (có pagination)
 * @param page Trang hiện tại (mặc định 1)
 * @param limit Số bài viết trên một trang (mặc định 10)
 */
export const getPostsApi = async (
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; total: number; page: number; limit: number }> => {
  const url = `${API_BASE_URL}/posts?page=${page}&limit=${limit}`;
  console.log(`[PostService] GET ${url}`);
  const token = localStorage.getItem('auth_token');

  try {
    const response = await fetch(url, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[PostService] ✅ getPostsApi success:`, data);
    return data;
  } catch (error) {
    console.error(`[PostService] ❌ getPostsApi error:`, error);
    throw error;
  }
};

export const getHomePostsApi = async (
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; total: number }> => {

  const url = `${API_BASE_URL}/posts/?page=${page}&limit=${limit}`;
  const token = localStorage.getItem("auth_token");

  const response = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const result = await response.json();

  // Backend Spring Boot ApiResponse<T>
  const data = result.data;

  return {
    posts: data.posts,
    total: data.total
  };
};

/**
 * Lấy chi tiết một bài viết
 * @param postId ID của bài viết
 */
export const getPostByIdApi = async (postId: string): Promise<Post> => {
  const url = `${API_BASE_URL}/posts/${postId}`;
  console.log(`[PostService] GET ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Không tìm thấy bài viết');
    }

    const data = await response.json();
    console.log(`[PostService] ✅ getPostByIdApi success:`, data);
    return data;
  } catch (error) {
    console.error(`[PostService] ❌ getPostByIdApi error:`, error);
    throw error;
  }
};

export const toggleLikeApi = async (postCode: string) => {

  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${API_BASE_URL}/posts/${postCode}/like`,
    {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );

  if (!response.ok) {
    throw new Error("Like failed");
  }

  return response.json();
};

export const createCommentApi = async (
  postCode: string,
  content: string,
  parentId?: number
) => {

  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE_URL}/posts/${postCode}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({
      postCode,
      content,
      parentId
    })
  });

  if (!response.ok) {
    throw new Error("Create comment failed");
  }

  return response.json();
};


export const sharePostApi = async (
  postId: string
): Promise<{ success: boolean; shares: number }> => {
  const token = localStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/posts/${postId}/share`;
  console.log(`[PostService] POST ${url}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      throw new Error('Không thể chia sẻ bài viết');
    }

    const data = await response.json();
    console.log(`[PostService] ✅ sharePostApi success:`, data);
    return data;
  } catch (error) {
    console.error(`[PostService] ❌ sharePostApi error:`, error);
    throw error;
  }
};
