import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function AddMedicine({ onMedicineAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shopCode: localStorage.getItem("shopCode") || "",
    medicineCode: "",
    tradeName: "",
    usageDescription: "",
    rackCode: "",
    unitCostPrice: "",
    unitSellingPrice: "",
    medicineName: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {backendUrl} = useContext(AppContext);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${backendUrl}api/medicine/addMedicine`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Check the success key from backend
      if (response.data.success) {
        setMessage("✅ Medicine added successfully!");
        setShowForm(false);

        // Reset form fields
        setFormData({
          shopCode: localStorage.getItem("shopCode") || "",
          medicineCode: "",
          tradeName: "",
          usageDescription: "",
          rackCode: "",
          unitCostPrice: "",
          unitSellingPrice: "",
          medicineName: ""
        });

        if (onMedicineAdded) onMedicineAdded(); // refresh list in parent
      } else {
        setMessage(response.data.message || "Failed to add medicine.");
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      setMessage(
        error.response?.data?.message || "❌ Failed to add medicine. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ➕ Add Button Card */}
      {!showForm ? (
        <div
          onClick={() => setShowForm(true)}
          className="w-40 h-40 bg-white rounded-2xl shadow-md hover:shadow-xl flex items-center justify-center cursor-pointer border border-dashed border-gray-300 transition transform hover:-translate-y-1"
        >
          <span className="text-5xl text-gray-500 font-bold">+</span>
        </div>
      ) : (
        /* 🧾 Add Medicine Form (Popup) */
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative my-10 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
            ×
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Add New Medicine
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
            {[
                "medicineCode",
                "tradeName",
                "usageDescription",
                "rackCode",
                "unitCostPrice",
                "unitSellingPrice",
                "medicineName"
            ].map((field) => (
                <div
                key={field}
                className="flex items-center justify-between gap-4"
              >
                {/* Label */}
                <label
                  htmlFor={field}
                  className="w-1/3 text-gray-700 font-medium capitalize"
                >
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}:
                </label>
            
                {/* Input */}
                <input
                  id={field}
                  type={
                    ["unitCostPrice", "unitSellingPrice"].includes(field)
                      ? "number"
                      : "text"
                  }
                  name={field}
                  placeholder={
                    field
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            ))}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-black py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
                {loading ? "Adding..." : "Add Medicine"}
            </button>
            </form>

            {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
            )}
        </div>
        </div>

      )}
    </>
  );
}

export default AddMedicine;
