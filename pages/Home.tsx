import React from 'react';
import { useStore } from '../store/useStore';
import { PropertyCard } from '../components/PropertyCard';
import { Search, MapPin, Building2, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { MOCK_PROJECTS, CITIES } from '../constants';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { properties } = useStore();
  const featuredProperties = properties.filter(p => p.isHot);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Luxury Home"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Tìm bất động sản dễ dàng <br/> <span className="text-brand-400">Giao dịch an tâm</span>
          </h1>
          <p className="text-slate-200 mb-8 text-lg max-w-2xl mx-auto hidden md:block">
            Nền tảng công nghệ BĐS tiên phong tại Việt Nam. Kết nối chủ nhà, môi giới và khách mua với dữ liệu minh bạch.
          </p>

          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto">
             <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input 
                      type="text" 
                      placeholder="Tìm theo khu vực, dự án, tên đường..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium placeholder-slate-400"
                   />
                </div>
                <div className="md:w-48 relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <select className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium appearance-none cursor-pointer">
                      <option>Tất cả loại hình</option>
                      <option>Căn hộ</option>
                      <option>Nhà phố</option>
                      <option>Đất nền</option>
                   </select>
                </div>
                <button className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-accent-500/30 flex items-center justify-center gap-2">
                   <Search size={20} /> Tìm ngay
                </button>
             </div>
             
             <div className="flex flex-wrap gap-2 mt-3 px-2">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mr-2 py-1">Xu hướng:</span>
                {['Vinhomes Grand Park', 'Quận 2', 'Căn hộ cho thuê', 'Masteri Centre Point'].map((tag) => (
                   <span key={tag} className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer transition">
                      {tag}
                   </span>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            {[
              { icon: Building2, label: 'Mua bán nhà đất', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: TrendingUp, label: 'Cho thuê', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: ShieldCheck, label: 'Dự án nổi bật', color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: MapPin, label: 'Định giá BĐS', color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${item.bg} hover:scale-105 transition cursor-pointer`}>
                 <item.icon size={32} className={`${item.color} mb-2`} />
                 <span className="font-semibold text-slate-700 text-sm md:text-base">{item.label}</span>
              </div>
            ))}
         </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-2xl font-bold text-slate-900">Bất động sản nổi bật</h2>
              <p className="text-slate-500 mt-1">Lựa chọn tốt nhất dành cho bạn hôm nay</p>
           </div>
           <Link to="/search" className="text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Xem tất cả <ArrowRight size={18} />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-slate-900">Dự án hot nhất</h2>
           <Link to="/projects" className="text-brand-600 font-semibold flex items-center gap-1">
              Xem thêm
           </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-6 gap-6 no-scrollbar snap-x">
          {MOCK_PROJECTS.map(project => (
            <div key={project.id} className="min-w-[300px] md:min-w-[400px] snap-center relative rounded-2xl overflow-hidden group cursor-pointer shadow-md">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
               <img src={project.thumbnail} className="w-full h-[250px] object-cover group-hover:scale-110 transition duration-700" alt={project.name} />
               <div className="absolute bottom-4 left-4 z-20 text-white">
                  <span className="bg-brand-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">{project.status}</span>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <p className="text-slate-200 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {project.location}</p>
                  <p className="text-accent-400 font-bold mt-2">{project.minPrice}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Market Heatmap Teaser */}
      <section className="bg-slate-900 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
           <div>
              <span className="text-brand-400 font-bold tracking-widest text-sm uppercase">Dữ liệu thị trường</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-6">Biểu đồ giá & Bản đồ nhiệt</h2>
              <p className="text-slate-400 mb-8 text-lg">
                Theo dõi biến động giá bất động sản tại từng khu vực, dự đoán xu hướng đầu tư sinh lời hiệu quả nhất.
              </p>
              <ul className="space-y-4 mb-8">
                 {[
                   'Lịch sử giá chi tiết từng con đường',
                   'So sánh ROI giữa các dự án',
                   'Bản đồ quy hoạch 2030'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <ArrowRight size={14} className="text-brand-400" />
                      </div>
                      {item}
                   </li>
                 ))}
              </ul>
              <button className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold transition">
                Xem bản đồ giá
              </button>
           </div>
           <div className="relative">
              <div className="absolute -inset-4 bg-brand-500/20 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                className="relative rounded-2xl shadow-2xl border border-slate-700"
                alt="Market chart"
              />
              <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white">
                 <div className="text-sm text-slate-300">Tăng trưởng Q2/2024</div>
                 <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                    +12.5% <TrendingUp size={24} />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Verified Agents */}
      <section className="max-w-7xl mx-auto px-4 mt-16 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Môi giới uy tín</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {/* Mock Agents rendered inline for simplicity */}
           {[1, 2, 3].map((i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg transition">
                <img src={`https://picsum.photos/seed/agent${i}/200/200`} className="w-16 h-16 rounded-full object-cover" alt="Agent" />
                <div>
                   <h4 className="font-bold text-slate-800">Trần Minh Tâm</h4>
                   <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <span className="text-yellow-500 font-bold">4.9 ★</span> (120 đánh giá)
                   </div>
                   <button className="mt-2 text-brand-600 text-sm font-semibold hover:underline">Liên hệ tư vấn</button>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};