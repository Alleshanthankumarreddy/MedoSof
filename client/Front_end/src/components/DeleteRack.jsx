import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function DeleteRack({ rack, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { backendUrl} = useContext(AppContext)

  if (!rack) return null;

  // 🧩 Backend Integration
  const handleDelete = async () => {
    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const response = await axios.delete(`${backendUrl}api/rack/deleteRack`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { rackCode: rack.rackCode, shopCode },
      });

      if (response.data.success) {
        setMessage("✅ Rack deleted successfully!");
        if (onSuccess) onSuccess(); // notify parent (RackList) to refresh
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(response.data.message || "Failed to delete rack");
      }
    } catch (error) {
      console.error("Error deleting rack:", error);
      setMessage(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Delete Rack?
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <br />
          <span className="font-bold text-red-600">{rack.rackCode}</span>?
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
            } text-black font-semibold py-2 rounded-lg transition`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default DeleteRack;
