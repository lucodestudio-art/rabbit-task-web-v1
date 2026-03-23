import React from 'react';
import { Property } from '../types';
import { Heart, MapPin, BedDouble, Bath, Maximize, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const { toggleSaveProperty, savedPropertyIds } = useStore();
  const isSaved = savedPropertyIds.includes(property.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  if (compact) {
    return (
      <Link to={`/property/${property.id}`} className="block group min-w-[280px] w-[280px]">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-900/10 transition duration-300 border border-slate-100">
          <div className="relative aspect-[4/3] overflow-hidden">
             <img 
               src={property.images[0]} 
               alt={property.title}
               className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
             />
             <div className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {property.transactionType}
             </div>
             <button onClick={handleSave} className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-slate-500 hover:text-red-500 transition shadow-sm">
                <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-red-500" : ""} />
             </button>
             <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-brand-800 font-bold px-3 py-1 rounded-lg shadow-sm">
                {property.price} {property.priceUnit}
             </div>
          </div>
          <div className="p-4">
             <h3 className="font-bold text-slate-800 truncate mb-1">{property.title}</h3>
             <div className="flex items-center text-slate-500 text-xs mb-3">
                <MapPin size={14} className="mr-1" />
                <span className="truncate">{property.district}, {property.city}</span>
             </div>
             <div className="flex items-center justify-between text-slate-600 text-sm">
                <div className="flex items-center gap-1"><BedDouble size={16}/> {property.bedrooms}</div>
                <div className="flex items-center gap-1"><Bath size={16}/> {property.bathrooms}</div>
                <div className="flex items-center gap-1"><Maximize size={16}/> {property.area} m²</div>
             </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-900/10 transition duration-300 border border-slate-100 h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
           <img 
             src={property.images[0]} 
             alt={property.title}
             className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
           />
           <div className="absolute top-4 left-4 flex gap-2">
             <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {property.transactionType}
             </span>
             {property.isHot && (
               <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                 🔥 Hot
               </span>
             )}
           </div>
           
           <div className="absolute bottom-4 left-4">
              <span className="text-2xl font-bold text-white drop-shadow-lg filter">
                {property.price} {property.priceUnit}
              </span>
           </div>

           <button onClick={handleSave} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white text-white hover:text-red-500 transition shadow-sm border border-white/30">
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-red-500" : ""} />
           </button>
           
           {/* Quick Action Overlay on Hover */}
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
              <div className="bg-white text-slate-800 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75">
                <ArrowRightLeft size={16} /> So sánh
              </div>
           </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
           <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-lg line-clamp-2 leading-snug group-hover:text-brand-600 transition">{property.title}</h3>
           </div>
           
           <div className="flex items-center text-slate-500 text-sm mb-4">
              <MapPin size={16} className="mr-1 flex-shrink-0 text-slate-400" />
              <span className="truncate">{property.address}, {property.district}</span>
           </div>
           
           <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 mt-auto">
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl">
                 <BedDouble size={20} className="text-brand-600 mb-1"/>
                 <span className="text-xs font-semibold text-slate-600">{property.bedrooms} P.Ngủ</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl">
                 <Bath size={20} className="text-brand-600 mb-1"/>
                 <span className="text-xs font-semibold text-slate-600">{property.bathrooms} P.Tắm</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl">
                 <Maximize size={20} className="text-brand-600 mb-1"/>
                 <span className="text-xs font-semibold text-slate-600">{property.area} m²</span>
              </div>
           </div>
           
           <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                 <img src={property.agent.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt={property.agent.name} />
                 <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{property.agent.name}</span>
              </div>
              <span className="text-xs text-slate-400">{property.postedDate}</span>
           </div>
        </div>
      </div>
    </Link>
  );
};