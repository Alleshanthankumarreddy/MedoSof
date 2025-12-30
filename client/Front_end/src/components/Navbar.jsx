import React, { useContext } from "react";
import { useRef, useEffect, useState } from "react";

import { AppContext } from "../AppContext";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Pill,
  LayoutGrid,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Users,
  PackageX,
  Home,
  BarChart3
} from "lucide-react";


const Navbar = () => {
  const {
    staff,
    setStaff,
    owner,
    setOwner,
    showLogin,
    setShowLogin,
    user,
    setUser,
    vendor,
    role
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
   
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const handleLogout = () => {
    setUser(null);
    setOwner(null);
    setStaff(null);
    localStorage.clear();
    setShowLogin(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => setShowLogin(true);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
  <nav className="bg-[#0C2C47] px-6 py-7 flex items-center 
                shadow-[0_6px_20px_rgba(0,0,0,0.25)] 
                fixed top-0 left-0 w-full z-50 rounded-b-3xl">

  {/* LEFT: Menu Icon */}
  {/* LEFT: Menu + Greeting */}
<div className="flex items-center gap-4">
  {user && (
    <div className="relative">
      <button
  onClick={toggleMenu}
  className="p-1.5 bg-white rounded-xl shadow-md 
             hover:shadow-lg transition-all active:scale-95"
>
  <Menu className="w-9 h-7 text-black" />
</button>




      {/* Dashboard Dropdown */}
{(!vendor && menuOpen) && (
      <div
      ref={menuRef}
        className="
          fixed top-[72px] left-0 h-[calc(100vh-72px)] w-72
          bg-[#0C2C47]
          text-[#EFEAE6]
          shadow-2xl
          rounded-r-3xl
          animate-slideInLeft
          z-40
        "
      >
        {/* Menu Items */}
        {/* Menu Items */}
    <div className="flex flex-col mt-4">
      {[
      { path: "/", label: "Dashboard", icon: Home },

      { path: "/medicines", label: "Medicine Inventory", icon: Pill },

      { path: "/racks", label: "Storage Racks", icon: LayoutGrid },

      { path: "/sales", label: "Billing & Sales", icon: TrendingUp },

      { path: "/purchase", label: "Purchase Orders", icon: ShoppingCart },

      { path: "/lowstockmedicines", label: "Low Stock Alerts", icon: AlertTriangle },

      { path: "/vendor", label: "Suppliers", icon: Users },

      { path: "/expiredMedicines", label: "Expired Stock", icon: PackageX },

      { path: "/displayProfits", label: "Sales Analytics", icon: BarChart3 },
    ]
    .map((item, index) => {
        const Icon = item.icon;

        return (
          <Link
            key={index}
            to={item.path}
            className="
              group flex items-center gap-4
              mx-4 px-5 py-3
              rounded-xl
              border-b border-white/30
              transition-all duration-300
              hover:bg-white hover:shadow-lg
            "
          >
            <Icon
              className="
                w-5 h-5
                text-[#EFEAE6]
                group-hover:text-[#0C2C47]
                transition-colors
              "
            />

            <span
              className="
                text-[#EFEAE6]
                transition-all duration-300
                group-hover:text-[#0C2C47]
                group-hover:font-semibold
                group-hover:translate-x-1
              "
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>


      </div>
)}


    </div>
  )}

  {/* Greeting */}
  <span className="text-2xl font-semibold tracking-wide text-white">
    {user ? `Hi, ${user.name}` : "Welcome"}
  </span>
</div>


  {/* CENTER: Title */}
  <div className="absolute left-1/2 transform -translate-x-1/2 
                  text-4xl font-bold tracking-wide drop-shadow-lg">
    <span className="text-white">Medo</span>
    <span className="text-[#EFEAE6]">Sof</span>
  </div>

  {/* RIGHT: Auth Button */}
  <div className="ml-auto">
    {user ? (
      <button
        onClick={handleLogout}
        className="bg-white text-[#0C2C47] font-semibold 
                   px-5 py-2 rounded-2xl shadow 
                   hover:shadow-md hover:bg-[#EFEAE6] transition-all"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={handleLogin}
        className="bg-white text-[#0C2C47] font-semibold 
                   px-5 py-2 rounded-2xl shadow 
                   hover:bg-[#EFEAE6] transition-all"
      >
        Sign In
      </button>
    )}
  </div>
</nav>

);

};

export default Navbar;
