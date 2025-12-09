import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function GenerateReceiptBtn() {
  const { listOfMedicines, setListOfMedicines,backendUrl } = useContext(AppContext);

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerateReceipt = async () => {
    if (!customerName || !customerContactNumber || !listOfMedicines.length) {
      setMessage("Please fill all required fields and add medicines.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const response = await axios.post(
        `${backendUrl}api/sales/addSales`,
        {
          shopCode,
          listOfMedicines: listOfMedicines.map((m) => ({
            medicineCode: m.medicineCode,
            quantity: m.quantity,
          })),
          paymentMode,
          customerName,
          customerContactNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setMessage("Sale added successfully!");
        setListOfMedicines([]); // Clear receipt
        setCustomerName("");
        setCustomerContactNumber("");
      } else {
        setMessage(response.data.message || "Failed to add sale.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full max-w-lg mx-auto mt-4">
      <h3 className="text-xl font-semibold text-center text-blue-700 mb-4">
        Customer & Payment Info
      </h3>

      {/* Payment Mode */}
      <div className="flex gap-6 mb-4 justify-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMode"
            value="Cash"
            checked={paymentMode === "Cash"}
            onChange={(e) => setPaymentMode(e.target.value)}
          />
          Cash
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMode"
            value="UPI"
            checked={paymentMode === "UPI"}
            onChange={(e) => setPaymentMode(e.target.value)}
          />
          UPI
        </label>
      </div>

      {/* Customer Name */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Customer Contact Number */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Customer Contact Number"
          value={customerContactNumber}
          onChange={(e) => setCustomerContactNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Get Receipt Button */}
      <button
        onClick={handleGenerateReceipt}
        disabled={loading || listOfMedicines.length === 0}
        className="w-full px-6 py-3 bg-blue-600 text-black font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Get Receipt"}
      </button>

      {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default GenerateReceiptBtn;
