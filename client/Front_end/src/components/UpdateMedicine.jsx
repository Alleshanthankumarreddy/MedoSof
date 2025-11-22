import React, { useState } from "react";
import axios from "axios";

function UpdateMedicine({ medicine, onClose, onUpdateSuccess }) {
  const [selectedOption, setSelectedOption] = useState("rack");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const shopCode = localStorage.getItem("shopCode");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      let url = "";
      let payload = {
        shopCode,
        medicineCode: medicine.medicineCode,
      };

      // Choose API endpoint and payload based on selected option
      if (selectedOption === "rack") {
        url = "http://localhost:4000/api/medicine/updateRackCode";
        payload.newRackCode = inputValue;
      } else if (selectedOption === "sellingPrice") {
        url = "http://localhost:4000/api/medicine/updateUnitSellingPrice";
        payload.newUnitSellingPrice = Number(inputValue);
      } else if (selectedOption === "costPrice") {
        url = "http://localhost:4000/api/medicine/updateUnitCostPrice";
        payload.newUnitCostPrice = Number(inputValue);
      }

      const response = await axios.patch(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessage(response.data.message || "Medicine updated successfully!");
        if (onUpdateSuccess) onUpdateSuccess(); // Refresh parent data
        setTimeout(() => onClose(), 1500);
      } else {
        setMessage(response.data.message || "Failed to update.");
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Update Medicine
        </h2>

        {/* Radio Buttons */}
        <div className="flex justify-around mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="updateType"
              value="rack"
              checked={selectedOption === "rack"}
              onChange={() => {
                setSelectedOption("rack");
                setInputValue("");
              }}
            />
            <span>Update Rack Code</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="updateType"
              value="sellingPrice"
              checked={selectedOption === "sellingPrice"}
              onChange={() => {
                setSelectedOption("sellingPrice");
                setInputValue("");
              }}
            />
            <span>Update Selling Price</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="updateType"
              value="costPrice"
              checked={selectedOption === "costPrice"}
              onChange={() => {
                setSelectedOption("costPrice");
                setInputValue("");
              }}
            />
            <span>Update Cost Price</span>
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-semibold text-gray-700">
            {selectedOption === "rack"
              ? "New Rack Code"
              : selectedOption === "sellingPrice"
              ? "New Unit Selling Price"
              : "New Unit Cost Price"}
          </label>

          <input
            type={selectedOption === "rack" ? "text" : "number"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedOption === "rack"
                ? "Enter new rack code"
                : "Enter new price"
            }
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-black py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default UpdateMedicine;
