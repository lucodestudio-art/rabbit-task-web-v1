// SidebarFilters.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Home, LayoutGrid, Building } from "lucide-react";
import { listZonesApi, listBuildingsApi, listApartmentsApi } from "@/services/postService";

type FilterValues = {
  search?: string;
  zoneId?: string;
  buildingId?: string;
  apartmentId?: string;
};

interface SidebarFiltersProps {
  onChange?: (filters: FilterValues) => void;
  initial?: FilterValues;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onChange, initial }) => {
  const [searchQuery, setSearchQuery] = useState(initial?.search || "");
  const [zones, setZones] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);

  const [selectedZone, setSelectedZone] = useState<string | undefined>(initial?.zoneId || "");
  const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>(initial?.buildingId || "");
  const [selectedApartment, setSelectedApartment] = useState<string | undefined>(initial?.apartmentId || "");

  const emitChange = useCallback(() => {
    onChange?.({
      search: searchQuery,
      zoneId: selectedZone,
      buildingId: selectedBuilding,
      apartmentId: selectedApartment,
    });
  }, [onChange, searchQuery, selectedZone, selectedBuilding, selectedApartment]);

  useEffect(() => {
    emitChange();
  }, [emitChange]);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await listZonesApi();
        const data = res?.data || res;
        setZones(Array.isArray(data) ? data : []);

        // if initial zone provided, load its buildings
        if (initial?.zoneId) {
          const bRes = await listBuildingsApi(initial.zoneId);
          const bData = bRes?.data || bRes;
          setBuildings(Array.isArray(bData) ? bData : []);
        }
      } catch (e) {
        console.error("Failed to load zones:", e);
      }
    };

    loadZones();
  }, [initial?.zoneId]);

  useEffect(() => {
    if (!selectedZone) {
      setBuildings([]);
      setSelectedBuilding("");
      setApartments([]);
      setSelectedApartment("");
      return;
    }

    const loadBuildings = async () => {
      try {
        const res = await listBuildingsApi(selectedZone);
        const data = res?.data || res;
        setBuildings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load buildings:", e);
      }
    };

    loadBuildings();
  }, [selectedZone]);

  useEffect(() => {
    if (!selectedBuilding) {
      setApartments([]);
      setSelectedApartment("");
      return;
    }

    const loadApartments = async () => {
      try {
        const res = await listApartmentsApi(selectedBuilding);
        const data = res?.data || res;
        setApartments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load apartments:", e);
      }
    };

    loadApartments();
  }, [selectedBuilding]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedZone("");
    setSelectedBuilding("");
    setSelectedApartment("");
  };

  useEffect(() => {
    // emit when reset changes selection state
    emitChange();
  }, [searchQuery, selectedZone, selectedBuilding, selectedApartment, emitChange]);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-4 sticky top-24">
      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Search size={20} className="text-gray-500" />
          Tìm kiếm
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#00A651] outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Location Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-gray-500" />
          Khu vực
        </h2>

        <div className="space-y-4">
          {/* Project / Zone Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Home size={16} className="text-[#00A651]" /> Phân khu
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="">Tất cả phân khu</option>
              {zones.map((z) => (
                <option key={z.id} value={String(z.id)}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <LayoutGrid size={16} className="text-[#2196F3]" /> Tòa nhà
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-all"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              disabled={!buildings.length}
            >
              <option value="">Tất cả tòa nhà</option>
              {buildings.map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Apartment / Tower Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Building size={16} className="text-[#9C27B0]" /> căn hộ / tòa
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#9C27B0] focus:ring-1 focus:ring-[#9C27B0] transition-all"
              value={selectedApartment}
              onChange={(e) => setSelectedApartment(e.target.value)}
              disabled={!apartments.length}
            >
              <option value="">Tất cả căn hộ</option>
              {apartments.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full mt-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </aside>
  );
};

export default SidebarFilters;