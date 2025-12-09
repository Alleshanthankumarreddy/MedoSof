import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";

function SalesMedicines() {
  const { addMedicine, removeMedicine,backendUrl } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");
      const shopCode = localStorage.getItem("shopCode");
      if (!token || !shopCode) return;
      const response = await axios.post(
        `${backendUrl}api/medicine/getAvailableMedicines`,
        { shopCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicines(response.data.medicines || []);
      setFilteredMedicines(response.data.medicines || []);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearch = () => {
    const query = searchTerm.trim().toLowerCase();
    const results = medicines.filter((medicine) => {
      const name = medicine.medicineName?.toLowerCase() || "";
      const rack = medicine.rackCode?.toLowerCase() || "";
      return name.includes(query) || rack.includes(query);
    });
    setFilteredMedicines(results);
  };

  useEffect(() => {
    if (!searchTerm) setFilteredMedicines(medicines);
  }, [searchTerm, medicines]);

  return (
    <div className="h-full flex flex-col overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center text-blue-700 mt-24 mb-8">
        Medicines Inventory
      </h1>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-8 flex gap-4 px-4">
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
            onClick={() => {
              setSearchTerm("");
              setFilteredMedicines(medicines);
            }}
            className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Medicines Grid */}
      <div className="flex-grow overflow-y-auto px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((med) => (
              <div
                key={med._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-5 border border-gray-200 flex flex-col justify-between w-full max-w-xs"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {med.medicineName}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">
                        Rack Code:
                      </span>{" "}
                      {med.rackCode}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Unit Selling Price:
                      </span>{" "}
                      ₹{med.unitSellingPrice}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => addMedicine(med)}
                    className="flex-1 mx-1 px-3 py-1 bg-green-500 text-black rounded-lg hover:bg-green-600 transition"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => removeMedicine(med)}
                    className="flex-1 mx-1 px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full italic">
              No medicines found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesMedicines;
