import React, { useState } from "react";
import axios from "axios";

function AddVendor({ onSuccess }) {
  const [vendorData, setVendorData] = useState({
    name: "",
    mail: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/api/vendor/addVendor",
        vendorData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("Vendor added successfully!");
        setVendorData({ name: "", mail: "", contactNumber: "" });
        onSuccess();
      } else {
        setMessage(res.data.message || "Failed to add vendor");
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      setMessage("Server error while adding vendor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Vendor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={vendorData.name}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          required
        />
        <input
          type="email"
          name="mail"
          value={vendorData.mail}
          onChange={handleChange}
          placeholder="Vendor Email"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
        />
        <input
          type="text"
          name="contactNumber"
          value={vendorData.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-black font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Adding..." : "Add Vendor"}
        </button>

        {message && (
          <p className="text-sm text-gray-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}

export default AddVendor;
