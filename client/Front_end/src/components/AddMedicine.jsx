import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Plus, X, Package, Tag, FileText, Layers, IndianRupee, DollarSign, Pill, Save } from "lucide-react";

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
    medicineName: "",
    genericName: "",
    thresholdValue: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { backendUrl, role } = useContext(AppContext);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${backendUrl}/api/medicine/addMedicine`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-role": role
          },
        }
      );

      if (response.data.success) {
        setMessage("✅ Medicine added successfully!");
        setTimeout(() => {
          setShowForm(false);
          setFormData({
            shopCode: localStorage.getItem("shopCode") || "",
            medicineCode: "",
            tradeName: "",
            usageDescription: "",
            rackCode: "",
            unitCostPrice: "",
            unitSellingPrice: "",
            medicineName: "",
            genericName: "",
            thresholdValue: ""
          });
          if (onMedicineAdded) onMedicineAdded();
        }, 1500);
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

  // Field configuration with icons and types
  const fields = [
    { name: "medicineName", label: "Medicine Name", icon: <Pill className="w-4 h-4" />, type: "text" },
    { name: "genericName", label: "Generic Name", icon: <Pill className="w-4 h-4" />, type: "text" },
    { name: "tradeName", label: "Trade Name", icon: <Tag className="w-4 h-4" />, type: "text" },
    { name: "medicineCode", label: "Medicine Code", icon: <Package className="w-4 h-4" />, type: "text" },
    { name: "rackCode", label: "Rack Code", icon: <Layers className="w-4 h-4" />, type: "text" },
    { name: "usageDescription", label: "Usage Description", icon: <FileText className="w-4 h-4" />, type: "text" },
    { name: "unitCostPrice", label: "Cost Price (₹)", icon: <DollarSign className="w-4 h-4" />, type: "number", step: "0.01" },
    { name: "unitSellingPrice", label: "Selling Price (₹)", icon: <IndianRupee className="w-4 h-4" />, type: "number", step: "0.01" },
    { name: "thresholdValue", label: "Threshold Value", icon: <Package className="w-4 h-4" />, type: "number" }
  ];

  return (
    <>
      {/* ➕ Add Medicine Card (Stays inside grid) */}
      {!showForm ? (
        <div
          onClick={() => setShowForm(true)}
          className="group bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[320px] relative overflow-hidden"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-100/30 group-hover:to-cyan-100/30 transition-all duration-500"></div>
          
          {/* Plus icon container */}
          <div className="relative z-10 mb-4">
            <div className="w-16 h-16 bg-[#0C2C47] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Text content */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              Add New Medicine
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Click to add a new medicine to your inventory
            </p>
            
            {/* Quick stats */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                <span>Easy Entry</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Quick Setup</span>
              </div>
            </div>
          </div>
          
          {/* Hover effect indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      ) : (
        /* 🧾 Add Medicine Form Modal */
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto relative animate-scaleIn">
            
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Add New Medicine
              </h2>
              <p className="text-gray-500 text-sm">
                Fill in the details to add a new medicine to your inventory
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div key={field.name} className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                      <span className="flex items-center gap-2">
                        <span className="text-blue-500">{field.icon}</span>
                        {field.label}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        step={field.step}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400"
                        required
                      />
                      <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Auto-threshold info */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Threshold Value Note</h4>
                    <p className="text-xs text-gray-600">
                      The threshold value is used for automatic reordering. If left empty, 
                      the system will calculate it based on weekly sales average.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0C2C47] text-white font-semibold rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Medicine...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      <span>Add Medicine to Inventory</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl border ${message.includes("✅") ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-center text-sm font-medium ${message.includes("✅") ? 'text-green-700' : 'text-red-700'}`}>
                  {message}
                </p>
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                All fields are required. Medicine code will be used for tracking and inventory management.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddMedicine;