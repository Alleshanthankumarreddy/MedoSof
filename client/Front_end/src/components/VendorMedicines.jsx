import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import AddVendorMedicine from "./AddVendorMedicine";
import { 
  X, 
  Package, 
  Plus, 
  RefreshCw, 
  AlertTriangle, 
  Hash, 
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
  Trash2,
  Shield,
  BarChart3,
  ExternalLink
} from "lucide-react";

function VendorMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lastUpdated: ""
  });

  const { user, vendor, token, backendUrl, role } = useContext(AppContext);
  const vendorMail = vendor ? user?.mail : null;

  useEffect(() => {
    if (!vendorMail) return;
    fetchMedicines();
  }, [vendorMail]);

  useEffect(() => {
    const filtered = medicines.filter(med => {
      const name = med.medicineName?.toLowerCase() || '';
      const code = med.medicineCode?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return name.includes(searchLower) || code.includes(searchLower);
    });
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/vendor/listOfMedicinesSupplied`,
        {
          params: { mail: vendorMail },
          headers: { Authorization: `Bearer ${token}`, "x-user-role": role }
        }
      );

      if (response.data.success) {
        const medicinesData = response.data.medicines || [];
        setMedicines(medicinesData);
        setFilteredMedicines(medicinesData);
        
        setStats({
          total: medicinesData.length,
          active: medicinesData.length,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } else {
        setError("Failed to fetch medicines");
      }
    } catch (err) {
      setError("Unable to load medicines. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (medicineCode) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/vendor/deleteMedicines`,
        {
          data: { vendorMail, medicineCode },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-role": role
          },
        }
      );

      if (res.data.success) {
        setMedicines((prev) =>
          prev.filter((m) => m.medicineCode !== medicineCode)
        );
        setShowDeleteModal(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error deleting medicine: " + err.message);
    }
  };

  const refreshMedicines = () => {
    fetchMedicines();
  };

  if (loading) {
    return (
      <div className="pt-12 sm:pt-16 lg:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64 sm:h-96">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm sm:text-lg text-gray-600 text-center px-4">Loading medicines...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 sm:pt-16 lg:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-3 sm:mb-4 mx-auto w-fit">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-600">
              VENDOR PORTAL
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            Manage <span className="text-[#0C2C47]">Supplies</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            View and manage the medicines you supply to pharmacies
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 lg:gap-4">
            
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search medicines by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={refreshMedicines}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-gray-600/25 transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add Medicine
              </button>
            </div>
          </div>

          {searchTerm && (
            <p className="mt-3 text-center text-xs sm:text-sm text-gray-500 px-2">
              Showing {filteredMedicines.length} of {medicines.length} medicines
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Medicines</p>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 sm:p-3 lg:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
              In your supply catalog
            </div>
          </div>
        </div>

        {/* Content Area */}
        {error ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-200 mx-2 sm:mx-0">
            <div className="inline-flex p-3 sm:p-4 bg-red-100 rounded-full mb-4 sm:mb-6 mx-auto">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 px-4">Error Loading Data</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 px-4">{error}</p>
            <button
              onClick={fetchMedicines}
              className="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-200 mx-2 sm:mx-0">
            <div className="inline-flex p-3 sm:p-4 bg-blue-100 rounded-full mb-4 sm:mb-6 mx-auto">
              {searchTerm ? (
                <Filter className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              ) : (
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No Matching Medicines' : 'No Medicines Yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 px-4">
              {searchTerm 
                ? 'Try a different search term' 
                : 'Start by adding medicines to your supply list'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Your First Medicine
            </button>
          </div>
        ) : (
          <>
            {/* Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              {filteredMedicines.map((med) => (
                <div
                  key={med._id}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[220px] sm:min-h-0"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteModal(med)}
                    className="absolute top-3 right-3 p-1.5 sm:p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Medicine Info */}
                  <div className="space-y-3 sm:space-y-4 sm:space-y-5">
                    {/* Medicine Name */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg leading-tight line-clamp-2">
                          {med.medicineName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {med.medicineCode}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 sm:space-y-3">
                      {med.category && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {med.category}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Supply Status</div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm font-medium text-green-600">Active Supply</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-6 flex gap-2 pt-1">
                    <button
                      onClick={() => setShowDeleteModal(med)}
                      className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium rounded-lg sm:rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Remove
                    </button>
                    <button className="p-2 sm:px-3 sm:py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium rounded-lg sm:rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 flex-shrink-0">
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-blue-100">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  <div className="p-2 sm:p-3 lg:p-4 bg-blue-100 rounded-lg sm:rounded-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">Supply Catalog Summary</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      You are currently supplying {medicines.length} medicine{medicines.length !== 1 ? 's' : ''}. 
                      {searchTerm && ` ${filteredMedicines.length} match your search.`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-center lg:justify-end">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Active Supplier</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
                    <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Inventory Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto relative p-4 sm:p-6 lg:p-8">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  Remove Medicine
                </h2>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Are you sure you want to remove this medicine?
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate pr-2">{showDeleteModal.medicineName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Code: {showDeleteModal.medicineCode}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-red-50 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700 mb-1 text-sm sm:text-base">Warning</p>
                    <p className="text-sm text-red-600 leading-relaxed">
                      This action cannot be undone. Pharmacies will no longer be able to order this medicine from you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal.medicineCode)}
                  className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-sm sm:text-base"
                >
                  Remove Medicine
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Medicine Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto relative p-4 sm:p-6 lg:p-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="text-center mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  Add Medicine
                </h2>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                  Add a new medicine to your supply catalog
                </p>
              </div>

              <AddVendorMedicine onSuccess={() => {
                setShowAddModal(false);
                refreshMedicines();
              }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center text-gray-500 text-xs sm:text-sm px-2">
          <p className="flex items-center justify-center gap-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            Manage your supply catalog to connect with pharmacies effectively
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorMedicines;
