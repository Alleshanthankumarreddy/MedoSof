import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddRack from "./AddRack";
import DeleteRack from "./DeleteRack";
import { AppContext } from "../AppContext";
import { 
  Plus, 
  X, 
  Layers, 
  MapPin, 
  Building, 
  RefreshCw, 
  AlertCircle,
  Trash2,
  Grid3x3,
  Package,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function RackList() {
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddRack, setShowAddRack] = useState(false);
  const [showDeleteRack, setShowDeleteRack] = useState(false);
  const [selectedRack, setSelectedRack] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // Reduced for mobile

  const { backendUrl, role } = useContext(AppContext);

  const fetchRacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!token || !shopCode) {
        setMessage("Missing authentication or shop information");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/rack/showAllRacks`,
        { shopCode },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "x-user-role": role
          }
        }
      );
      
      if (response.data.success) {
        setRacks(response.data.racks || []);
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message || "Failed to fetch racks");
      }
    } catch (error) {
      console.error("Error fetching racks:", error);
      setMessage(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRacks();
  }, []);

  const filteredRacks = racks.filter(rack =>
    rack.rackCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleRacks = filteredRacks.slice(0, visibleCount);
  const hasMoreRacks = visibleCount < filteredRacks.length;

  return (
    <>
      <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Header - Responsive */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Rack <span className="text-[#0C2C47]">Management</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-2">
              Organize and manage your pharmacy racks for efficient medicine storage
            </p>
          </div>

          {/* Search and Controls - Responsive Stack */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
              
              {/* Search Input - Full width on mobile */}
              <div className="relative flex-1 w-full lg:min-w-[300px]">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search racks by code or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setVisibleCount(6);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Stats and Refresh - Stacked on mobile */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto">
                <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 shadow-sm flex-1 lg:flex-none">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                    <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Total Racks</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{racks.length}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    fetchRacks();
                    setVisibleCount(6);
                  }}
                  className="p-2.5 sm:p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
                  title="Refresh racks"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#0C2C47]/20 border-t-[#0C2C47] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-base sm:text-lg text-center">Loading racks...</p>
            </div>
          ) : (
            <>
              {/* Rack Grid - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                
                {/* Rack Cards */}
                {visibleRacks.length > 0 ? (
                  visibleRacks.map((rack, index) => (
                    <div
                      key={rack.rackCode || index}
                      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden min-h-[240px] sm:min-h-[260px]"
                    >
                      {/* Background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-500 pointer-events-none"></div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setSelectedRack(rack);
                          setShowDeleteRack(true);
                        }}
                        className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-7 sm:h-7 bg-red-50 text-red-500 hover:bg-red-100 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110"
                        title="Delete this rack"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Rack Number Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="w-8 h-8 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                      </div>

                      {/* Rack Info */}
                      <div className="space-y-4 sm:space-y-5 relative z-10 flex-1 flex flex-col justify-between">
                        {/* Rack Code */}
                        <div className="text-center pt-12 sm:pt-14">
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate px-1">
                            {rack.rackCode}
                          </h2>
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full mx-auto">
                            <Layers className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Rack</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="p-1.5 bg-white rounded-lg flex-shrink-0">
                              <Building className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500">Shop Code</p>
                              <p className="text-sm font-medium text-gray-900 truncate">{rack.shopCode}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-amber-50 rounded-lg">
                            <div className="p-1.5 bg-white rounded-lg flex-shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-amber-600">Position</p>
                              <p className="text-sm font-medium text-gray-900 truncate">{rack.position}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 px-4 sm:py-20">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-6 mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                      {searchTerm ? 'No Racks Found' : 'No Racks Available'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-8">
                      {searchTerm ? 'Try a different search term' : 'Add your first rack to start organizing medicines'}
                    </p>
                    <button
                      onClick={() => setShowAddRack(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Add Your First Rack</span>
                      <span className="sm:hidden">Add Rack</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Load More / Show Less Buttons */}
              {filteredRacks.length > 0 && (
                <div className="flex flex-col items-center gap-4 mb-10 px-4">
                  {hasMoreRacks ? (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-8 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <span>Load More Racks</span>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  ) : visibleCount > 6 && (
                    <button
                      onClick={() => setVisibleCount(6)}
                      className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <span>Show Less</span>
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  )}
                  
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    Showing {Math.min(visibleCount, filteredRacks.length)} of {filteredRacks.length} racks
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
              )}

              {/* Add Rack Card - Fixed Position */}
              <div className="flex justify-center items-center w-full mb-8 px-4">
                <div
                  onClick={() => setShowAddRack(true)}
                  className="group border-2 border-dashed border-gray-300 hover:border-blue-400 w-full sm:w-80 h-64 sm:h-72 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-blue-50/50"
                >
                  <div className="relative mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      +
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors px-2">
                    Add New Rack
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base max-w-xs mb-4 px-2">
                    Create a new storage rack for organizing medicines
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Easy Setup</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>Organized</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {filteredRacks.length > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Rack Inventory Summary</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {racks.length} total racks • {visibleRacks.length} currently visible
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{filteredRacks.length} Active Racks</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>{filteredRacks.length} Positions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add Rack Modal - Responsive */}
          {showAddRack && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowAddRack(false)}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <AddRack
                  onSuccess={() => {
                    setShowAddRack(false);
                    fetchRacks();
                    setVisibleCount(6);
                  }}
                />
              </div>
            </div>
          )}

          {/* Delete Rack Modal */}
          {showDeleteRack && selectedRack && (
            <DeleteRack
              rack={selectedRack}
              onClose={() => setShowDeleteRack(false)}
              onSuccess={() => {
                setShowDeleteRack(false);
                fetchRacks();
                setVisibleCount(6);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RackList;
