import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Layers, Building, MapPin, Plus, Save, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

function AddRack({ onSuccess }) {
  const [rackCode, setRackCode] = useState("");
  const [shopCode] = useState(localStorage.getItem("shopCode") || "");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl, role } = useContext(AppContext);

  const handleAddRack = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!rackCode || !shopCode || !position) { setMessage("Please fill in all fields"); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(`${backendUrl}/api/rack/addRack`, { rackCode, shopCode, position }, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
      });
      if (response.data.success) {
        setMessage("✅ Rack added successfully!");
        setRackCode(""); setPosition("");
        setTimeout(() => { if (onSuccess) onSuccess(); }, 1200);
      } else {
        setMessage(response.data.message || "Failed to add rack");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Add New Rack</h2>
        <p className="text-gray-500 text-xs sm:text-sm">Create a new storage rack for organizing medicines</p>
      </div>

      <form onSubmit={handleAddRack} className="space-y-4 sm:space-y-6">
        {/* Rack Code */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" />Rack Code</span>
          </label>
          <div className="relative">
            <input type="text" value={rackCode} onChange={(e) => setRackCode(e.target.value)}
              placeholder="Enter rack code (e.g., A-01)"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base"
              required />
            <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
          </div>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">Unique identifier for the rack</p>
        </div>

        {/* Shop Code */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            <span className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-500" />Shop Code</span>
          </label>
          <input type="text" value={shopCode} readOnly
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 cursor-not-allowed text-sm sm:text-base" />
          <p className="text-xs text-gray-500 mt-1.5 ml-1">Automatically filled from your shop</p>
        </div>

        {/* Position */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" />Position</span>
          </label>
          <div className="relative">
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter position (e.g., Wall A, Right Side)"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base"
              required />
            <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
          </div>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">Physical location in your pharmacy</p>
        </div>

        {/* Tips */}
        <div className="p-3 sm:p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg mt-0.5 shrink-0">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Tips for Rack Codes</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Use format like A-01, B-02 for easy organization</li>
                <li>• Keep codes short and memorable</li>
                <li>• Consider using section-based codes</li>
              </ul>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full mt-4 sm:mt-6 py-3 sm:py-3.5 bg-[#0C2C47] text-white font-semibold rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Adding Rack...</span></>
          ) : (
            <><Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /><span>Add New Rack</span><ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border ${message.includes("✅") ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3">
            {message.includes("✅") ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <p className={`text-sm font-medium ${message.includes("✅") ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Save className="w-4 h-4 shrink-0" />
          <p className="text-xs sm:text-sm">Racks will be immediately available for medicine organization.</p>
        </div>
      </div>
    </>
  );
}

export default AddRack;