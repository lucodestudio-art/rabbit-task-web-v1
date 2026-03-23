import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Property } from '../types';
import { Heart, MessageCircle, Share2, MapPin, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeedItem: React.FC<{ property: Property; isActive: boolean }> = ({ property, isActive }) => {
  const { toggleSaveProperty, savedPropertyIds } = useStore();
  const isSaved = savedPropertyIds.includes(property.id);

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] w-full relative snap-start shrink-0 bg-black overflow-hidden">
       {/* Background Image Slider (Simple Logic for now) */}
       <div className="absolute inset-0">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
       </div>

       {/* Right Actions */}
       <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
          <div className="flex flex-col items-center gap-1">
             <div className="w-12 h-12 rounded-full border-2 border-white p-0.5 mb-2 overflow-hidden">
                <img src={property.agent.avatar} className="w-full h-full object-cover rounded-full" />
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <button 
                onClick={() => toggleSaveProperty(property.id)}
                className={`p-3 rounded-full bg-white/20 backdrop-blur-md ${isSaved ? 'text-red-500' : 'text-white'}`}
             >
                <Heart size={28} fill={isSaved ? "currentColor" : "none"} />
             </button>
             <span className="text-white text-xs font-medium">Lưu</span>
          </div>

          <div className="flex flex-col items-center gap-1">
             <button className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                <MessageCircle size={28} />
             </button>
             <span className="text-white text-xs font-medium">Chat</span>
          </div>

          <div className="flex flex-col items-center gap-1">
             <button className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                <Share2 size={28} />
             </button>
             <span className="text-white text-xs font-medium">Chia sẻ</span>
          </div>
       </div>

       {/* Bottom Info */}
       <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 md:pb-10 z-20 text-white">
          <div className="max-w-3xl">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand-600 px-3 py-1 rounded-full text-xs font-bold">{property.transactionType}</span>
                <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <MapPin size={12}/> {property.district}
                </span>
             </div>
             
             <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight drop-shadow-md">{property.title}</h2>
             
             <div className="flex items-center gap-4 mb-4 text-slate-200 text-sm font-medium">
                <span>{property.bedrooms} PN</span> • 
                <span>{property.bathrooms} PT</span> • 
                <span>{property.area} m²</span>
             </div>

             <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-accent-400 drop-shadow-lg">
                   {property.price} {property.priceUnit}
                </div>
                <Link 
                   to={`/property/${property.id}`}
                   className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand-50 transition"
                >
                   Xem chi tiết <ChevronRight size={18} />
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
};

export const Explore: React.FC = () => {
  const { properties } = useStore();
  
  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
       {properties.map((p, index) => (
         <FeedItem key={p.id} property={p} isActive={true} />
       ))}
    </div>
  );
};