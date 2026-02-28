import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Search, X, Plus, Minus, Package, Layers, IndianRupee, ArrowUpRight, Filter, RefreshCw } from "lucide-react";

function SalesMedicines() {
  const { addMedicine, removeMedicine, listOfMedicines, setListOfMedicines, backendUrl, role } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!token || !shopCode) return;
      
      const response = await axios.post(
        `${backendUrl}/api/medicine/getAvailableMedicines`,
        { shopCode },
        { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } }
      );

      const medicinesList = response.data.medicines || [];
      setMedicines(medicinesList);
      setFilteredMedicines(medicinesList);
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
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
  }, [sortBy]);

  useEffect(() => {
    if (!searchTerm) setFilteredMedicines(medicines);
  }, [searchTerm, medicines]);

  return (
    <div className="pt-24 w-full min-h-screen bg-white from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 mt-10">
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Available <span className="text-[#0C2C47]">Medicines</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and select medicines for sales transactions
          </p>
        </div>

        {/* Search and Filter Bar */}
        {/* Search and Filter Bar */}
<div className="mb-10">
  <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">

    {/* Search Input */}
    <div className="relative flex-1 min-w-[260px]">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by medicine name, rack code, or generic name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30
                   focus:border-[#0C2C47]"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilteredMedicines(medicines);
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
        className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30
                   appearance-none bg-white w-full"
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

    {/* Refresh */}
    <button
      onClick={fetchMedicines}
      className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100
                 rounded-xl transition-all"
      title="Refresh medicines"
    >
      <RefreshCw className="w-5 h-5" />
    </button>

  </div>
</div>


        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-10 justify-left lg:justify-start">
          <div className="flex items-center gap-4 bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm w-fit">
            <div>
              <p className="text-xs text-gray-500">Total Medicines</p>
              <p className="text-xl font-bold text-gray-900">{medicines.length}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-4 py-4 rounded-xl border border-gray-200 shadow-sm w-fit">
            <div>
              <p className="text-xs text-gray-500">Available Now</p>
              <p className="text-xl font-bold text-gray-900">{filteredMedicines.length}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#0C2C47] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading medicines...</p>
          </div>
        ) : (
          <>
            {/* Medicines Grid */}
            <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => (
                  <div
                    key={med._id}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col justify-between relative overflow-hidden min-h-[260px]"
                  >
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-500"></div>

                    {/* Medicine Info */}
                    <div className="space-y-4 relative z-10">
                      {/* Medicine Name */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                            {med.medicineName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{med.genericName}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
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
                              <div className="text-xs text-gray-500 mb-1">Available Stock</div>
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
                                {med.totalQuantity} units available
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2 relative z-10">
                      <button
                        onClick={() => addMedicine(med)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/add"
                      >
                        <Plus className="w-4 h-4 group-hover/add:scale-110 transition-transform" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeMedicine(med)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/remove"
                      >
                        <Minus className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 lg:grid-cols-4 text-center py-12">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Medicines Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchTerm ? 'Try a different search term' : 'All medicines are currently unavailable'}
                  </p>
                </div>
              )}
            </div>
            </div>
            

          </>
        )}
      </div>
    </div>
  );
}

export default SalesMedicines;