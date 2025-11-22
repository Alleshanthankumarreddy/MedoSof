import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpiredMedicines() {
  const [expiredList, setExpiredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    fetchExpiredMedicines();
  }, []);

  // ✅ Fetch expired medicines
  const fetchExpiredMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      setActionMessage("");

      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const res = await axios.post(
        "http://localhost:4000/api/batch/expiredMedicines",
        { shopCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setExpiredList(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to load expired medicines.");
      }
    } catch (err) {
      console.error("Error fetching expired medicines:", err);
      setError("Failed to fetch expired medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function for days since expiry
  const calculateDaysExpired = (expiryDate) => {
    const diffMs = new Date() - new Date(expiryDate);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  // ✅ Remove expired medicines
  const handleRemoveExpired = async () => {
    try {
      setLoading(true);
      setActionMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const res = await axios.delete(
        "http://localhost:4000/api/batch/removeExpiredMedicines",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { shopCode },
        }
      );

      if (res.data.success) {
        setActionMessage(`✅ ${res.data.message} (${res.data.deletedCount} removed)`);
        // Refresh list after removal
        fetchExpiredMedicines();
      } else {
        setActionMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.error("Error removing expired medicines:", err);
      setActionMessage("❌ Failed to remove expired medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        ⚠️ Expired Medicines
      </h1>

      {/* Action button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRemoveExpired}
          disabled={loading || expiredList.length === 0}
          className={`px-5 py-2 rounded-lg font-semibold shadow ${
            loading || expiredList.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-black"
          }`}
        >
          {loading ? "Processing..." : "🗑️ Remove Expired Medicines"}
        </button>
      </div>

      {/* Action message */}
      {actionMessage && (
        <p
          className={`text-center mb-4 ${
            actionMessage.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {actionMessage}
        </p>
      )}

      {/* Loading & error */}
      {loading && !actionMessage && (
        <p className="text-center text-gray-500">Loading expired medicines...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Empty state */}
      {!loading && expiredList.length === 0 && !error && (
        <p className="text-center text-gray-500 italic">
          🎉 No expired medicines found.
        </p>
      )}

      {/* Expired list */}
      {!loading && expiredList.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {expiredList.map((batch) => (
            <div
              key={batch._id}
              className="bg-black border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5 w-full max-w-xs"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {batch.medicineName || "Unknown Medicine"}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Batch Code:</span>{" "}
                  {batch.batchCode}
                </p>
                <p>
                  <span className="font-semibold">Expiry:</span>{" "}
                  {new Date(batch.expiryDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {batch.quantity}
                </p>
              </div>

              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-red-500">
                  ❌ Expired {calculateDaysExpired(batch.expiryDate)} days ago
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpiredMedicines;
