import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function AddRack({ onSuccess }) {
  const [rackCode, setRackCode] = useState("");
  const [shopCode] = useState(localStorage.getItem("shopCode") || "");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {backendUrl} = useContext(AppContext);

  const handleAddRack = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!rackCode || !shopCode || !position) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${backendUrl}api/rack/addRack`,
        { rackCode, shopCode, position },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage("✅ Rack added successfully!");
        setRackCode("");
        setPosition("");

        // ✅ Call parent to refresh racks & close modal
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 800);
      } else {
        setMessage(response.data.message || "Failed to add rack");
      }
    } catch (error) {
      console.error("Error adding rack:", error);
      setMessage(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Add New Rack
      </h2>

      <form onSubmit={handleAddRack} className="space-y-5">
        {/* Rack Code */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Rack Code
          </label>
          <input
            type="text"
            value={rackCode}
            onChange={(e) => setRackCode(e.target.value)}
            placeholder="Enter Rack Code"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Shop Code */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Shop Code
          </label>
          <input
            type="text"
            value={shopCode}
            readOnly
            className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Position
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter Rack Position"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding Rack..." : "Add Rack"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default AddRack;
