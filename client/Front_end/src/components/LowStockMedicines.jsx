import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { AlertTriangle, Package, RefreshCw, CheckCircle, TrendingDown, Plus, Hash, Layers, ArrowRight, BarChart3, Warehouse, Filter } from "lucide-react";

function LowStockMedicines() {
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRack, setSelectedRack] = useState("all");
  const { lowStockMedicines, setLowStockMedicines, backendUrl, role } = useContext(AppContext);

  const handleRestock = (medicine) => {
    setLowStockMedicines((prev) => prev.some(i => i.medicineCode === medicine.medicineCode) ? prev : [...prev, medicine]);
  };

  const fetchLowStockMedicines = async () => {
    try {
      setLoading(true); setError("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!shopCode) { setError("Shop code not found."); setLoading(false); return; }
      const response = await axios.post(`${backendUrl}/api/medicine/getLowStockMedicines`, { shopCode }, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role }
      });
      if (response.data.success) setLowStockList(response.data.medicines || []);
      else setError(response.data.message || "Failed to fetch medicines.");
    } catch { setError("Unable to fetch low stock medicines."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLowStockMedicines(); }, []);

  const uniqueRacks = ["all", ...new Set(lowStockList.map(m => m.rackCode).filter(Boolean))];
  const filteredMedicines = lowStockList.filter((med) => {
    const matchesSearch = med.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) || med.medicineCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (selectedRack === "all" || med.rackCode === selectedRack);
  });
  const getStockPercentage = (q, t) => Math.min(100, (q / t) * 100);

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 mt-4 sm:mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs sm:text-sm font-semibold text-red-600">STOCK ALERT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Low Stock <span className="text-red-600">Medicines</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Monitor and manage medicines that require immediate reordering</p>
        </div>

        {/* Stats — 2 col mobile, 4 desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
          {[
            { label: "Low Stock Items", value: lowStockList.length, sub: "Require immediate attention", icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />, bg: "bg-red-50" },
            { label: "Showing", value: filteredMedicines.length, sub: "Based on current filters", icon: <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />, bg: "bg-blue-50" },
            { label: "Critical Items", value: lowStockList.filter(m => m.totalQuantity < (m.threshold * 0.5)).length, sub: "Below 50% threshold", icon: <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />, bg: "bg-amber-50" },
            { label: "Unique Racks", value: uniqueRacks.length - 1, sub: "Affected storage locations", icon: <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />, bg: "bg-green-50" },
          ].map((c, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div><p className="text-xs sm:text-sm text-gray-600">{c.label}</p><p className="text-2xl sm:text-3xl font-bold text-gray-900">{c.value}</p></div>
                <div className={`p-2.5 sm:p-3 ${c.bg} rounded-xl`}>{c.icon}</div>
              </div>
              <div className="mt-3 sm:mt-4 text-xs text-gray-500">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search medicines by name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-sm" />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select value={selectedRack} onChange={(e) => setSelectedRack(e.target.value)}
                  className="w-full sm:w-auto pl-9 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 appearance-none bg-white text-sm">
                  {uniqueRacks.map((rack) => <option key={rack} value={rack}>{rack === "all" ? "All Racks" : `Rack: ${rack}`}</option>)}
                </select>
              </div>
              <button onClick={fetchLowStockMedicines} disabled={loading}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 text-sm">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4"><AlertTriangle className="w-10 h-10 text-red-600" /></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button onClick={fetchLowStockMedicines} className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Try Again</button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              {searchTerm || selectedRack !== "all" ? <Filter className="w-10 h-10 text-gray-400" /> : <CheckCircle className="w-10 h-10 text-green-600" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{searchTerm || selectedRack !== "all" ? 'No Matching Medicines' : 'All Stock Levels Good!'}</h3>
            <p className="text-gray-500 max-w-md mx-auto">{searchTerm || selectedRack !== "all" ? 'Try adjusting your search or filter criteria' : 'No medicines are below their threshold levels.'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {filteredMedicines.map((med, index) => (
                <div key={`${med.medicineCode}-${index}`} className="group bg-white rounded-2xl border border-gray-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-4 left-4">
                    <div className={`px-2.5 py-1 text-white text-xs font-bold rounded-full flex items-center gap-1 ${med.totalQuantity < (med.threshold * 0.5) ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-amber-500 to-amber-600'}`}>
                      <AlertTriangle className="w-3 h-3" />{med.totalQuantity < (med.threshold * 0.5) ? 'Critical' : 'Low Stock'}
                    </div>
                  </div>
                  <div className="space-y-4 pt-9">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><Package className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2">{med.medicineName}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Hash className="w-3 h-3" />{med.medicineCode}</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between"><span className="text-gray-600 flex items-center gap-1"><BarChart3 className="w-4 h-4" />Current Stock</span><span className="font-bold text-gray-900">{med.totalQuantity}</span></div>
                      <div className="flex items-center justify-between"><span className="text-gray-600">Threshold</span><span className="font-bold text-amber-600">{med.threshold}</span></div>
                      <div className="flex items-center justify-between"><span className="text-gray-600 flex items-center gap-1"><Warehouse className="w-4 h-4" />Rack</span><span className="font-bold text-gray-900">{med.rackCode}</span></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm"><span className="text-gray-500">Stock Level</span><span className="font-semibold text-red-600">{getStockPercentage(med.totalQuantity, med.threshold).toFixed(0)}%</span></div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${med.totalQuantity < (med.threshold * 0.5) ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`} style={{ width: `${getStockPercentage(med.totalQuantity, med.threshold)}%` }} /></div>
                      <div className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{med.totalQuantity < med.threshold ? 'Below threshold' : 'At threshold'}</div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button onClick={() => handleRestock(med)} className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn text-sm">
                      <Plus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /><span>Add to Purchase List</span><ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-red-100 shadow-sm mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Stock Summary</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} require{filteredMedicines.length === 1 ? 's' : ''} restocking.{filteredMedicines.some(m => m.totalQuantity < (m.threshold * 0.5)) && ' Some are at critical levels.'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-amber-600"><div className="w-3 h-3 bg-amber-500 rounded-full" /><span className="text-sm">Low Stock</span></div>
                  <div className="flex items-center gap-2 text-red-600"><div className="w-3 h-3 bg-red-600 rounded-full" /><span className="text-sm">Critical</span></div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center text-gray-500 text-xs sm:text-sm pt-6 sm:pt-8 pb-10 sm:pb-12 border-t border-gray-200">
          <p>✅ Added medicines will appear in the Purchase page for batch ordering</p>
          <p className="mt-1">🔄 Refresh to get the latest stock levels</p>
        </div>
      </div>
    </div>
  );
}

export default LowStockMedicines;