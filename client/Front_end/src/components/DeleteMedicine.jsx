import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { X, Trash2, AlertTriangle } from "lucide-react";

function DeleteMedicine({ medicine, onClose, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { backendUrl, role } = useContext(AppContext);
  const shopCode = localStorage.getItem("shopCode");
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${medicine.medicineName}?`);
    if (!confirmDelete) return;
    try {
      setLoading(true);
      const response = await axios.delete(`${backendUrl}/api/medicine/deleteMedicine`, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
        data: { shopCode, medicineCode: medicine.medicineCode },
      });
      if (response.data.success) {
        setMessage(response.data.message);
        if (onDeleteSuccess) onDeleteSuccess();
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(response.data.message || "Failed to delete medicine");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 w-full max-w-xs sm:max-w-md relative">
        
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2 sm:mb-3">Delete Medicine</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-gray-900">{medicine.medicineName}</span>?
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 text-sm sm:text-base transition-all">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Deleting...</span></>
            ) : (
              <><Trash2 className="w-4 h-4" /><span>Delete</span></>
            )}
          </button>
        </div>

        {message && (
          <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default DeleteMedicine;