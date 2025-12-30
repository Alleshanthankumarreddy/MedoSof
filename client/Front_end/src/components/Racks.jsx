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
  const [visibleCount, setVisibleCount] = useState(8); // Show 2 rows initially (2x4=8)

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
        `${backendUrl}api/rack/showAllRacks`,
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
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-10 mt-10">
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Rack <span className="text-[#0C2C47]">Management</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Organize and manage your pharmacy racks for efficient medicine storage and retrieval
            </p>
          </div>



            {/* Search and Stats Bar */}
          <div className="mb-10">
            <div className="flex flex-row items-center justify-between gap-6 flex-nowrap">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[300px]">
                <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search racks by code or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C2C47]/30 focus:border-[#0C2C47] transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setVisibleCount(8);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Grid3x3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Racks</p>
                    <p className="text-xl font-bold text-gray-900">{racks.length}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    fetchRacks();
                    setVisibleCount(8);
                  }}
                  className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2"
                  title="Refresh racks"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>


          


          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#0C2C47] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">Loading racks...</p>
            </div>
          ) : (
            <>
              {/* Rack Grid - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               

                {/* Rack Cards */}
              <div className = "flex flex-wrap gap-5">
                  {visibleRacks.length > 0 ? (
                  visibleRacks.map((rack, index) => (
                    <div
                      key={index}
                      className="group w-50 h-10 bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col justify-between relative overflow-hidden min-h-[260px]"
                    >
                      {/* Background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-500"></div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setSelectedRack(rack);
                          setShowDeleteRack(true);
                        }}
                        className="absolute top-3 right-3 z-20 w-7 h-7 bg-red-50 text-red-500 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        title="Delete this rack"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Rack Number Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                      </div>

                      {/* Rack Info */}
                      <div className="space-y-5 relative z-10">
                        {/* Rack Code */}
                        <div className="text-center pt-6">
                          <h2 className="text-m font-bold text-gray-900 mb-2">
                            {rack.rackCode}
                          </h2>
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                            <Layers className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Rack</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-1.5 bg-white rounded-lg">
                              <Building className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Shop Code</p>
                              <p className="text-sm font-medium text-gray-900 truncate">{rack.shopCode}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                            <div className="p-1.5 bg-white rounded-lg">
                              <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-xs text-amber-600">Position</p>
                              <p className="text-sm font-medium text-gray-900">{rack.position}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                      <Layers className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {searchTerm ? 'No Racks Found' : 'No Racks Available'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchTerm ? 'Try a different search term' : 'Add your first rack to start organizing medicines'}
                    </p>
                    <button
                      onClick={() => setShowAddRack(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Rack
                    </button>
                  </div>
                )}
              </div>
                
              </div>

              {/* Load More / Show Less Buttons */}
              {filteredRacks.length > 0 && (
                <div className="flex flex-col items-center gap-4 mb-10">
                  {hasMoreRacks ? (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 8)}
                      className="px-8 py-3 bg-gradient-to-r from-[#0C2C47] to-[#0A243A] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <span>Load More Racks</span>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  ) : visibleCount > 8 && (
                    <button
                      onClick={() => setVisibleCount(8)}
                      className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <span>Show Less</span>
                      <ChevronUp className="w-5 h-5" />
                    </button>
                  )}
                  
                  <p className="text-sm text-gray-500 text-center">
                    Showing {Math.min(visibleCount, filteredRacks.length)} of {filteredRacks.length} racks
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
              )}
               {/* Add Rack Card */}
               <div className="flex justify-center items-center w-full">
                <div
                  onClick={() => setShowAddRack(true)}
                 className="group border justify-center border-black-200 w-60 h-70 rounded-2xl p-6
           flex flex-col items-center text-center
           hover:border-blue-400 hover:shadow-xl
           transition-all duration-300 cursor-pointer min-h-[260px]
                mb-8 justify-center"
                >
                  <div className="relative mb-8">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-7 h-7 text-blue-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      +
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    Add New Rack
                  </h3>
                  <p className="text-gray-600 text-xs max-w-xs mb-4">
                    Create a new storage rack for organizing medicines
                  </p>
                  
                  {/* Quick stats */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
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
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Rack Inventory Summary</h3>
                      <p className="text-gray-600 text-sm">
                        {racks.length} total racks • {visibleRacks.length} currently visible
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
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

          {/* Add Rack Modal */}
          {showAddRack && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowAddRack(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <AddRack
                  onSuccess={() => {
                    setShowAddRack(false);
                    fetchRacks();
                    setVisibleCount(8);
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
                setVisibleCount(8);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RackList;