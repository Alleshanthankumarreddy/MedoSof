import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react"; // ✅ import user icon
import { AppContext } from "../AppContext";


function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const {backendUrl} = useContext(AppContext);


    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${backendUrl}api/vendor/showAllVendors`, {
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
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-6xl px-6">
  {vendors.map((vendor, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 hover:border-blue-400 hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center"
    >
      {/* User Icon */}
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
      <p className="text-gray-700 mb-2">
        <span className="font-semibold text-gray-800">Phone:</span>{" "}
        {vendor.contactNumber || "N/A"}
      </p>

      <div className="mt-4 text-left">
        <h3 className="font-semibold text-blue-600 mb-2">Medicines Supplied:</h3>
        {vendor.medicines && vendor.medicines.length > 0 ? (
          <ul className="list-disc ml-5 text-black-700">
            {vendor.medicines.map((med, idx) => (
              <li key={idx}>
                {med.tradeName} ,{med.medicineCode}
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-500">No medicines listed.</p>
        )}
      </div>
    </div>
  ))}
</div>
    </>
  );
}

export default Vendors;
