import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react"; // ✅ import user icon
import AddVendor from "./AddVendor";


function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showAddVendor,setShowAddVendor] = useState(false)


    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:4000/api/vendor/showAllVendors", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setVendors(res.data.vendors);
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

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Vendor List</h1>

      {/* Loading / Message */}
      {loading ? (
        <p className="text-gray-600 text-lg">Loading vendors...</p>
      ) : message && vendors.length === 0 ? (
        <p className="text-gray-600 italic">{message}</p>
      ) : null}

      {/* Vendor Cards */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-6xl px-6">
        {vendors.map((vendor, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center"
          >
            {/* 👤 User Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                <User size={36} />
              </div>
            </div>

            {/* Vendor Details */}
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {vendor.name || "Unnamed Vendor"}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              {vendor.mail || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-800">Phone:</span>{" "}
              {vendor.contactNumber || "N/A"}
            </p>
          </div>
        ))}
        <div
            onClick={() => setShowAddVendor(true)}
            className="bg-white border-2 border-dashed border-gray-400 rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition"
          >
            <span className="text-5xl text-gray-400 font-bold">+</span>
          </div>
      </div>
    </div>
     {showAddVendor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-gray-200">
            {/* Close Button */}
            <button
              onClick={() => setShowAddVendor(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
              ✖
            </button>

            {/* Render AddVendor component */}
            <AddVendor
              onSuccess={() => {
                setShowAddVendor(false);
                fetchVendors();
              }}
            />
          </div>
        </div>
      )}

    </>
  );
}

export default Vendors;
