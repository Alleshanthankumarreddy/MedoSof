import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddMedicine from "./AddMedicine";
import UpdateMedicine from "./UpdateMedicine";
import DeleteMedicine from "./DeleteMedicine"; 
import { AppContext } from "../AppContext";
import { Search, X, Eye, IndianRupee, Package, Layers, Edit2, Trash2, Plus, Filter } from "lucide-react";

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [updatingMedicine, setUpdatingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8); // Show 2 rows initially
  const [sortBy, setSortBy] = useState("name");

  const {backendUrl, role} = useContext(AppContext);

  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!token || !shopCode) return;

      const response = await axios.post(
        `${backendUrl}api/medicine/getAllMedicines`,
        { shopCode },
        {
          headers: { Authorization: `Bearer ${token}`,"x-user-role": role },
        }
      );

      const medicinesList = response.data.medicines || [];
      setMedicines(medicinesList);
      setFilteredMedicines(medicinesList);
    } catch (error) {
      console.error("Error fetching medicines:", error.response?.data || error);
    }
  };
   
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Search handler
  const handleSearch = () => {
    const query = searchTerm.trim().toLowerCase();
    const results = medicines.filter((medicine) => {
      const name = medicine.medicineName?.toLowerCase() || "";
      const rack = medicine.rackCode?.toLowerCase() || "";
      const generic = medicine.genericName?.toLowerCase() || "";
      return name.includes(query) || rack.includes(query) || generic.includes(query);
    });
    setFilteredMedicines(results);
    setVisibleCount(8); // Reset visible count when searching
  };

  // Sort medicines
  useEffect(() => {
    let sorted = [...filteredMedicines];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.medicineName?.localeCompare(b.medicineName));
    } else if (sortBy === "price") {
      sorted.sort((a, b) => a.unitSellingPrice - b.unitSellingPrice);
    } else if (sortBy === "stock") {
      sorted.sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0));
    }
    setFilteredMedicines(sorted);
  }, [sortBy, medicines]);

  // Reset filtered list if search is empty
  useEffect(() => {
    if (!searchTerm) {
      setFilteredMedicines(medicines);
      setVisibleCount(8);
    }
  }, [searchTerm, medicines]);

  const visibleMedicines = filteredMedicines.slice(0, visibleCount);
  const hasMoreMedicines = visibleCount < filteredMedicines.length;

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full"> 
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 mt-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Medicine <span className="text-[#0C2C47]">Inventory</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track all your pharmacy medicines in one place
          </p>
        </div>

        {/* Search and Filter Bar */}
        {/* Search and Sort Bar */}
