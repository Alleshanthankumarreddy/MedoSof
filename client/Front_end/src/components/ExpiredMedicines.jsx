import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { 
  AlertTriangle, 
  Calendar, 
  Package, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  X, 
  Clock, 
  Hash, 
  TrendingDown,
  Shield,
  Filter,
  BarChart3,
  Download,
  AlertCircle
} from "lucide-react";
import { AppContext } from "../AppContext";

function ExpiredMedicines() {
  const [expiredList, setExpiredList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalQuantity: 0,
    critical: 0
  });

  const { backendUrl, role } = useContext(AppContext);

  useEffect(() => {
    fetchExpiredMedicines();
  }, []);

  useEffect(() => {
    const filtered = expiredList.filter(batch => {
      const medicineName = batch.medicineName?.toLowerCase() || '';
      const batchCode = batch.batchCode?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return medicineName.includes(searchLower) || 
             batchCode.includes(searchLower);
    });
    setFilteredList(filtered);
  }, [searchTerm, expiredList]);

  const fetchExpiredMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      setActionMessage("");

      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const res = await axios.post(
        `${backendUrl}api/batch/expiredMedicines`,
        { shopCode },
        { headers: {
           Authorization: `Bearer ${token}`,
           "x-user-role": role
        }}
      );

      if (res.data.success) {
        const expiredData = res.data.data || [];
        setExpiredList(expiredData);
        setFilteredList(expiredData);
        
        // Calculate statistics
        const totalQuantity = expiredData.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
        const criticalCount = expiredData.filter(batch => 
          calculateDaysExpired(batch.expiryDate) > 30
        ).length;
        
        setStats({
          total: expiredData.length,
          totalQuantity: totalQuantity,
          critical: criticalCount
        });
      } else {
        setError(res.data.message || "Failed to load expired medicines.");
      }
    } catch (err) {
      console.error("Error fetching expired medicines:", err);
      setError("Failed to fetch expired medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysExpired = (expiryDate) => {
    const diffMs = new Date() - new Date(expiryDate);
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const getSeverityColor = (days) => {
    if (days > 90) return "bg-red-600";
    if (days > 30) return "bg-orange-500";
    return "bg-amber-500";
  };

  const getSeverityText = (days) => {
    if (days > 90) return "Critical";
    if (days > 30) return "High";
    return "Medium";
  };

  const handleRemoveExpired = async () => {
    try {
      setLoading(true);
      setActionMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const res = await axios.delete(
        `${backendUrl}api/batch/removeExpiredMedicines`,
        {
          headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
          data: { shopCode },
        }
      );

      if (res.data.success) {
        setActionMessage({
          type: "success",
          text: `Successfully removed ${res.data.deletedCount} expired batches`
        });
        fetchExpiredMedicines();
      } else {
        setActionMessage({
          type: "error",
          text: res.data.message
        });
      }
    } catch (err) {
      console.error("Error removing expired medicines:", err);
      setActionMessage({
        type: "error",
        text: "Failed to remove expired medicines. Please try again."
      });
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleExportData = () => {
    const csvData = filteredList.map(batch => ({
      Medicine: batch.medicineName,
      "Batch Code": batch.batchCode,
      Quantity: batch.quantity,
      "Expiry Date": new Date(batch.expiryDate).toLocaleDateString(),
      "Days Expired": calculateDaysExpired(batch.expiryDate)
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expired_medicines.csv';
    a.click();
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-600">
              EXPIRY ALERT
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Expired <span className="text-red-600">Medicines</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor and safely dispose of expired pharmaceutical batches
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired Batches</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Total expired batches
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalQuantity}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Units to dispose
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-700" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Expired  30 days
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              
              {/* Search */}
              <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search expired medicines or batch codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={fetchExpiredMedicines}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={handleExportData}
                disabled={filteredList.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {searchTerm && (
              <p className="mt-3 text-center text-sm text-gray-500">
                Showing {filteredList.length} of {expiredList.length} expired batches
              </p>
            )}
          </div>


        {/* Action Message */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl border ${
            actionMessage.type === "success" 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              {actionMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <p className={`font-medium ${
                actionMessage.type === "success" ? "text-green-700" : "text-red-700"
              }`}>
                {actionMessage.text}
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading && !actionMessage ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading expired medicines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={fetchExpiredMedicines}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              {searchTerm ? (
                <Filter className="w-10 h-10 text-gray-400" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No Matching Batches' : 'All Clear!'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? 'Try a different search term' 
                : 'No expired medicines found. Great inventory management!'}
            </p>
          </div>
        ) : (
          <>
            {/* Danger Zone - Remove All Button */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Dispose All Expired</h3>
                      <p className="text-gray-600 text-sm">
                        Permanently remove {filteredList.length} expired batches from inventory
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove All Expired
                  </button>
                </div>
              </div>
            </div>

            {/* Expired Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {filteredList.map((batch) => {
                const daysExpired = calculateDaysExpired(batch.expiryDate);
                const severityColor = getSeverityColor(daysExpired);
                const severityText = getSeverityText(daysExpired);
                
                return (
                  <div
                    key={batch._id}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Severity Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 ${severityColor} text-white text-xs font-bold rounded-full flex items-center gap-1`}>
                        <AlertTriangle className="w-3 h-3" />
                        {severityText}
                      </div>
                    </div>

                    {/* Medicine Info */}
                    <div className="space-y-5 pt-10">
                      {/* Medicine Name */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                            {batch.medicineName || "Unknown Medicine"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {batch.batchCode}
                          </p>
                        </div>
                      </div>

                      {/* Batch Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            Quantity
                          </span>
                          <span className="font-bold text-gray-900 text-lg">{batch.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Expired
                          </span>
                          <span className="font-bold text-red-600">
                            {new Date(batch.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Days Expired Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Days Expired</span>
                          <span className="font-semibold text-red-600">
                            {daysExpired} days
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${severityColor} rounded-full`}
                            style={{ 
                              width: `${Math.min(100, (daysExpired / 180) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-red-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expired {daysExpired} days ago
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-gray-200"
                      >
                        <span>View Details</span>
                        <AlertTriangle className="w-4 h-4 text-red-500 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Safety Reminder</h3>
                    <p className="text-gray-600 text-sm">
                      Expired medicines should be disposed of safely following regulatory guidelines
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Batch Details Modal */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedBatch(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Expired Batch Details
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">{selectedBatch.medicineName}</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Batch Code</p>
                    <p className="font-semibold text-gray-900">{selectedBatch.batchCode}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="font-semibold text-gray-900">{selectedBatch.quantity} units</p>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-red-700">Expiry Date</p>
                  </div>
                  <p className="text-red-600">
                    {new Date(selectedBatch.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-red-500 mt-1">
                    Expired {calculateDaysExpired(selectedBatch.expiryDate)} days ago
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-700">Safety Notice</p>
                      <p className="text-sm text-amber-600 mt-1">
                        This batch has expired and should be disposed of following proper pharmaceutical waste disposal protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(true);
                    setSelectedBatch(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Dispose Batch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Removal Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Warning Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trash2 className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Removal
                </h2>
                <p className="text-gray-600">
                  This action cannot be undone
                </p>
              </div>

              {/* Warning Message */}
              <div className="p-4 bg-red-50 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 mb-1">Warning</p>
                    <p className="text-sm text-red-600">
                      You are about to permanently remove {filteredList.length} expired batches from your inventory. This action is irreversible.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Batches</p>
                  <p className="font-bold text-gray-900 text-xl">{filteredList.length}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Units</p>
                  <p className="font-bold text-gray-900 text-xl">{stats.totalQuantity}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveExpired}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Confirm Remove</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Regularly dispose of expired medicines to maintain pharmacy compliance
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpiredMedicines;