import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // -----------------------------
  // Authentication / User Info
  // -----------------------------
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [shopCode, setShopCode] = useState(localStorage.getItem("shopCode"));

  const [owner, setOwner] = useState(role === "owner");
  const [staff, setStaff] = useState(role === "staff");
  const [vendor, setVendor] = useState(role === "vendor");
  const [showLogin, setShowLogin] = useState(false);

const [listOfMedicines, setListOfMedicines] = useState(() => {
  const saved = localStorage.getItem("listOfMedicines");

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
});



  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // -----------------------------
  // Low Stock Medicines
  // -----------------------------
  const [lowStockMedicines, setLowStockMedicines] = useState(() => {
    const saved = localStorage.getItem("lowStockMedicines");
    return saved ? JSON.parse(saved) : [];
  });

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    if (role) localStorage.setItem("role", role);
    if (shopCode) localStorage.setItem("shopCode", shopCode);
    
  }, [token, user, role, shopCode]);

  useEffect(() => {
    localStorage.setItem(
      "lowStockMedicines",
      JSON.stringify(lowStockMedicines)
    );
    console.log(lowStockMedicines)
  }, [lowStockMedicines]);

useEffect(() => {
  localStorage.setItem(
    "listOfMedicines",
    JSON.stringify(listOfMedicines)
  );
}, [listOfMedicines]);



  useEffect(() => {
    setOwner(role === "owner");
    setStaff(role === "staff");
    setVendor(role === "vendor");
  }, [role]);

  // -----------------------------
  // Low Stock Functions
  // -----------------------------



  const moveToPurchase = (medicine) => {
    setLowStockMedicines((prev) =>
      prev.filter((m) => m.medicineCode !== medicine.medicineCode)
    );
  };
  const restoreToLowStock = (medicine) => {
    setLowStockMedicines((prev) => {
      const exists = prev.some(
        (m) => m.medicineCode === medicine.medicineCode
      );
      if (exists) return prev;
      return [...prev, medicine];
    });
  };
 const addMedicine = (medicine) => {
    setListOfMedicines((prev) => {
      const existing = prev.find((m) => m._id === medicine._id);
      if (existing) {
        return prev.map((m) =>
          m._id === medicine._id ? { ...m, quantity: m.quantity + 1 } : m
        );
      } else {
        return [...prev, { ...medicine, quantity: 1 }];
      }
    });
  }

  const removeMedicine = (medicine) => {
    setListOfMedicines((prev) => {
      const existing = prev.find((m) => m._id === medicine._id);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev.filter((m) => m._id !== medicine._id);
      } else {
        return prev.map((m) =>
          m._id === medicine._id ? { ...m, quantity: m.quantity - 1 } : m
        );
      }
    });
  };


const updateMedicineQuantity = (medicineId, quantity) => {
    setListOfMedicines((prev) =>
      prev.map((m) =>
        m._id === medicineId ? { ...m, quantity: quantity } : m
      )
    );
  };

  const removeFromReceipt = (medicineId) => {
    setListOfMedicines((prev) => prev.filter((m) => m._id !== medicineId));
  };

  const handleRemoveMedicine = (medicineCode) => {
    setLowStockMedicines((prev) => prev.filter(
      (item) => item.medicineCode !== medicineCode
    ));
  };

  // -----------------------------
  // Context Value
  // -----------------------------
  const value = {
    user,
    setUser,
    token,
    setToken,
    role,
    setRole,
    owner,
    setOwner,
    staff,
    setStaff,
    removeMedicine,
    vendor,
    setVendor,
    shopCode,
    setShopCode,
    backendUrl,
    lowStockMedicines,
    addMedicine,
    setLowStockMedicines,
    updateMedicineQuantity,
    removeFromReceipt,
    handleRemoveMedicine,
    moveToPurchase,
    restoreToLowStock,
    showLogin,
    setShowLogin,
    listOfMedicines,
    setListOfMedicines
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
