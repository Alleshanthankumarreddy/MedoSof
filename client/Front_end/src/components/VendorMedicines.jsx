import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import AddVendorMedicine from "./AddVendorMedicine";
import { X } from "lucide-react"; // ❌ delete icon

function VendorMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, vendor, token, backendUrl } = useContext(AppContext);

  const vendorMail = vendor ? user?.mail : null;

  useEffect(() => {
    if (!vendorMail) return;

    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}api/vendor/listOfMedicinesSupplied`,
          {
            params: { mail: vendorMail },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setMedicines(response.data.medicines);
        } else {
          setError("Failed to fetch medicines");
        }
      } catch (err) {
        setError("Server error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [vendorMail]);

  // --------------------------------------
  //   DELETE MEDICINE HANDLER
  // --------------------------------------
  const handleDelete = async (medicineCode) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this medicine from your supply list?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${backendUrl}api/vendor/deleteMedicines`,
        {
          data: { vendorMail, medicineCode },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        // Remove from UI
        setMedicines((prev) =>
          prev.filter((m) => m.medicineCode !== medicineCode)
        );
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error deleting medicine: " + err.message);
    }
  };

  // --------------------------------------

  if (loading) return <p className="text-center py-10">Loading medicines...</p>;
  if (error)
    return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="p-6 pt-24">
      <h1 className="text-2xl font-semibold mb-6">Medicines Supplied</h1>
      <p className="text-xl font-medium mb-6 text-gray-700">Refresh after adding the medicines</p>

      {medicines.length === 0 ? (
        <p className="text-gray-600">No medicines supplied by this vendor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((med) => (
            <div
              key={med._id}
              className="relative bg-white shadow-md rounded-xl p-5 border hover:shadow-xl transition-shadow duration-200"
            >
              {/* ❌ Delete Button */}
              <button
                onClick={() => handleDelete(med.medicineCode)}
                className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full shadow-sm transition"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-gray-800">{med.medicineName}</h3>

              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Code:</span>{" "}
                {med.medicineCode}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddVendorMedicine />
    </div>
  );
}

export default VendorMedicines;
