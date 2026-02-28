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
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading medicines...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              VENDOR PORTAL
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Manage <span className="text-[#0C2C47]">Supplies</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage the medicines you supply to pharmacies
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="mb-8">
          <div className="flex flex-row items-center gap-4 flex-nowrap">
            
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-blue-500/30
                          focus:border-blue-500 transition-all"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                            text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshMedicines}
              className="flex items-center gap-2 px-6 py-3
                        bg-gradient-to-r from-gray-600 to-gray-700 text-white
                        font-semibold rounded-xl hover:shadow-lg
                        hover:shadow-gray-600/25 transition-all duration-300
                        whitespace-nowrap shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            {/* Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3
                        bg-gradient-to-r from-blue-500 to-blue-600 text-white
                        font-semibold rounded-xl hover:shadow-lg
                        hover:shadow-blue-500/25 transition-all duration-300
                        whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>

          {searchTerm && (
            <p className="mt-3 text-center text-sm text-gray-500">
              Showing {filteredMedicines.length} of {medicines.length} medicines
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              In your supply catalog
            </div>
          </div>
        </div>




        {/* Content Area */}
        {error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={fetchMedicines}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
              {searchTerm ? (
                <Filter className="w-10 h-10 text-gray-400" />
              ) : (
                <Package className="w-10 h-10 text-blue-600" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No Matching Medicines' : 'No Medicines Yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm 
                ? 'Try a different search term' 
                : 'Start by adding medicines to your supply list'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Medicine
            </button>
          </div>
        ) : (
          <>
            {/* Medicines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {filteredMedicines.map((med) => (
                <div
                  key={med._id}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteModal(med)}
                    className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Medicine Info */}
                  <div className="space-y-5">
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

                    {/* Additional Info (if available) */}
                    <div className="space-y-3">
                      {med.category && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {med.category}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Supply Status</div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-600">Active Supply</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setShowDeleteModal(med)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 flex items-center justify-center gap-2 border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                    <button className="px-3 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Supply Catalog Summary</h3>
                    <p className="text-gray-600 text-sm">
                      You are currently supplying {medicines.length} medicine{medicines.length !== 1 ? 's' : ''}. 
                      {searchTerm && ` ${filteredMedicines.length} match your search.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Active Supplier</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Inventory Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={() => setShowDeleteModal(null)}
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
                  Remove Medicine
                </h2>
                <p className="text-gray-600">
                  Are you sure you want to remove this medicine?
                </p>
              </div>

              {/* Medicine Details */}
              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{showDeleteModal.medicineName}</h3>
                    <p className="text-sm text-gray-500">Code: {showDeleteModal.medicineCode}</p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="p-4 bg-red-50 rounded-xl mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 mb-1">Warning</p>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. Pharmacies will no longer be able to order this medicine from you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal.medicineCode)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Remove Medicine
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Medicine Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Add Medicine
                </h2>
                <p className="text-gray-600">
                  Add a new medicine to your supply catalog
                </p>
              </div>

              {/* AddVendorMedicine Component */}
              <AddVendorMedicine onSuccess={() => {
                setShowAddModal(false);
                refreshMedicines();
              }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Manage your supply catalog to connect with pharmacies effectively
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorMedicines;