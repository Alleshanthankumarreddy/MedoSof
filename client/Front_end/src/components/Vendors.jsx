import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Package, 
  Hash, 
  Users, 
  Search, 
  Filter,
  Globe,
  Briefcase,
  Star,
  ChevronRight,
  Award,
  Shield,
  Truck,
  CheckCircle,
  X
} from "lucide-react";
import { AppContext } from "../AppContext";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    medicinesCount: 0
  });

  const { backendUrl, role } = useContext(AppContext);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${backendUrl}/api/vendor/showAllVendors`, {
        headers: { Authorization: `Bearer ${token}`, "x-user-role": role },
      });

      if (res.data.success) {
        const vendorsData = res.data.vendors || [];
        setVendors(vendorsData);
        setFilteredVendors(vendorsData);
        
        // Calculate statistics
        const totalVendors = vendorsData.length;
        const activeVendors = vendorsData.filter(v => v.status === 'active' || !v.status).length;
        const totalMedicines = vendorsData.reduce((sum, vendor) => 
          sum + (vendor.medicines?.length || 0), 0);
        
        setStats({
          total: totalVendors,
          active: activeVendors,
          medicinesCount: totalMedicines
        });
        
        setMessage("");
      } else {
        setMessage(res.data.message || "No vendors found.");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setMessage("Failed to load vendors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor => {
      const name = vendor.name?.toLowerCase() || '';
      const email = vendor.mail?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return name.includes(searchLower) || 
             email.includes(searchLower) || 
             phone.includes(searchLower) ||
             vendor.medicines?.some(med => 
               med.tradeName?.toLowerCase().includes(searchLower) ||
               med.medicineCode?.toLowerCase().includes(searchLower)
             );
    });
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleCloseModal = () => {
    setSelectedVendor(null);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading vendors...</p>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              SUPPLIER NETWORK
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#0C2C47]">Vendors</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Partnered suppliers and pharmaceutical distributors
          </p>
        </div>
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vendors by name, email, phone, or medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
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
          {searchTerm && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </p>
          )}
        </div>


        {/* Stats Cards */}
        <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Partnered suppliers
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Partners</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Currently supplying
            </div>
          </div>
          
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900">{stats.medicinesCount}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Across all vendors
            </div>
          </div>
        </div>


        {/* Vendors Grid */}
        <div  className="flex sm:flex-row gap-6 mb-10">

          {message ? (
            <div className="text-center py-20">
              <div className="inline-flex p-4 bg-yellow-50 rounded-full mb-4">
                <Filter className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vendors Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">{message}</p>
            </div>
          ) : (
            <>
              <div className="flex gap-8 bg-white p-6 rounded-2xl">
                {filteredVendors.map((vendor, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Vendor Header */}
                    <div className="p-6">
                      {/* Avatar Section */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Truck className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-gray-900 truncate">
                            {vendor.name || "Unnamed Vendor"}
                          </h2>
                          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {vendor.mail || "No email"}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700">
                            {vendor.contactNumber || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Medicines Count */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Medicines Supplied
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {vendor.medicines?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medicines Preview */}
                    <div className="px-6 pb-4">
                      <div className="mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Recent Supplies
                        </h3>
                        {vendor.medicines && vendor.medicines.length > 0 ? (
                          <div className="space-y-2">
                            {vendor.medicines.slice(0, 2).map((med, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <Package className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-700 truncate">{med.tradeName}</span>
                              </div>
                            ))}
                            {vendor.medicines.length > 2 && (
                              <p className="text-xs text-gray-500 text-center">
                                +{vendor.medicines.length - 2} more medicines
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No medicines listed</p>
                        )}
                      </div>
                    </div>
                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => handleViewDetails(vendor)}
                      className="w-full py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-gray-200"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        </div>


        {/* Vendor Details Modal */}
        {selectedVendor && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedVendor.name || "Unnamed Vendor"}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{selectedVendor.mail || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{selectedVendor.contactNumber || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicines List */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Medicines Supplied
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedVendor.medicines?.length || 0} products
                    </p>
                  </div>
                </div>

                {selectedVendor.medicines && selectedVendor.medicines.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedVendor.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{med.tradeName}</h4>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            #{med.medicineCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Code: {med.medicineCode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No medicines listed for this vendor</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Here you could implement contact functionality
                    window.location.href = `mailto:${selectedVendor.mail}`;
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Contact Vendor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Vendors;