<div className="mb-10">
  <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">

    {/* Search Input */}
    <div className="relative flex-1 min-w-[260px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by medicine name, rack code, or generic name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30
                   focus:border-[#0C2C47] transition-all"
      />

      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilteredMedicines(medicines);
            setVisibleCount(8);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    {/* Sort Dropdown */}
    <div className="relative min-w-[180px]">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30
                   focus:border-[#0C2C47] bg-white appearance-none"
      >
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
        <option value="stock">Sort by Stock</option>
      </select>
    </div>

    {/* Search Button */}
    <button
      onClick={handleSearch}
      className="px-6 py-3 bg-[#0C2C47] text-white font-semibold rounded-xl
                 hover:bg-[#0A243A] hover:shadow-lg transition-all
                 flex items-center gap-2 whitespace-nowrap"
    >
      <Search className="w-5 h-5" />
      Search
    </button>

  </div>
</div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-10 justify-left lg:justify-start">

  {/* Total Medicines */}
  <div className="flex items-center gap-4 bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm w-fit">
    <div>
      <p className="text-xs text-gray-500">Total Medicines</p>
      <p className="text-xl font-bold text-gray-900">{medicines.length}</p>
    </div>
    <div className="p-2 bg-blue-50 rounded-lg">
      <Package className="w-5 h-5 text-blue-600" />
    </div>
  </div>

  {/* Currently Showing */}
  <div className="flex items-center gap-4 bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm w-fit">
    <div>
      <p className="text-xs text-gray-500">Showing</p>
      <p className="text-xl font-bold text-gray-900">{visibleMedicines.length}</p>
    </div>
    <div className="p-2 bg-green-50 rounded-lg">
      <Eye className="w-5 h-5 text-green-600" />
    </div>
  </div>

</div>


        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Add Medicine Card (Always first) */}

          {/* Medicine Cards */}
          <div className="flex flex-wrap gap-6 w-full">
          {visibleMedicines.length > 0 ? (
            visibleMedicines.map((med, index) => (
              <div
                key={index}
                className="group w-80 h-80 bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Delete (X) Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingMedicine(med);
                  }}
                  className="absolute top-3 right-3 z-20 w-7 h-7
                            flex items-center justify-center
                            rounded-full bg-white border border-gray-200
                            text-gray-500 hover:text-red-500
                            hover:border-red-300 hover:bg-red-50
                            shadow-sm transition-all"
                  title="Delete medicine"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Background effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-500"></div>
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedicine(med);
                    }}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setUpdatingMedicine(med)}
                    className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors shadow-sm"
                    title="Update medicine"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingMedicine(med);
                    }}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                    title="Delete medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Medicine Info */}
                <div 
                  onClick={() => setSelectedMedicine(med)} 
                  className="cursor-pointer space-y-4 relative z-10"
                >
                  {/* Medicine Name */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                        {med.medicineName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{med.genericName}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 pl-1">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 bg-gray-100 rounded">
                        <Layers className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="text-sm">
                        <span className="font-semibold">Rack:</span> {med.rackCode}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 bg-green-100 rounded">
                        <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm">
                        <span className="font-semibold">Price:</span> ₹{med.unitSellingPrice}
                      </span>
                    </div>

                    {/* Stock info */}
                    {med.totalQuantity !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Stock Level</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                med.totalQuantity > (med.thresholdValue || 20) ? 'bg-green-500' : 
                                med.totalQuantity > 10 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, (med.totalQuantity / 100) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {med.totalQuantity} units
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Button (Always visible) */}
                <button
                  onClick={() => setUpdatingMedicine(med)}
                  className="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Update Details
                </button>
              </div>
            ))
          ) : (
            <div className="lg:col-span-4 text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Medicines Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm ? 'Try a different search term' : 'Add your first medicine to start managing your pharmacy inventory'}
              </p>
            </div>
          )}
        </div>
        </div>

        {/* Load More Button */}
        {hasMoreMedicines && (
          <div className="text-center mb-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="px-8 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
            >
              Load More Medicines
              <span className="text-lg">↓</span>
            </button>
          </div>
        )}
        {visibleCount >= filteredMedicines.length && filteredMedicines.length > 0 && (
              <button
                onClick={() => setVisibleCount(8)}
                className="px-8 py-3  bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white mb-8 font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
              >
                Show Less
                <span className="text-lg gap-1">↑ </span>

              </button>
          )}

        <div className="
  flex flex-col items-center justify-center text-center gap-4
  hover:border-blue-400 hover:shadow-md 
  transition-all duration-300 group cursor-pointer mb-6"
>
 
  <AddMedicine onMedicineAdded={fetchMedicines} />
          </div>


         

        {/* Modals */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.medicineName}</h2>
                  <p className="text-gray-600">{selectedMedicine.genericName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-700 mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-700">Trade Name:</span> {selectedMedicine.tradeName}</p>
                      <p><span className="font-medium text-gray-700">Rack Code:</span> {selectedMedicine.rackCode}</p>
                      <p><span className="font-medium text-gray-700">Medicine Code:</span> {selectedMedicine.medicineCode}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-amber-700 mb-2">Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-700">Cost Price:</span> ₹{selectedMedicine.unitCostPrice}</p>
                      <p><span className="font-medium text-gray-700">Selling Price:</span> ₹{selectedMedicine.unitSellingPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-700 mb-2">Stock Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium text-gray-700">Total Quantity:</span> {selectedMedicine.totalQuantity}</p>
                      <p><span className="font-medium text-gray-700">Threshold Value:</span> {selectedMedicine.thresholdValue}</p>
                      <p><span className="font-medium text-gray-700">Current Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          (selectedMedicine.totalQuantity || 0) > (selectedMedicine.thresholdValue || 20) 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(selectedMedicine.totalQuantity || 0) > (selectedMedicine.thresholdValue || 20) ? 'In Stock' : 'Low Stock'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedMedicine.usageDescription && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedMedicine.usageDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Medicine Modal */}
        {updatingMedicine && (
          <UpdateMedicine
            medicine={updatingMedicine}
            onClose={() => setUpdatingMedicine(null)}
            onUpdateSuccess={fetchMedicines}
          />
        )}

        {/* Delete Medicine Modal */}
        {deletingMedicine && (
          <DeleteMedicine
            medicine={deletingMedicine}
            onClose={() => setDeletingMedicine(null)}
            onDeleteSuccess={fetchMedicines}
          />
        )}
      </div>
    </div>
  );
}

export default Medicines;