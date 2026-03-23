// RightSidebar.jsx
import React from "react";
import { Filter } from "lucide-react";

const RightSidebar = () => {
  const roomTypes = ['Studio', '1PN', '1PN+', '2PN', '2PN+', '3PN'];
  const priceRanges = ['Dưới 5 triệu', '5 - 10 triệu', '10 - 15 triệu', 'Trên 15 triệu'];

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-4 sticky top-24 hidden xl:block">
      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          Lọc nâng cao
        </h2>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Mức giá</label>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map((price, idx) => (
                <button
                  key={idx}
                  className="border border-gray-200 rounded-lg py-2 text-sm hover:border-[#00A651] hover:text-[#00A651] transition-colors"
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Loại phòng</label>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map((type, idx) => (
                <button
                  key={idx}
                  className="px-4 py-1.5 border border-gray-200 rounded-full text-sm hover:bg-[#00A651] hover:text-white hover:border-[#00A651] transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Projects */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-lg mb-4">Dự án nổi bật</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
            >
              <img
                src={`https://picsum.photos/seed/proj${i}/60/60`}
                className="w-14 h-14 rounded-lg object-cover"
                alt={`Project ${i}`}
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900">Vinhomes Grand Park</h4>
                <p className="text-xs text-gray-500 mt-0.5">Quận 9, TP.HCM</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;