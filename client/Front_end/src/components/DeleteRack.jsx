import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { X, Trash2, AlertTriangle } from "lucide-react";

function DeleteRack({ rack, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { backendUrl, role } = useContext(AppContext);

  if (!rack) return null;

  const handleDelete = async () => {
    try {
      setLoading(true); setMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      const response = await axios.delete(`${backendUrl}/api/rack/deleteRack`, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
        data: { rackCode: rack.rackCode, shopCode },
      });
      if (response.data.success) {
        setMessage("✅ Rack deleted successfully!");
        if (onSuccess) onSuccess();
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(response.data.message || "Failed to delete rack");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-xs sm:w-80 text-center animate-fadeIn relative">
        
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Delete Rack?</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-red-600">{rack.rackCode}</span>?
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-all">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className={`flex-1 ${loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"} text-white font-semibold py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2`}>
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Deleting...</span></>
            ) : (
              <><Trash2 className="w-4 h-4" /><span>Delete</span></>
            )}
          </button>
        </div>

        {message && (
          <p className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default DeleteRack;