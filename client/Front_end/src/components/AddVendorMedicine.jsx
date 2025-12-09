import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function AddVendorMedicine() {
  const { vendor,user,token,backendUrl } = useContext(AppContext);
  const [medicineCode, setMedicineCode] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMedicine = async () => {
    if (!medicineCode.trim()) {
      setMessage("⚠️ Please enter a medicine code");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}api/vendor/addVendorMedicine`,
        {
          medicineCode,
          vendorMail: user.mail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setMessage("✅ Medicine added successfully!");
      setMedicineCode("");

      console.log("Updated Vendor:", res.data.vendor);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Error adding medicine");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Add Medicine to Vendor
      </h3>

      <input
        type="text"
        placeholder="Enter medicine code"
        value={medicineCode}
        onChange={(e) => setMedicineCode(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <button
        onClick={handleAddMedicine}
        className="w-full bg-blue-600 text-black py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
      >
        Add Medicine
      </button>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}

export default AddVendorMedicine;
