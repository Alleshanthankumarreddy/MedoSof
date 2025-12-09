import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function Purchase() {
  const { lowStockMedicines, setLowStockMedicines, handleRemoveMedicine, backendUrl  } = useContext(AppContext);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [batchDetails, setBatchDetails] = useState({
    batchCode: "",
    expiryDate: "",
    quantity: "",
    vendorMail:"",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuccess = (med) => {
    setSelectedMedicine(med);
    setMessage("");
  };

  const handleCloseModal = () => {
    setSelectedMedicine(null);
    setBatchDetails({
      batchCode: "",
      expiryDate: "",
      quantity: "",
      vendorMail: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      // 1️⃣ Add purchase record
      await axios.post(
        `${backendUrl}api/purchase/addPurchase`,
        {
          medicineCode: selectedMedicine.medicineCode,
          quantity: Number(batchDetails.quantity),
          vendorMail: batchDetails.vendorMail,
          shopCode,
          expiryDate: batchDetails.expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Add batch record
      const res = await axios.post(
        `${backendUrl}api/batch/addBatch`,
        {
          medicineCode: selectedMedicine.medicineCode,
          batchCode: batchDetails.batchCode,
          expiryDate: batchDetails.expiryDate,
          quantity: Number(batchDetails.quantity),
          vendorMail: batchDetails.vendorMail,
          shopCode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("✅ Batch & Purchase added successfully!");
        setLowStockMedicines((prev) =>
          prev.filter((m) => m.medicineCode !== selectedMedicine.medicineCode)
        );
        setTimeout(() => handleCloseModal(), 1000);
      } else {
        setMessage("❌ " + res.data.message);
      }
    } catch (error) {
      console.error("Error adding purchase/batch:", error);
      setMessage("❌ Failed to add purchase/batch.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        🛒 Purchase Medicines
      </h1>

      {lowStockMedicines.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No pending medicines for purchase.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {lowStockMedicines.map((med) => (
            <div
              key={med.medicineCode}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5 w-full max-w-xs"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {med.medicineName}
              </h3>

              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold">Code:</span> {med.medicineCode}</p>
                <p><span className="font-semibold">Quantity:</span> {med.totalQuantity}</p>
                <p><span className="font-semibold">Threshold:</span> {med.threshold}</p>
                <p><span className="font-semibold">Rack:</span> {med.rackCode}</p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleSuccess(med)}
                  className="bg-green-500 hover:bg-green-600 text-black text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                >
                  ✅ Success
                </button>
                <button
                onClick={() => handleRemoveMedicine(med.medicineCode)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
              >
                ❌ Cancel
              </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMedicine && (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Add Batch for {selectedMedicine.medicineName}
            </h2>

            <div className="space-y-3">
              <input
                name="batchCode"
                placeholder="Batch Code"
                value={batchDetails.batchCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
              />
              <input
                name="vendorMail"
                placeholder="vendorMail"
                value={batchDetails.vendorMail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
              />
              <input
                type="date"
                name="expiryDate"
                value={batchDetails.expiryDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={batchDetails.quantity}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
              />
            </div>

            {message && (
              <p
                className={`text-sm text-center mt-2 ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchase;
