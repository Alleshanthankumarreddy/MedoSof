// DeleteMedicine.jsx
import React, { useState } from "react";
import axios from "axios";

function DeleteMedicine({ medicine, onClose, onDeleteSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const shopCode = localStorage.getItem("shopCode");
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${medicine.medicineName}?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        "http://localhost:4000/api/medicine/deleteMedicine",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { shopCode, medicineCode: medicine.medicineCode },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        if (onDeleteSuccess) onDeleteSuccess(); // refresh list
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(response.data.message || "Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          Delete Medicine
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold">{medicine.medicineName}</span>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-black font-semibold hover:bg-red-700 transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default DeleteMedicine;
