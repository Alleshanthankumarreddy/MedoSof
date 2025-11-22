import React, { useContext } from "react";
import { AppContext } from "../AppContext";

function ReceiptMedicines() {
  const {
    listOfMedicines,
    updateMedicineQuantity,
    removeFromReceipt,
  } = useContext(AppContext);

  const handleChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      updateMedicineQuantity(id, qty);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-20 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-4 w-full shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Receipt Medicines
        </h2>

        {listOfMedicines.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No medicines added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {listOfMedicines.map((med) => (
              <div
                key={med._id}
                className="flex flex-wrap items-center justify-between bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-3"
              >
                {/* Medicine Name */}
                <div className="flex-1 min-w-[150px]">
                  <span className="text-lg font-semibold text-gray-800">
                    {med.medicineName}
                  </span>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center gap-2 min-w-[120px] mt-2 sm:mt-0">
                  <p className="text-sm text-gray-500">Quantity:</p>
                  <input
                    type="number"
                    value={med.quantity}
                    min={1}
                    className="w-16 border rounded px-2 py-1 text-center"
                    onChange={(e) => handleChange(med._id, e.target.value)}
                  />
                </div>

                {/* Unit Cost */}
                <div className="text-center min-w-[100px] mt-2 sm:mt-0">
                  <p className="text-sm text-gray-500">Unit Cost</p>
                  <p className="text-base font-medium text-gray-800">
                    ₹{med.unitSellingPrice?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="text-center min-w-[100px] mt-2 sm:mt-0">
                  <p className="text-sm text-gray-500">Total Cost </p>
                  <p className="text-base font-medium text-gray-800">
                    ₹{med.quantity * med.unitSellingPrice}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromReceipt(med._id)}
                  className="ml-2 mt-2 sm:mt-0 px-2 py-1 bg-red-500 text-red rounded hover:bg-red-600 transition"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptMedicines;
