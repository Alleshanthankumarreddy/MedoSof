import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddMedicine from "./AddMedicine";
import UpdateMedicine from "./UpdateMedicine";
import DeleteMedicine from "./DeleteMedicine"; 
import { AppContext } from "../AppContext";


function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // for modal
  const [updatingMedicine, setUpdatingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  const {backendUrl} = useContext(AppContext);


  // Fetch medicines
  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");

      if (!token || !shopCode) return;

      const response = await axios.post(
        `${backendUrl}api/medicine/getAllMedicines`,
        { shopCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMedicines(response.data.medicines || []);
      setFilteredMedicines(response.data.medicines || []);
    } catch (error) {
      console.error("Error fetching medicines:", error.response?.data || error);
    }
  };
   
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Search handler
  const handleSearch = () => {
    const query = searchTerm.trim().toLowerCase();
    const results = medicines.filter((medicine) => {
      const name = medicine.medicineName?.toLowerCase() || "";
      const rack = medicine.rackCode?.toLowerCase() || "";
      return name.includes(query) || rack.includes(query);
    });
    setFilteredMedicines(results);
  };

  // Reset filtered list if search is empty
  useEffect(() => {
    if (!searchTerm) setFilteredMedicines(medicines);
  }, [searchTerm, medicines]);

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Medicines Inventory
      </h1>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10 flex gap-2">
        <input
          type="text"
          placeholder="Search by name or rack code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        {searchTerm && (
          <button
            onClick={() => { setSearchTerm(""); setFilteredMedicines(medicines); }}
            className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Medicine Cards */}
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {filteredMedicines.length > 0 ? (
        filteredMedicines.map((med, index) => (
        <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 p-6 border border-gray-200 flex flex-col justify-between w-full relative"
        >
             {/* ❌ Delete Button */}
            <button
                onClick={(e) => {
                e.stopPropagation(); // prevent opening modal
                setDeletingMedicine(med);
                }}
                className="absolute top-2 right-3 text-red-500 hover:text-red-700 font-bold text-xl"
            >
                ×
            </button>
            {/* Medicine Info */}
            <div onClick={() => setSelectedMedicine(med)} className="cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {med.medicineName}
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
                <p>
                <span className="font-semibold text-gray-700">Rack Code:</span>{" "}
                {med.rackCode}
                </p>
                <p>
                <span className="font-semibold text-gray-700">Unit Selling Price:</span>{" "}
                ₹{med.unitSellingPrice}
                </p>
            </div>
            </div>

            {/* ✅ Update Button */}
            <button
            onClick={() => setUpdatingMedicine(med)}
            className="mt-4 w-full bg-yellow-500 text-balck py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
            Update
            </button>
        </div>
        ))
    ) : (
        <p className="text-center text-gray-500 col-span-full italic">
        No medicines found.
        </p>
  )}

  {/* Add Medicine Card */}
  <AddMedicine onMedicineAdded={fetchMedicines} />
  {/* Delete the Card */}
    {deletingMedicine && (
    <DeleteMedicine
        medicine={deletingMedicine}
        onClose={() => setDeletingMedicine(null)}
        onDeleteSuccess={fetchMedicines}
    />
    )}
  {/* ✅ Update Medicine Modal */}
  {updatingMedicine && (
    <UpdateMedicine
      medicine={updatingMedicine}
      onClose={() => setUpdatingMedicine(null)}
      onUpdateSuccess={fetchMedicines}
    />
  )}
    </div>





      {/* Modal for medicine details */}
      {selectedMedicine && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-xl">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedMedicine.medicineName}</h2>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><span className="font-semibold">Description:</span> {selectedMedicine.usageDescription}</p>
              <p><span className="font-semibold">Shop Code:</span> {selectedMedicine.shopCode}</p>
              <p><span className="font-semibold">Medicine Code:</span> {selectedMedicine.medicineCode}</p>
              <p><span className="font-semibold">Trade Name:</span> {selectedMedicine.tradeName}</p>
              <p><span className="font-semibold">Rack Code:</span> {selectedMedicine.rackCode}</p>
              <p><span className="font-semibold">Unit Cost Price:</span> ₹{selectedMedicine.unitCostPrice}</p>
              <p><span className="font-semibold">Unit Selling Price:</span> ₹{selectedMedicine.unitSellingPrice}</p>
              <p><span className="font-semibold">Total Quantity:</span> {selectedMedicine.totalQuantity}</p>
              <p><span className="font-semibold">Threshold Value:</span> {selectedMedicine.thresholdValue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
