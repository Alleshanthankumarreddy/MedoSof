import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddMedicine from "./AddMedicine";
import UpdateMedicine from "./UpdateMedicine";
import DeleteMedicine from "./DeleteMedicine";
import { AppContext } from "../AppContext";
import { Search, X, Eye, IndianRupee, Package, Layers, Edit2, Trash2, Filter } from "lucide-react";

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [updatingMedicine, setUpdatingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState("name");
  const { backendUrl, role } = useContext(AppContext);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!token || !shopCode) return;
      const response = await axios.post(`${backendUrl}/api/medicine/getAllMedicines`, { shopCode }, { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } });
      const list = response.data.medicines || [];
      setMedicines(list); setFilteredMedicines(list);
    } catch (error) { console.error("Error fetching medicines:", error.response?.data || error); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase();
    setFilteredMedicines(medicines.filter((m) => (m.medicineName?.toLowerCase() || "").includes(q) || (m.rackCode?.toLowerCase() || "").includes(q) || (m.genericName?.toLowerCase() || "").includes(q)));
    setVisibleCount(8);
  };

  useEffect(() => {
    let sorted = [...filteredMedicines];
    if (sortBy === "name") sorted.sort((a, b) => a.medicineName?.localeCompare(b.medicineName));
    else if (sortBy === "price") sorted.sort((a, b) => a.unitSellingPrice - b.unitSellingPrice);
    else if (sortBy === "stock") sorted.sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0));
    setFilteredMedicines(sorted);
  }, [sortBy, medicines]);

  useEffect(() => { if (!searchTerm) { setFilteredMedicines(medicines); setVisibleCount(8); } }, [searchTerm, medicines]);

  const visibleMedicines = filteredMedicines.slice(0, visibleCount);
  const hasMoreMedicines = visibleCount < filteredMedicines.length;

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 sm:mb-10 mt-6 sm:mt-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Medicine <span className="text-[#0C2C47]">Inventory</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Manage and track all your pharmacy medicines in one place</p>
        </div>

        {/* Search & Sort */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by name, rack code, or generic name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all text-sm" />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(""); setFilteredMedicines(medicines); setVisibleCount(8); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-44 pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] bg-white appearance-none text-sm">
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                </select>
              </div>
              <button onClick={handleSearch} className="px-4 sm:px-6 py-3 bg-[#0C2C47] text-white font-semibold rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap">
                <Search className="w-4 h-4" /><span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 bg-white px-4 py-3 sm:py-4 rounded-xl border border-gray-200 shadow-sm">
            <div><p className="text-xs text-gray-500">Total Medicines</p><p className="text-lg sm:text-xl font-bold text-gray-900">{medicines.length}</p></div>
            <div className="p-2 bg-blue-50 rounded-lg"><Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /></div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 bg-white px-4 py-3 sm:py-4 rounded-xl border border-gray-200 shadow-sm">
            <div><p className="text-xs text-gray-500">Showing</p><p className="text-lg sm:text-xl font-bold text-gray-900">{visibleMedicines.length}</p></div>
            <div className="p-2 bg-green-50 rounded-lg"><Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /></div>
          </div>
        </div>

        {/* Medicine Cards */}
        {visibleMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {visibleMedicines.map((med, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Delete X */}
                <button onClick={(e) => { e.stopPropagation(); setDeletingMedicine(med); }}
                  className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 hover:bg-red-50 shadow-sm transition-all">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-500" />
                {/* Hover actions */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mt-7">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedMedicine(med); }} className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"><Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                  <button onClick={() => setUpdatingMedicine(med)} className="p-1.5 sm:p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors shadow-sm"><Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeletingMedicine(med); }} className="p-1.5 sm:p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                </div>

                <div onClick={() => setSelectedMedicine(med)} className="cursor-pointer space-y-3 sm:space-y-4 relative z-10 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><Package className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2">{med.medicineName}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{med.genericName}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <div className="p-1.5 bg-gray-100 rounded"><Layers className="w-3 h-3 text-gray-500" /></div>
                      <span><span className="font-semibold">Rack:</span> {med.rackCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <div className="p-1.5 bg-green-100 rounded"><IndianRupee className="w-3 h-3 text-green-600" /></div>
                      <span><span className="font-semibold">Price:</span> ₹{med.unitSellingPrice}</span>
                    </div>
                    {med.totalQuantity !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Stock Level</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${med.totalQuantity > (med.thresholdValue || 20) ? 'bg-green-500' : med.totalQuantity > 10 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (med.totalQuantity / 100) * 100)}%` }} />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{med.totalQuantity} units</div>
                      </div>
                    )}
                  </div>
                </div>

                <button onClick={() => setUpdatingMedicine(med)} className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 sm:py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group/btn text-sm">
                  <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />Update Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4"><Package className="w-8 h-8 text-gray-400" /></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Medicines Found</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">{searchTerm ? 'Try a different search term' : 'Add your first medicine to start managing inventory'}</p>
          </div>
        )}

        {/* Load More / Show Less */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {hasMoreMedicines && (
            <button onClick={() => setVisibleCount(prev => prev + 8)} className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base">
              Load More Medicines <span>↓</span>
            </button>
          )}
          {visibleCount >= filteredMedicines.length && filteredMedicines.length > 0 && (
            <button onClick={() => setVisibleCount(8)} className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base">
              Show Less <span>↑</span>
            </button>
          )}
        </div>

        {/* Add Medicine */}
        <div className="flex flex-col items-center justify-center mb-8">
          <AddMedicine onMedicineAdded={fetchMedicines} />
        </div>

        {/* View Medicine Modal */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
              <button onClick={() => setSelectedMedicine(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="p-2.5 sm:p-3 bg-blue-100 rounded-xl"><Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" /></div>
                <div><h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedMedicine.medicineName}</h2><p className="text-gray-600 text-sm">{selectedMedicine.genericName}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-700 mb-2 text-sm sm:text-base">Basic Information</h4>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <p><span className="font-medium text-gray-700">Trade Name:</span> {selectedMedicine.tradeName}</p>
                      <p><span className="font-medium text-gray-700">Rack Code:</span> {selectedMedicine.rackCode}</p>
                      <p><span className="font-medium text-gray-700">Medicine Code:</span> {selectedMedicine.medicineCode}</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-3 sm:p-4 rounded-xl">
                    <h4 className="font-semibold text-amber-700 mb-2 text-sm sm:text-base">Pricing</h4>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <p><span className="font-medium text-gray-700">Cost Price:</span> ₹{selectedMedicine.unitCostPrice}</p>
                      <p><span className="font-medium text-gray-700">Selling Price:</span> ₹{selectedMedicine.unitSellingPrice}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-xl">
                    <h4 className="font-semibold text-green-700 mb-2 text-sm sm:text-base">Stock Information</h4>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <p><span className="font-medium text-gray-700">Total Quantity:</span> {selectedMedicine.totalQuantity}</p>
                      <p><span className="font-medium text-gray-700">Threshold Value:</span> {selectedMedicine.thresholdValue}</p>
                      <p><span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${(selectedMedicine.totalQuantity || 0) > (selectedMedicine.thresholdValue || 20) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {(selectedMedicine.totalQuantity || 0) > (selectedMedicine.thresholdValue || 20) ? 'In Stock' : 'Low Stock'}
                        </span>
                      </p>
                    </div>
                  </div>
                  {selectedMedicine.usageDescription && (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Description</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{selectedMedicine.usageDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {updatingMedicine && <UpdateMedicine medicine={updatingMedicine} onClose={() => setUpdatingMedicine(null)} onUpdateSuccess={fetchMedicines} />}
        {deletingMedicine && <DeleteMedicine medicine={deletingMedicine} onClose={() => setDeletingMedicine(null)} onDeleteSuccess={fetchMedicines} />}
      </div>
    </div>
  );
}

export default Medicines;