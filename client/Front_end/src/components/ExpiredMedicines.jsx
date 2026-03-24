import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle, Calendar, Package, Trash2, RefreshCw, CheckCircle,
  X, Clock, Hash, TrendingDown, Shield, Filter, BarChart3, Download, AlertCircle
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
  const [stats, setStats] = useState({ total: 0, totalQuantity: 0, critical: 0 });
  const { backendUrl, role } = useContext(AppContext);

  useEffect(() => { fetchExpiredMedicines(); }, []);

  useEffect(() => {
    setFilteredList(expiredList.filter(batch => {
      const s = searchTerm.toLowerCase();
      return (batch.medicineName?.toLowerCase() || '').includes(s) || (batch.batchCode?.toLowerCase() || '').includes(s);
    }));
  }, [searchTerm, expiredList]);

  const fetchExpiredMedicines = async () => {
    try {
      setLoading(true); setError(""); setActionMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      const res = await axios.post(`${backendUrl}/api/batch/expiredMedicines`, { shopCode }, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role }
      });
      if (res.data.success) {
        const data = res.data.data || [];
        setExpiredList(data); setFilteredList(data);
        setStats({ total: data.length, totalQuantity: data.reduce((s, b) => s + (b.quantity || 0), 0), critical: data.filter(b => calculateDaysExpired(b.expiryDate) > 30).length });
      } else setError(res.data.message || "Failed to load.");
    } catch { setError("Failed to fetch expired medicines."); }
    finally { setLoading(false); }
  };

  const calculateDaysExpired = (d) => Math.max(0, Math.floor((new Date() - new Date(d)) / 86400000));
  const getSeverityColor = (d) => d > 90 ? "bg-red-600" : d > 30 ? "bg-orange-500" : "bg-amber-500";
  const getSeverityText = (d) => d > 90 ? "Critical" : d > 30 ? "High" : "Medium";

  const handleRemoveExpired = async () => {
    try {
      setLoading(true); setActionMessage("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      const res = await axios.delete(`${backendUrl}/api/batch/removeExpiredMedicines`, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
        data: { shopCode }
      });
      if (res.data.success) {
        setActionMessage({ type: "success", text: `Successfully removed ${res.data.deletedCount} expired batches` });
        fetchExpiredMedicines();
      } else setActionMessage({ type: "error", text: res.data.message });
    } catch { setActionMessage({ type: "error", text: "Failed to remove expired medicines." }); }
    finally { setLoading(false); setShowConfirmModal(false); }
  };

  const handleExportData = () => {
    if (!filteredList.length) return;
    const csvData = filteredList.map(b => ({ Medicine: b.medicineName, "Batch Code": b.batchCode, Quantity: b.quantity, "Expiry Date": new Date(b.expiryDate).toLocaleDateString(), "Days Expired": calculateDaysExpired(b.expiryDate) }));
    const csv = [Object.keys(csvData[0]).join(','), ...csvData.map(r => Object.values(r).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'expired_medicines.csv'; a.click();
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs sm:text-sm font-semibold text-red-600">EXPIRY ALERT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Expired <span className="text-red-600">Medicines</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Monitor and safely dispose of expired pharmaceutical batches
          </p>
        </div>

        {/* Stats — 1 col mobile, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {[
            { label: "Expired Batches", value: stats.total, sub: "Total expired batches", icon: <Package className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />, bg: "bg-red-50" },
            { label: "Total Quantity", value: stats.totalQuantity, sub: "Units to dispose", icon: <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />, bg: "bg-amber-50" },
            { label: "Critical Items", value: stats.critical, sub: "Expired 30+ days", icon: <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-700" />, bg: "bg-red-100" },
          ].map((c, i) => (
            <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-gray-600">{c.label}</p><p className="text-2xl sm:text-3xl font-bold text-gray-900">{c.value}</p></div>
                <div className={`p-2.5 sm:p-3 ${c.bg} rounded-xl`}>{c.icon}</div>
              </div>
              <div className="mt-3 sm:mt-4 text-xs text-gray-500">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Search + Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search expired medicines or batch codes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-sm" />
              {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>}
            </div>
            <div className="flex gap-3">
              <button onClick={fetchExpiredMedicines} disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
              </button>
              <button onClick={handleExportData} disabled={filteredList.length === 0}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                <Download className="w-4 h-4" />Export
              </button>
            </div>
          </div>
          {searchTerm && <p className="mt-3 text-center text-sm text-gray-500">Showing {filteredList.length} of {expiredList.length} expired batches</p>}
        </div>

        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl border ${actionMessage.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-3">
              {actionMessage.type === "success" ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />}
              <p className={`text-sm font-medium ${actionMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>{actionMessage.text}</p>
            </div>
          </div>
        )}

        {loading && !actionMessage ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading expired medicines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button onClick={fetchExpiredMedicines} className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Try Again</button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              {searchTerm ? <Filter className="w-10 h-10 text-gray-400" /> : <CheckCircle className="w-10 h-10 text-green-600" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{searchTerm ? 'No Matching Batches' : 'All Clear!'}</h3>
            <p className="text-gray-500 max-w-md mx-auto">{searchTerm ? 'Try a different search term' : 'No expired medicines found. Great inventory management!'}</p>
          </div>
        ) : (
          <>
            {/* Danger Zone */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-red-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-red-100 rounded-xl shrink-0"><Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" /></div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Dispose All Expired</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Permanently remove {filteredList.length} expired batches from inventory</p>
                    </div>
                  </div>
                  <button onClick={() => setShowConfirmModal(true)} disabled={loading}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                    <Trash2 className="w-4 h-4" />Remove All Expired
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {filteredList.map((batch) => {
                const daysExpired = calculateDaysExpired(batch.expiryDate);
                const sevColor = getSeverityColor(daysExpired);
                const sevText = getSeverityText(daysExpired);
                return (
                  <div key={batch._id} className="group bg-white rounded-2xl border border-gray-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <div className={`px-2.5 py-1 ${sevColor} text-white text-xs font-bold rounded-full flex items-center gap-1`}>
                        <AlertTriangle className="w-3 h-3" />{sevText}
                      </div>
                    </div>
                    <div className="space-y-4 pt-9">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0"><Package className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2">{batch.medicineName || "Unknown Medicine"}</h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Hash className="w-3 h-3" />{batch.batchCode}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-600 flex items-center gap-1"><BarChart3 className="w-4 h-4" />Quantity</span><span className="font-bold text-gray-900">{batch.quantity}</span></div>
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-600 flex items-center gap-1"><Calendar className="w-4 h-4" />Expired</span><span className="font-bold text-red-600">{new Date(batch.expiryDate).toLocaleDateString()}</span></div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm"><span className="text-gray-500">Days Expired</span><span className="font-semibold text-red-600">{daysExpired} days</span></div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${sevColor} rounded-full`} style={{ width: `${Math.min(100, (daysExpired / 180) * 100)}%` }} /></div>
                        <div className="text-xs text-red-500 flex items-center gap-1"><Clock className="w-3 h-3" />Expired {daysExpired} days ago</div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <button onClick={() => setSelectedBatch(batch)} className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-200 text-sm">
                        <span>View Details</span><AlertTriangle className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safety Reminder */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-red-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-red-100 rounded-xl shrink-0"><Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" /></div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Safety Reminder</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Expired medicines should be disposed of safely following regulatory guidelines</p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </>
        )}

        {/* Batch Details Modal */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md relative max-h-[95vh] overflow-y-auto">
              <button onClick={() => setSelectedBatch(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Expired Batch Details</h2>
                <p className="text-sm text-gray-500">{selectedBatch.medicineName}</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Batch Code</p><p className="font-semibold text-gray-900 text-sm">{selectedBatch.batchCode}</p></div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Quantity</p><p className="font-semibold text-gray-900 text-sm">{selectedBatch.quantity} units</p></div>
                </div>
                <div className="p-3 sm:p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-red-600" /><p className="font-semibold text-red-700 text-sm">Expiry Date</p></div>
                  <p className="text-red-600 text-sm">{new Date(selectedBatch.expiryDate).toLocaleDateString()}</p>
                  <p className="text-xs text-red-500 mt-1">Expired {calculateDaysExpired(selectedBatch.expiryDate)} days ago</p>
                </div>
                <div className="p-3 sm:p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div><p className="font-semibold text-amber-700 text-sm mb-1">Safety Notice</p><p className="text-xs text-amber-600">This batch has expired and should be disposed of following proper pharmaceutical waste disposal protocols.</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex gap-3">
                <button onClick={() => setSelectedBatch(null)} className="flex-1 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm">Close</button>
                <button onClick={() => { setShowConfirmModal(true); setSelectedBatch(null); }} className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">Dispose Batch</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md relative">
              <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"><X className="w-5 h-5" /></button>
              <div className="text-center mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Confirm Removal</h2>
                <p className="text-gray-600 text-sm">This action cannot be undone</p>
              </div>
              <div className="p-3 sm:p-4 bg-red-50 rounded-xl mb-5 sm:mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div><p className="font-semibold text-red-700 text-sm mb-1">Warning</p><p className="text-xs text-red-600">You are about to permanently remove {filteredList.length} expired batches. This action is irreversible.</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">Batches</p><p className="font-bold text-gray-900 text-xl">{filteredList.length}</p></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-xs text-gray-500">Total Units</p><p className="font-bold text-gray-900 text-xl">{stats.totalQuantity}</p></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm">Cancel</button>
                <button onClick={handleRemoveExpired} disabled={loading} className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Processing...</span></> : <><Trash2 className="w-4 h-4" /><span>Confirm Remove</span></>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm">
          <p className="flex items-center justify-center gap-2"><Shield className="w-4 h-4" />Regularly dispose of expired medicines to maintain pharmacy compliance</p>
        </div>
      </div>
    </div>
  );
}

export default ExpiredMedicines;