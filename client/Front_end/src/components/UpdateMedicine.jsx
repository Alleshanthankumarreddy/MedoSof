import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { 
  X, 
  Layers, 
  IndianRupee, 
  DollarSign, 
  Package, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Tag,
  Edit3
} from "lucide-react";

function UpdateMedicine({ medicine, onClose, onUpdateSuccess }) {
  const [selectedOption, setSelectedOption] = useState("rack");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const shopCode = localStorage.getItem("shopCode");
  const { backendUrl, role } = useContext(AppContext);

  const updateOptions = [
    { 
      value: "rack", 
      label: "Update Rack Code", 
      icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" />,
      placeholder: "Enter new rack code",
      currentValue: medicine.rackCode,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      value: "sellingPrice", 
      label: "Update Selling Price", 
      icon: <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />,
      placeholder: "Enter new selling price",
      currentValue: `₹${medicine.unitSellingPrice}`,
      color: "from-emerald-500 to-green-500"
    },
    { 
      value: "costPrice", 
      label: "Update Cost Price", 
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
      placeholder: "Enter new cost price",
      currentValue: `₹${medicine.unitCostPrice}`,
      color: "from-amber-500 to-orange-500"
    }
  ];

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

      if (selectedOption === "rack") {
        url = `${backendUrl}/api/medicine/updateRackCode`;
        payload.newRackCode = inputValue;
      } else if (selectedOption === "sellingPrice") {
        url = `${backendUrl}/api/medicine/updateUnitSellingPrice`;
        payload.newUnitSellingPrice = Number(inputValue);
      } else if (selectedOption === "costPrice") {
        url = `${backendUrl}/api/medicine/updateUnitCostPrice`;
        payload.newUnitCostPrice = Number(inputValue);
      }

      const response = await axios.patch(url, payload, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
      });

      if (response.data.success) {
        setMessage(response.data.message || "Medicine updated successfully!");
        if (onUpdateSuccess) onUpdateSuccess();
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

  const selectedOptionData = updateOptions.find(opt => opt.value === selectedOption);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto relative animate-scaleIn p-4 sm:p-6 lg:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0C2C47] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2 px-2">
            Update Medicine
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 px-2">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium truncate max-w-[150px] sm:max-w-none">{medicine.medicineName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{medicine.medicineCode}</span>
            </div>
          </div>
        </div>

        {/* Current Value Display */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Current Value</span>
            <div className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${selectedOptionData?.color} text-white text-xs font-medium w-fit`}>
              {selectedOptionData?.label.replace("Update ", "")}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {selectedOptionData?.currentValue}
          </div>
        </div>

        {/* Update Options */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {updateOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelectedOption(option.value);
                setInputValue("");
              }}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                selectedOption === option.value
                  ? `border-blue-500 bg-gradient-to-br ${option.color} text-white shadow-lg`
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`mb-1 sm:mb-2 ${selectedOption === option.value ? "text-white" : "text-gray-600"}`}>
                {option.icon}
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${selectedOption === option.value ? "text-white" : "text-gray-700"}`}>
                {option.label.split(" ")[1]}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 ml-1">
              <span className="flex items-center gap-2">
                <span className="text-blue-500 shrink-0">{selectedOptionData?.icon}</span>
                New {selectedOptionData?.label.replace("Update ", "")}
              </span>
            </label>
            <div className="relative">
              <input
                type={selectedOption === "rack" ? "text" : "number"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedOptionData?.placeholder}
                required
                step={selectedOption !== "rack" ? "0.01" : undefined}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400 text-base sm:text-lg font-medium"
              />
              <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-lg sm:rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2 ml-1">
              Current: {selectedOptionData?.currentValue}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !inputValue}
            className="w-full py-2.5 sm:py-3.5 bg-[#0C2C47] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <span>Update {selectedOptionData?.label.replace("Update ", "")}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
              </>
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${message.includes("success") ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {message.includes("success") ? (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              )}
              <p className={`text-xs sm:text-sm font-medium ${message.includes("success") ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <p className="leading-relaxed">
              Update will be reflected immediately in your inventory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateMedicine;
