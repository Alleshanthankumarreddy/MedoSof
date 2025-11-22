import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [shopCode, setShopCode] = useState(localStorage.getItem("shopCode" || null));
  const [owner, setOwner] = useState(localStorage.getItem("role") === "owner");
  const [staff, setStaff] = useState(localStorage.getItem("role") === "staff");
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [showLogin, setShowLogin] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token" || null));
  const [listOfMedicines, setListOfMedicines] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState(() => {
    const saved = localStorage.getItem("lowStockMedicines");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("lowStockMedicines", JSON.stringify(lowStockMedicines));
  }, [lowStockMedicines]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedShopCode = localStorage.getItem("shopCode");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");
  
    if (savedToken && savedUser) {
      setToken(savedToken);
      setShopCode(savedShopCode);
      setUser(JSON.parse(savedUser));  // ✅ restore user object
  
      if (savedRole === "owner") {
        setOwner(true);
        setStaff(false);
      } else if (savedRole === "staff") {
        setStaff(true);
        setOwner(false);
      }
    } else {
      setToken(null);
      setUser(null);
      setOwner(false);
      setStaff(false);
    }
  }, [token]);

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
  

  const value = {
    user,
    setUser,
    shopCode,
    setShopCode,
    showLogin,
    setShowLogin,
    owner,
    setOwner,
    staff,
    setStaff,
    token,
    setToken,
    backendUrl,
    listOfMedicines,
    setListOfMedicines,
    addMedicine,
    removeMedicine,
    updateMedicineQuantity,
    removeFromReceipt,
    lowStockMedicines,
    setLowStockMedicines,
    handleRemoveMedicine
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
