import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { DetailPage } from './pages/DetailPage';
import { Explore } from './pages/Explore';
import { PostProperty } from './pages/PostProperty';
import { uploadAvatarApi } from './services/userService';
import { useStore } from './store/useStore';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { buildImageUrl } from './utils/image';

// Simple placeholder components for other routes
const Search = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tìm kiếm bất động sản</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Reusing existing logic but would be a filterable list */}
          <div className="bg-white p-10 rounded-xl shadow text-center text-slate-500">
             Chức năng tìm kiếm nâng cao đang cập nhật...
          </div>
      </div>
    </div>
);

const Projects = () => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dự án bất động sản</h1>
      <div className="bg-white p-10 rounded-xl shadow text-center text-slate-500">
          Danh sách dự án đang cập nhật...
      </div>
    </div>
);

const Profile = () => {
    const { user, token, logout, setUser } = useStore();
    const navigate = useNavigate();
    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleAvatarClick = () => {
        avatarInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const updatedUser = await uploadAvatarApi(file);
            setUser(updatedUser);
        } catch (error) {
            console.error("Failed to upload avatar:", error);
            alert("Cập nhật ảnh đại diện thất bại!");
        } finally {
            setIsUploading(false);
        }
    };


    const decodeJwt = (t?: string) => {
        if (!t) return null;
        try {
            const parts = t.split('.');
            if (parts.length < 2) return null;
            let payload = parts[1];
            let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4) b64 += '=';
            const json = decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    };

    const payload = decodeJwt(token || undefined);

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Vui lòng đăng nhập</h2>
            <a href="/login" className="bg-brand-600 text-white px-6 py-2 rounded-xl">Đăng nhập ngay</a>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6 mb-6">
                <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                    <img src={buildImageUrl(user.avatar)} className="w-24 h-24 rounded-full border-4 border-brand-50" />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                     <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                    <div className="text-sm text-slate-500">{user.email}</div>
                    <div className="text-xs text-slate-400 mt-1">Role: {user.role}</div>
                </div>
                <div className="ml-4">
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-lg mb-2">Tin đã lưu</h3>
                    <div className="text-3xl font-bold text-brand-600">{user.savedProperties.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-lg mb-2">Số dư ví</h3>
                    <div className="text-3xl font-bold text-accent-500">0 đ</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
                <h3 className="font-bold text-lg mb-3">Dev / Token Info</h3>
                <div className="mb-3">
                    <label className="block text-sm text-slate-500 mb-1">Raw token</label>
                    <textarea readOnly className="w-full p-3 text-xs h-24 bg-slate-50 border border-slate-100 rounded" value={token || ''}></textarea>
                </div>

                <div>
                    <label className="block text-sm text-slate-500 mb-1">Decoded payload</label>
                    <pre className="whitespace-pre-wrap text-xs bg-slate-50 p-3 rounded border border-slate-100" style={{maxHeight: 300, overflow: 'auto'}}>
                        {payload ? JSON.stringify(payload, null, 2) : 'No payload / invalid token'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
  
      <Layout>
        <Routes>
          <Route path="/v1" element={<Home />} />
          <Route path="/" element={<News />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<DetailPage />} />
          <Route path="/new-post" element={<PostProperty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<div className="p-8 text-center">Chat System Placeholder</div>} />
        </Routes>
      </Layout>
   
  );
};

export default App;