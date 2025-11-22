import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";

import { AppContext } from "../AppContext";

function LowStockMedicines() {
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { lowStockMedicines, setLowStockMedicines } = useContext(AppContext);

  const handleRestock = (medicine) => {
    setLowStockMedicines((prev) => {
      const alreadyExists = prev.some(item => item.medicineCode === medicine.medicineCode);
      if (!alreadyExists) {
        return [...prev, medicine];
      }
      console.log(lowStockMedicines)
      return prev;
    });
  };
  

  const fetchLowStockMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      if (!shopCode) {
        setError("Shop code not found in localStorage.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/medicine/getLowStockMedicines",
        { shopCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setLowStockList(response.data.medicines || []);
      } else {
        setError(response.data.message || "Failed to fetch medicines.");
      }
    } catch (err) {
      console.error("Error fetching low stock medicines:", err);
      setError("Unable to fetch low stock medicines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockMedicines();
  }, []);


  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        ⚠️ Low Stock Medicines
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading medicines...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : lowStockList.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          All medicines are above threshold ✅
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {lowStockList.map((med, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5 w-full max-w-xs"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {med.medicineName}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">
                    Medicine Code:
                  </span>{" "}
                  {med.medicineCode}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Total Quantity:
                  </span>{" "}
                  {med.totalQuantity}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Threshold:</span>{" "}
                  {med.threshold}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Rack:</span>{" "}
                  {med.rackCode}
                </p>
              </div>

              {/* 🧾 Moved text above button */}
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm font-medium text-red-500 mb-2">
                  ⚠️ Restock needed
                </p>

              <button
                onClick={() => {
                  handleRestock(med);
                }}
              >
                Restock
              </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LowStockMedicines;
