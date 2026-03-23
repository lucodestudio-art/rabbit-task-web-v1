import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getFullProjectData } from "@/services/postService";
import { useStore } from "../store/useStore";

interface FormData {
  propertyType: string;
  propertyCategory: string;
  buildingId: string;
  buildingZone: string;
  apartmentId: string;
  addressDetail: string;
  title: string;
  description: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  deposit: string;
  direction: string;
  furnitureStatus: string;
}

export const PostProperty: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useStore();

  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);

  // Image preview URLs (for better performance than using base64 directly in img src)
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [form, setForm] = useState<FormData>({
    propertyType: "Căn hộ Cho thuê",
    propertyCategory: "Căn hộ chung cư",
    buildingId: "",
    buildingZone: "",
    apartmentId: "",
    addressDetail: "Căn AB-01, Tầng 1, Toà A, Khu đô thị ABC",
    title: "Cho thuê căn hộ 2 phòng ngủ tại Khu đô thị ABC",
    description: "Mô tả chi tiết về căn hộ, tiện ích, vị trí, v.v.", 
    area: "30",
    bedrooms: "2",
    bathrooms: "1",
    price: "70000000",
    deposit: "14000000",
    direction: "",
    furnitureStatus: "",
  });

  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập để đăng tin bất động sản");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const res = await getFullProjectData();

        if (res.success) {
          const zoneList = res.data.zones || [];
          setZones(zoneList);

          if (zoneList.length > 0) {
            const firstZone = zoneList[0];
            setBuildings(firstZone.buildings || []);
            setForm((prev) => ({
              ...prev,
              buildingZone: firstZone.id.toString(),
            }));

            if (firstZone.buildings?.length > 0) {
              const firstBuilding = firstZone.buildings[0];
              setApartments(firstBuilding.apartments || []);

              setForm((prev) => ({
                ...prev,
                buildingId: firstBuilding.id.toString(),
              }));
            }
          }
        }
      } catch (err) {
        console.error("Load project data error:", err);
      }
    };

    fetchProjectData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray: File[] = Array.from(files);

    if (images.length + fileArray.length > 10) {
      alert("Chỉ được upload tối đa 10 ảnh");
      return;
    }

    setImages((prev) => [...prev, ...fileArray]);

    
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string | number) => {
  setForm((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  const handleZoneChange = (zoneId: string) => {
    handleInputChange("buildingZone", zoneId);

    const zone = zones.find((z) => z.id.toString() === zoneId);

    if (zone) {
      setBuildings(zone.buildings || []);
      setApartments([]);

      setForm((prev) => ({
        ...prev,
        buildingId: "",
        apartmentId: "",
      }));
    }
  };

  const handleBuildingChange = (buildingId: string) => {
    handleInputChange("buildingId", buildingId);

    const building = buildings.find((b) => b.id.toString() === buildingId);

    if (building) {
      setApartments(building.apartments || []);

      setForm((prev) => ({
        ...prev,
        apartmentId: "",
      }));
    }
  };

  const formatPrice = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      const postData = {
        apartmentId: form.apartmentId ? parseInt(form.apartmentId) : 1,
        title: form.title,
        price: parseFloat(form.price),
        description: form.description,
      };

      formData.append(
        "post",
        new Blob([JSON.stringify(postData)], { type: "application/json" }),
        "post.json"
      );

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await createPost(formData);

      if (res.success) {
        alert("Đăng tin thành công");

        setImages([]);
        setPreviewUrls([]);

        setForm({
          title: "",
          price: "",
          description: "",
          apartmentId: "",
        });
      } else {
        alert(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Create post error:", error);
      alert("Có lỗi xảy ra khi đăng tin");
    } finally {
      setLoading(false);
    }
  };

  
  return (
  <div className="min-h-screen bg-slate-50 py-8 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
      <h1 className="text-2xl font-bold text-center text-slate-900 mb-2 text-blue-600">
        Đăng tin căn hộ cho thuê tại Vinhomes Grand Park
      </h1>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow">

          {/* Zone */}
          <select
            className="p-3 bg-white border border-slate-200 rounded-xl 
            shadow-sm text-slate-700 font-medium
            hover:border-blue-400 hover:bg-blue-50
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
            transition-all duration-200 cursor-pointer"
            value={form.buildingZone}
            onChange={(e) => handleZoneChange(e.target.value)}
          >
            <option value="">Chọn khu</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>

          {/* Building */}
          <select
            className="p-3 bg-white border border-slate-200 rounded-xl 
            shadow-sm text-slate-700 font-medium
            hover:border-blue-400 hover:bg-blue-50
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
            transition-all duration-200 cursor-pointer
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            value={form.buildingId}
            onChange={(e) => handleBuildingChange(e.target.value)}
            disabled={!buildings.length}
          >
            <option value="">Toà nhà</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Apartment */}
          <select
            className="p-3 bg-white border border-slate-200 rounded-xl 
            shadow-sm text-slate-700 font-medium
            hover:border-blue-400 hover:bg-blue-50
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
            transition-all duration-200 cursor-pointer
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            value={form.apartmentId}
            onChange={(e) =>
              handleInputChange("apartmentId", e.target.value)
            }
            disabled={!apartments.length}
          >
            <option value="">Mã căn hộ</option>
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

        </div>

        {/* <h3 className="text-xl font-bold text-slate-800">
            Thông tin chi tiết về căn hộ
        </h3> */}

        {/* Detail */}
        <div className="space-y-6 mt-6 bg-white p-6 rounded-xl shadow">
          

          <textarea
            type="text"
            placeholder="Tiêu đề"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            value={form.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />

          <textarea
            placeholder="Mô tả"
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            value={form.description}
            onChange={(e) =>
              handleInputChange("description", e.target.value)
            }
          />

          <div className="grid grid-cols-3 gap-6">

          {/* Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Diện tích
            </label>

            <div className="relative">
              <input
                type="number"
                min="15"
                max="500"
                className="w-full p-3 pr-10 bg-white border border-slate-200 rounded-xl
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                value={form.area || 50}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                m²
              </span>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Phòng ngủ
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                className="px-4 py-3 text-lg text-slate-600 hover:bg-slate-100"
                onClick={() =>
                  handleInputChange("bedrooms", Math.max(0, (form.bedrooms || 1) - 1))
                }
              >
                −
              </button>

              <input
                type="number"
                min="0"
                className="w-full text-center outline-none"
                value={form.bedrooms ?? 1}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
              />

              <button
                type="button"
                className="px-4 py-3 text-lg text-slate-600 hover:bg-slate-100"
                onClick={() =>
                  handleInputChange("bedrooms", Number(form.bedrooms || 1) + 1)
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Phòng tắm
            </label>

            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                className="px-4 py-3 text-lg text-slate-600 hover:bg-slate-100"
                onClick={() =>
                  handleInputChange("bathrooms", Math.max(1, (form.bathrooms || 1) - 1))
                }
              >
                −
              </button>

              <input
                type="number"
                min="1"
                className="w-full text-center outline-none"
                value={form.bathrooms ?? 1}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
              />

              <button
                type="button"
                className="px-4 py-3 text-lg text-slate-600 hover:bg-slate-100"
                onClick={() =>
                  handleInputChange("bathrooms", Number(form.bathrooms || 1) + 1)
                }
              >
                +
              </button>
            </div>
          </div>
        </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Giá thuê"
                className="w-full p-3 pl-4 pr-14 bg-white border border-slate-200 rounded-xl 
                font-bold text-lg text-brand-700
                focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                value={form.price}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  handleInputChange("price", formatted);
                }}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                VNĐ
              </span>
            </div>

            {/* Deposit */}
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Tiền đặt cọc"
                className="w-full p-3 pl-4 pr-14 bg-white border border-slate-200 rounded-xl
                font-semibold text-slate-700
                focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                value={form.deposit}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  handleInputChange("deposit", formatted);
                }}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                VNĐ
              </span>
            </div>

          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Hình ảnh</h3>

          {/* Upload button */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-brand-500 transition">
            <span className="text-slate-600">Chọn ảnh (tối đa 10)</span>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={images.length >= 10}
              onChange={handleFileChange}
            />
          </label>

          {/* Preview */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group border"
              >
                <img
                  src={img}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />

                {/* remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            {images.length}/10 ảnh đã chọn
          </p>
        </div>
        
        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-brand-500/30 transition"
          >
            {loading ? "Đang xử lý..." : "Đăng tin ngay"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
