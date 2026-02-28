// GenerateReceiptBtn.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import {
  Receipt,
  User,
  Phone,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  Printer,
  Download
} from "lucide-react";

function GenerateReceiptBtn() {
  const {
    listOfMedicines,
    setListOfMedicines,
    backendUrl,
    role
  } = useContext(AppContext);

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);


  const handleGenerateReceipt = async () => {
    // ✅ FIX: length instead of size
    if (
      !customerName ||
      !customerContactNumber ||
      listOfMedicines.length === 0
    ) {
      setMessage("Please fill all required fields and add medicines.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      const response = await axios.post(
        `${backendUrl}/api/sales/addSales`,
        {
          shopCode,
          listOfMedicines: listOfMedicines.map((m) => ({
            medicineCode: m.medicineCode,
            quantity: m.quantity
          })),
          paymentMode,
          customerName,
          customerContactNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-role": role
          }
        }
      );

      if (response.data.success) {
        setMessage("✅ Sale recorded successfully!");
        setShowReceiptModal(true);

        setTimeout(() => {
          setCustomerName("");
          setCustomerContactNumber("");
        }, 1500);
      } else {
        setMessage(response.data.message || "Failed to add sale.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // ✅ FIX: clear state + localStorage
  const handleClearCart = () => {
    setListOfMedicines([]);
    localStorage.removeItem("listOfMedicines");
    setMessage("");
    setShowReceiptModal(false);
  };

  return (
    <>
      <div className="w-full bg-white flex justify-center mb-3">
        <div className="bg-white mt-2 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Purchase
            </h2>
            <p className="text-gray-500 text-sm">
              Enter customer details to generate receipt
            </p>
          </div>

          {/* Payment Mode */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "Cash", label: "Cash", icon: Wallet },
                { value: "UPI", label: "UPI", icon: CreditCard },
                { value: "Card", label: "Card", icon: CreditCard }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMode(value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMode === value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="tel"
              placeholder="Contact Number"
              value={customerContactNumber}
              onChange={(e) => setCustomerContactNumber(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* Summary */}
          

          {/* Button */}
          <button
            onClick={handleGenerateReceipt}
            disabled={loading || listOfMedicines.length === 0}
            className="w-full mt-6 py-3 bg-[#0C2C47] text-white rounded-xl"
          >
            {loading ? "Processing..." : "Generate Receipt"}
          </button>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm">{message}</p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Receipt Generated</h2>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 bg-gray-800 text-white py-2 rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GenerateReceiptBtn;
