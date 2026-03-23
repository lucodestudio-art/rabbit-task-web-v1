import { useState } from "react";

export const SellerInfo = ({ seller }) => {
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    if (!seller?.phone) return;

    await navigator.clipboard.writeText(seller.phone);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-semibold text-slate-900 truncate">
        {seller?.name || "Unknown"}
      </h3>

      {seller?.phone && (
        <span
          onClick={copyPhone}
          className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-md cursor-pointer hover:bg-indigo-100"
        >
          {seller.phone}
          <span className="text-xs">📋</span>
        </span>
      )}

      {copied && (
        <span className="text-xs text-green-600">Copied!</span>
      )}
    </div>
  );
};