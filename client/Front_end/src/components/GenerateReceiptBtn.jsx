import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Receipt, CreditCard, Wallet, Printer, Download, CheckCircle, AlertCircle } from "lucide-react";

function GenerateReceiptBtn() {
  const { listOfMedicines, setListOfMedicines, backendUrl, role } = useContext(AppContext);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleGenerateReceipt = async () => {
    if (!customerName || !customerContactNumber || listOfMedicines.length === 0) {
      setMessage("Please fill all required fields and add medicines."); return;
    }
    setLoading(true); setMessage("");
    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      const response = await axios.post(`${backendUrl}/api/sales/addSales`, {
        shopCode, listOfMedicines: listOfMedicines.map((m) => ({ medicineCode: m.medicineCode, quantity: m.quantity })),
        paymentMode, customerName, customerContactNumber,
      }, { headers: { Authorization: `Bearer ${token}`, "x-user-role": role } });
      if (response.data.success) {
        setMessage("✅ Sale recorded successfully!"); setShowReceiptModal(true);
        setTimeout(() => { setCustomerName(""); setCustomerContactNumber(""); }, 1500);
      } else setMessage(response.data.message || "Failed to add sale.");
    } catch (error) { setMessage(error.response?.data?.message || "Server error."); }
    finally { setLoading(false); }
  };

  const handleClearCart = () => { setListOfMedicines([]); localStorage.removeItem("listOfMedicines"); setMessage(""); setShowReceiptModal(false); };

  return (
    <>
      <div className="w-full flex justify-center mb-3 px-3 sm:px-0">
        <div className="bg-white mt-2 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md border border-gray-200">

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Complete Purchase</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Enter customer details to generate receipt</p>
          </div>

          {/* Payment Mode */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
            <div className="grid grid-cols-3 gap-2">
              {[{ value: "Cash", label: "Cash", icon: Wallet }, { value: "UPI", label: "UPI", icon: CreditCard }, { value: "Card", label: "Card", icon: CreditCard }].map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setPaymentMode(value)}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all ${paymentMode === value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm sm:text-base" />
            <input type="tel" placeholder="Contact Number" value={customerContactNumber} onChange={(e) => setCustomerContactNumber(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-sm sm:text-base" />
          </div>

          {/* Button */}
          <button onClick={handleGenerateReceipt} disabled={loading || listOfMedicines.length === 0}
            className="w-full mt-5 sm:mt-6 py-2.5 sm:py-3 bg-[#0C2C47] text-white font-semibold rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base">
            {loading ? "Processing..." : "Generate Receipt"}
          </button>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${message.includes("✅") ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              {message.includes("✅") ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <p className="text-xs sm:text-sm font-medium text-gray-700">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-xs sm:max-w-md shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Receipt Generated</h2>
              <p className="text-sm text-gray-500 mt-1">Sale recorded successfully</p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button onClick={() => window.print()} className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-blue-600 transition-all">
                <Printer className="w-4 h-4" />Print
              </button>
              <button onClick={handleClearCart} className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-gray-900 transition-all">
                <Download className="w-4 h-4" />Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GenerateReceiptBtn;