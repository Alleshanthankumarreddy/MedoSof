import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import {
  Package,
  ShoppingCart,
  Calendar,
  Hash,
  Mail,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Truck,
  RefreshCw,
  TrendingUp
} from "lucide-react";

function Purchase() {
  const { lowStockMedicines, setLowStockMedicines, handleRemoveMedicine, backendUrl, role, restoreToLowStock } = useContext(AppContext);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [batchDetails, setBatchDetails] = useState({
    batchCode: "",
    expiryDate: "",
    quantity: "",
    vendorMail: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        `${backendUrl}/api/purchase/addPurchase`,
        {
          medicineCode: selectedMedicine.medicineCode,
          quantity: Number(batchDetails.quantity),
          vendorMail: batchDetails.vendorMail,
          shopCode,
          expiryDate: batchDetails.expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } }
      );

      // 2️⃣ Add batch record
      const res = await axios.post(
        `${backendUrl}/api/batch/addBatch`,
        {
          medicineCode: selectedMedicine.medicineCode,
          batchCode: batchDetails.batchCode,
          expiryDate: batchDetails.expiryDate,
          quantity: Number(batchDetails.quantity),
          vendorMail: batchDetails.vendorMail,
          shopCode,
        },
        { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } }
      );

      if (res.data.success) {
        setMessage("✅ Batch & Purchase added successfully!");
        setLowStockMedicines((prev) =>
          prev.filter((m) => m.medicineCode !== selectedMedicine.medicineCode)
        );
        setTimeout(() => handleCloseModal(), 1500);
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

  const filteredMedicines = lowStockMedicines.filter((med) => {
    const name = med.medicineName ?? "";
    const code = med.medicineCode ?? "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase())
    );
});



return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Purchase <span className="text-[#0C2C47]">Medicines</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reorder low-stock medicines and manage batch details
            </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockMedicines.length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing</p>
                <p className="text-3xl font-bold text-gray-900">{filteredMedicines.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Medicine Grid */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              {searchTerm ? (
                <Package className="w-10 h-10 text-gray-400" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No Matching Medicines' : 'All Stock Levels Good!'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? 'Try a different search term' 
                : 'No low-stock medicines require reordering at the moment.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {filteredMedicines.map((med) => (
                <div
                  key={med.medicineCode}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col justify-between relative overflow-hidden min-h-[280px]"
                >
                  {/* Low Stock Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="space-y-4 pt-8">
                    {/* Medicine Name */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                          {med.medicineName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{med.medicineCode}</p>
                      </div>
                    </div>

                    {/* Stock Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <span className="font-bold text-gray-900">{med.totalQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Threshold</span>
                        <span className="font-bold text-amber-600">{med.threshold}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rack Location</span>
                        <span className="font-bold text-gray-900">{med.rackCode}</span>
                      </div>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Stock Level</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                          style={{ width: `${Math.min(100, (med.totalQuantity / med.threshold) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {med.totalQuantity < med.threshold ? 'Below threshold' : 'At threshold'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => handleSuccess(med)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/order"
                    >
                      <Plus className="w-4 h-4 group-hover/order:scale-110 transition-transform" />
                      Order Arrived
                    </button>
                    <button
                      onClick={() => handleRemoveMedicine(med.medicineCode)}
                      className="px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/cancel"
                    >
                      <X className="w-4 h-4 group-hover/cancel:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Purchase Summary</h3>
                  <p className="text-gray-600 text-sm">
                    Showing {filteredMedicines.length} low-stock medicines requiring reorder
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Immediate Reorder</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Restock Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Batch Entry Modal */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-scaleIn">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Restock Medicine
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">{selectedMedicine.medicineName}</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Batch Code */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    <span className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Batch Code
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="batchCode"
                      placeholder="Enter batch code (e.g., BATCH-001)"
                      value={batchDetails.batchCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400"
                    />
                    <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Vendor Email */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Vendor Email
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      name="vendorMail"
                      placeholder="vendor@example.com"
                      value={batchDetails.vendorMail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400"
                    />
                    <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      Expiry Date
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expiryDate"
                      value={batchDetails.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400"
                    />
                    <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Quantity
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity to order"
                      value={batchDetails.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all duration-300 placeholder-gray-400 hover:border-gray-400"
                      min="1"
                    />
                    <div className="absolute inset-0 border-2 border-[#0C2C47] rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Current stock: {selectedMedicine.totalQuantity} • Threshold: {selectedMedicine.threshold}
                  </p>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mt-6 p-4 rounded-xl border ${message.includes("✅") ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {message.includes("✅") ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <p className={`text-sm font-medium ${message.includes("✅") ? 'text-green-700' : 'text-red-700'}`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      <span>Confirm Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Purchase;