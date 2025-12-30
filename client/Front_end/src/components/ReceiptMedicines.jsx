import React, { useContext, useMemo } from "react";
import { AppContext } from "../AppContext";
import {
  Receipt,
  Package,
  IndianRupee,
  Calculator
} from "lucide-react";

function ReceiptMedicines() {
  const { listOfMedicines,updateMedicineQuantity,removeFromReceipt} = useContext(AppContext);

  // ✅ Total Quantity (sum of all counts)
  const totalQuantity = useMemo(() => {
    if (listOfMedicines.length === 0) return 0;

    return listOfMedicines.reduce((qty, medicine) => {
      return qty + (medicine.quantity || 0);
    }, 0);
  }, [listOfMedicines]);

  // ✅ Total Amount
  const totalAmount = useMemo(() => {
    if (listOfMedicines.length === 0) return 0;

    return listOfMedicines.reduce((total, medicine) => {
      return total + 
        (medicine.unitSellingPrice || 0) * (medicine.quantity || 0);
    }, 0);
  }, [listOfMedicines]);

  return (
    <div className="pt-10 min-h-[50vh] bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Receipt className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              SALES RECEIPT
            </span>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Cart <span className="text-[#0C2C47]">Summary</span>
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Review and manage medicines for your sales transaction
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          {/* Total Items */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {listOfMedicines.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          {/* Total Items */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Medicines</p>
            </div>
          </div>

          {/* Medicine List */}
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {listOfMedicines.length === 0 ? (
              <p className="text-sm text-gray-500">No medicines added</p>
            ) : (
              listOfMedicines.map((medicine) => (
                <li
                  key={medicine._id}
                  className="flex text-sm text-gray-700"
                >
                  <p className="font-bold">{medicine.medicineName}</p>
                  <span className="font-medium">× {medicine.quantity}</span>
                </li>
              ))
            )}
          </ul>
        </div>


          {/* Total Quantity */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalQuantity}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <IndianRupee className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ReceiptMedicines;
