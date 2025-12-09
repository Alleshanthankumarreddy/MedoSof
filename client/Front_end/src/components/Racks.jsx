import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddRack from "./AddRack";
import DeleteRack from "./DeleteRack";
import { AppContext } from "../AppContext";

function RackList() {
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddRack, setShowAddRack] = useState(false);
  const [showDeleteRack, setShowDeleteRack] = useState(false);
  const [selectedRack, setSelectedRack] = useState(null);

  const {backendUrl} = useContext(AppContext);

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
      

      // ✅ Since GET requests can’t have a body, send shopCode as a query param
      const response = await axios.post(
        `${backendUrl}api/rack/showAllRacks`,
        {shopCode},
        {
            headers: { Authorization: `Bearer ${token}` },
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

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
  {/* Page Title */}
  <h1 className="text-3xl font-bold text-gray-800 mb-8">Shop Rack List</h1>

  {/* Loading / Message */}
  {loading ? (
    <p className="text-gray-600 text-lg">Loading racks...</p>
  ) : message && racks.length === 0 ? (
    <p className="text-gray-600 italic">{message}</p>
  ) : null}

  {/* Rack Cards Grid */}
  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-6xl px-6">
    {racks.map((rack, index) => (
      <div
        key={index}
        className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-300 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1 p-6"
      >
        {/* ❌ Delete Button */}
        <button
          onClick={() => {
            setSelectedRack(rack); 
            setShowDeleteRack(true)}}
          
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold transition"
          title="Delete this rack"
        >
          ✖
        </button>

        {/* Rack Info */}
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {rack.rackCode}
        </h2>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold text-gray-800">Shop Code:</span>{" "}
          {rack.shopCode}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold text-gray-800">Position:</span>{" "}
          {rack.position}
        </p>
      </div>
    ))}

    {/* ➕ Add Rack Card */}
    <div
      onClick={() => setShowAddRack(true)}
      className="bg-white border-2 border-dashed border-gray-400 rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition"
    >
      <span className="text-5xl text-gray-400 font-bold">+</span>
    </div>
  </div>
</div>


      {/* ✅ AddRack component as modal */}
      {showAddRack && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-gray-200">
          {/* Close Button */}
          <button
            onClick={() => setShowAddRack(false)}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          >
            ✖
          </button>

          {/* Render AddRack Component */}
          <AddRack
            onSuccess={() => {
              setShowAddRack(false);
              fetchRacks();
            }}
          />
        </div>
      </div>
    )}
    {showDeleteRack && (
    <DeleteRack
      rack={selectedRack}
      onClose={() => setShowDeleteRack(false)}
      onSuccess={() => {
        setShowDeleteRack(false);
        fetchRacks(); // Refresh racks after successful delete
      }}
    />
  )}

    </>
  );
}

export default RackList;
