import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MOCK_PROPERTIES } from '../constants';
import { MapPin, BedDouble, Bath, Maximize, Share2, Heart, Phone, MessageCircle, Calendar, ShieldCheck, School, Hospital, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data
const priceData = [
  { month: 'T1', price: 42 },
  { month: 'T2', price: 43 },
  { month: 'T3', price: 42.5 },
  { month: 'T4', price: 44 },
  { month: 'T5', price: 45 },
  { month: 'T6', price: 45.5 },
];

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleSaveProperty, savedPropertyIds } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  
  // Find property or default to first one for safety in this demo
  const property = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];
  const isSaved = savedPropertyIds.includes(property.id);

  if (!property) return <div>Không tìm thấy bất động sản</div>;

  return (
    <div className="pb-24 pt-4 md:pt-8 bg-white min-h-screen">
       <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-4">
             <Link to="/" className="flex items-center text-slate-500 hover:text-brand-600 transition">
                <ArrowLeft size={20} className="mr-1" /> Quay lại
             </Link>
             <div className="flex gap-2">
                <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                   <Share2 size={20} className="text-slate-600" />
                </button>
                <button 
                  onClick={() => toggleSaveProperty(property.id)} 
                  className={`p-2 rounded-full transition ${isSaved ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                   <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>
             </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 rounded-3xl overflow-hidden h-[400px] md:h-[500px] mb-8">
             <div className="h-full relative group cursor-pointer">
                <img src={property.images[0]} className="w-full h-full object-cover" alt="Main" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
             </div>
             <div className="grid grid-cols-2 gap-2 md:gap-4 h-full">
                <img src={property.images[1] || property.images[0]} className="w-full h-full object-cover" alt="Sub 1" />
                <img src={property.images[2] || property.images[0]} className="w-full h-full object-cover" alt="Sub 2" />
                <img src={property.images[0]} className="w-full h-full object-cover" alt="Sub 3" />
                <div className="relative w-full h-full">
                   <img src={property.images[1] || property.images[0]} className="w-full h-full object-cover blur-[2px]" alt="More" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-black/50 transition">
                      +5 ảnh
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
             {/* Left Column: Info */}
             <div className="lg:col-span-2">
                <div className="mb-6">
                   <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-lg text-sm font-semibold mb-3 inline-block">
                      {property.type} • {property.transactionType}
                   </span>
                   <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                   <div className="flex items-center text-slate-500 mb-4">
                      <MapPin size={18} className="mr-2 text-brand-600" />
                      {property.address}, {property.district}, {property.city}
                   </div>
                   
                   <div className="flex flex-wrap gap-4 md:gap-8 py-6 border-y border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-lg"><BedDouble size={24} className="text-slate-700" /></div>
                         <div>
                            <span className="block text-sm text-slate-500">Phòng ngủ</span>
                            <span className="font-bold text-slate-900">{property.bedrooms}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-lg"><Bath size={24} className="text-slate-700" /></div>
                         <div>
                            <span className="block text-sm text-slate-500">Phòng tắm</span>
                            <span className="font-bold text-slate-900">{property.bathrooms}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-lg"><Maximize size={24} className="text-slate-700" /></div>
                         <div>
                            <span className="block text-sm text-slate-500">Diện tích</span>
                            <span className="font-bold text-slate-900">{property.area} m²</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-50 rounded-lg"><ShieldCheck size={24} className="text-slate-700" /></div>
                         <div>
                            <span className="block text-sm text-slate-500">Pháp lý</span>
                            <span className="font-bold text-slate-900">{property.legal}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mb-8">
                   <h2 className="text-xl font-bold text-slate-900 mb-4">Mô tả chi tiết</h2>
                   <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {property.description}
                      <br/><br/>
                      Vị trí đắc địa, giao thông thuận tiện kết nối đến trung tâm thành phố. Khu vực an ninh, dân trí cao.
                      Tiện ích xung quanh đầy đủ: Chợ, siêu thị, trường học các cấp, bệnh viện...
                   </p>
                </div>

                <div className="mb-8">
                   <h2 className="text-xl font-bold text-slate-900 mb-4">Tiện ích xung quanh</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                         <School className="text-blue-500" />
                         <div>
                            <div className="font-medium text-slate-800">Trường quốc tế AIS</div>
                            <div className="text-xs text-slate-500">500m • 5 phút đi bộ</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                         <Hospital className="text-red-500" />
                         <div>
                            <div className="font-medium text-slate-800">Bệnh viện Vinmec</div>
                            <div className="text-xs text-slate-500">1.2km • 5 phút xe máy</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Price History Chart */}
                <div className="mb-8">
                   <h2 className="text-xl font-bold text-slate-900 mb-4">Lịch sử biến động giá</h2>
                   <div className="h-[300px] w-full bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={priceData}>
                            <defs>
                               <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            />
                            <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             {/* Right Column: Agent & Contact Sticky */}
             <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-24">
                   <div className="mb-6">
                      <span className="text-slate-500 text-sm">Giá niêm yết</span>
                      <div className="text-4xl font-bold text-brand-600 mt-1">
                         {property.price} <span className="text-xl font-medium text-slate-600">{property.priceUnit}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                         ~ {(property.price * 1000 / property.area).toFixed(1)} triệu/m²
                      </div>
                   </div>

                   <hr className="border-slate-100 my-6" />

                   <div className="flex items-center gap-4 mb-6">
                      <img src={property.agent.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-brand-100" alt="Agent" />
                      <div>
                         <div className="font-bold text-slate-800 text-lg">{property.agent.name}</div>
                         <div className="text-sm text-slate-500">Môi giới chuyên nghiệp</div>
                         <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500 font-bold">★ {property.agent.rating}</span>
                            <span className="text-xs text-slate-400">({property.agent.reviewCount} đánh giá)</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <button className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-accent-500/20">
                         <Phone size={20} /> Gọi điện ngay
                      </button>
                      <button className="w-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition">
                         <MessageCircle size={20} /> Chat với môi giới
                      </button>
                      <button className="w-full border border-slate-200 hover:border-brand-500 hover:text-brand-600 text-slate-600 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition">
                         <Calendar size={20} /> Đặt lịch xem nhà
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};