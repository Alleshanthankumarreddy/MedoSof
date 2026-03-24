import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Package, Plus, AlertCircle, CheckCircle } from "lucide-react";

function AddVendorMedicine() {
  const { vendor, user, token, backendUrl, role } = useContext(AppContext);
  const [medicineCode, setMedicineCode] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMedicine = async () => {
    if (!medicineCode.trim()) { setMessage("⚠️ Please enter a medicine code"); return; }
    try {
      const res = await axios.post(`${backendUrl}/api/vendor/addVendorMedicine`,
        { medicineCode, vendorMail: user.mail },
        { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } }
      );
      setMessage("✅ Medicine added successfully!");
      setMedicineCode("");
      console.log("Updated Vendor:", res.data.vendor);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error adding medicine");
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-6 sm:mt-10 bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200">
      
      <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Add Medicine to Vendor</h3>
      </div>

      <input
        type="text"
        placeholder="Enter medicine code"
        value={medicineCode}
        onChange={(e) => setMedicineCode(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 sm:mb-4"
      />

      <button
        onClick={handleAddMedicine}
        className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Medicine
      </button>

      {message && (
        <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg flex items-center gap-2 ${message.includes("✅") ? 'bg-green-50 border border-green-200' : message.includes("⚠️") ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
          {message.includes("✅")
            ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <p className="text-center text-xs sm:text-sm font-medium text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}

export default AddVendorMedicine;