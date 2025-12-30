import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import {
  AlertTriangle,
  Package,
  RefreshCw,
  CheckCircle,
  TrendingDown,
  Plus,
  Hash,
  Layers,
  ArrowRight,
  BarChart3,
  Warehouse,
  Filter
} from "lucide-react";

function LowStockMedicines() {
  const [lowStockList, setLowStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRack, setSelectedRack] = useState("all");
  const { lowStockMedicines, setLowStockMedicines, backendUrl, role } = useContext(AppContext);

  const handleRestock = (medicine) => {
    setLowStockMedicines((prev) => {
      const alreadyExists = prev.some(item => item.medicineCode === medicine.medicineCode);
      if (!alreadyExists) {
        return [...prev, medicine];
      }
      return prev;
    });
  };

  const fetchLowStockMedicines = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      if (!shopCode) {
        setError("Shop code not found in localStorage.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}api/medicine/getLowStockMedicines`,
        { shopCode },
        {
          headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
        }
      );

      if (response.data.success) {
        setLowStockList(response.data.medicines || []);
      } else {
        setError(response.data.message || "Failed to fetch medicines.");
      }
    } catch (err) {
      console.error("Error fetching low stock medicines:", err);
      setError("Unable to fetch low stock medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockMedicines();
  }, []);

  // Get unique racks for filtering
  const uniqueRacks = ["all", ...new Set(lowStockList.map(med => med.rackCode).filter(Boolean))];

  // Filter medicines based on search term and rack
  const filteredMedicines = lowStockList.filter((med) => {
    const matchesSearch = med.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.medicineCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRack = selectedRack === "all" || med.rackCode === selectedRack;
    return matchesSearch && matchesRack;
  });

  // Calculate stock percentage
  const getStockPercentage = (quantity, threshold) => {
    return Math.min(100, (quantity / threshold) * 100);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-600">
              STOCK ALERT
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Low Stock <span className="text-red-600">Medicines</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitor and manage medicines that require immediate reordering
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 mb-10 overflow-x-auto">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockList.length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Require immediate attention
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Showing</p>
                <p className="text-3xl font-bold text-gray-900">{filteredMedicines.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Based on current filters
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {lowStockList.filter(m => m.totalQuantity < (m.threshold * 0.5)).length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Below 50% threshold
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Racks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {uniqueRacks.length - 1}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Warehouse className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Affected storage locations
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 flex-nowrap">
            <div className="flex-1 relative">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <Warehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedRack}
                  onChange={(e) => setSelectedRack(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 appearance-none bg-white"
                >
                  {uniqueRacks.map((rack) => (
                    <option key={rack} value={rack}>
                      {rack === "all" ? "All Racks" : `Rack: ${rack}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={fetchLowStockMedicines}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading medicines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={fetchLowStockMedicines}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
              {searchTerm || selectedRack !== "all" ? (
                <Filter className="w-10 h-10 text-gray-400" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || selectedRack !== "all" ? 'No Matching Medicines' : 'All Stock Levels Good!'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || selectedRack !== "all" 
                ? 'Try adjusting your search or filter criteria' 
                : 'No medicines are below their threshold levels. Great work!'}
            </p>
          </div>
        ) : (
          <>
            {/* Medicine Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {filteredMedicines.map((med, index) => (
                <div
                  key={`${med.medicineCode}-${index}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Low Stock Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 text-white text-xs font-bold rounded-full flex items-center gap-1 ${
                      med.totalQuantity < (med.threshold * 0.5) 
                        ? 'bg-gradient-to-r from-red-600 to-red-700' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      {med.totalQuantity < (med.threshold * 0.5) ? 'Critical' : 'Low Stock'}
                    </div>
                  </div>

                  {/* Medicine Info */}
                  <div className="space-y-5 pt-10">
                    {/* Medicine Name */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                          {med.medicineName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {med.medicineCode}
                        </p>
                      </div>
                    </div>

                    {/* Stock Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          Current Stock
                        </span>
                        <span className="font-bold text-gray-900 text-lg">{med.totalQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Threshold</span>
                        <span className="font-bold text-amber-600">{med.threshold}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Warehouse className="w-4 h-4" />
                          Rack Location
                        </span>
                        <span className="font-bold text-gray-900">{med.rackCode}</span>
                      </div>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Stock Level</span>
                        <span className="font-semibold text-red-600">
                          {getStockPercentage(med.totalQuantity, med.threshold).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            med.totalQuantity < (med.threshold * 0.5) 
                              ? 'bg-gradient-to-r from-red-600 to-red-500' 
                              : 'bg-gradient-to-r from-amber-500 to-amber-400'
                          }`}
                          style={{ 
                            width: `${getStockPercentage(med.totalQuantity, med.threshold)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {med.totalQuantity < med.threshold ? 'Below threshold' : 'At threshold'}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => handleRestock(med)}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <Plus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      <span>Add to Purchase List</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 border border-red-100 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Summary</h3>
                  <p className="text-gray-600 text-sm">
                    {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} require{filteredMedicines.length === 1 ? 's' : ''} restocking. 
                    {filteredMedicines.some(m => m.totalQuantity < (m.threshold * 0.5)) && 
                      ' Some are at critical levels and need immediate attention.'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-amber-600">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Low Stock</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-sm">Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm pt-8 pb-12 border-t border-gray-200">
          <p>✅ Added medicines will appear in the Purchase page for batch ordering</p>
          <p className="mt-1">🔄 Refresh to get the latest stock levels</p>
        </div>
      </div>
    </div>
  );
}

export default LowStockMedicines;