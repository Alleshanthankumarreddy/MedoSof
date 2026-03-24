// Navbar.jsx
import React, { useContext } from "react";
import { useRef, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Pill, LayoutGrid, ShoppingCart, TrendingUp,
  AlertTriangle, Users, PackageX, Home, BarChart3,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/medicines", label: "Medicine Inventory", icon: Pill },
  { path: "/racks", label: "Storage Racks", icon: LayoutGrid },
  { path: "/sales", label: "Billing & Sales", icon: TrendingUp },
  { path: "/purchase", label: "Purchase Orders", icon: ShoppingCart },
  { path: "/lowstockmedicines", label: "Low Stock Alerts", icon: AlertTriangle },
  { path: "/vendor", label: "Suppliers", icon: Users },
  { path: "/expiredMedicines", label: "Expired Stock", icon: PackageX },
  { path: "/displayProfits", label: "Sales Analytics", icon: BarChart3 },
];

const Navbar = () => {
  const {
    staff, setStaff, owner, setOwner,
    showLogin, setShowLogin, user, setUser, vendor, role,
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null); setOwner(null); setStaff(null);
    localStorage.clear();
    setShowLogin(false); setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#0C2C47] px-4 sm:px-6 py-4 sm:py-5 flex items-center
                    shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                    fixed top-0 left-0 w-full z-50 rounded-b-2xl sm:rounded-b-3xl">

      {/* LEFT: Menu + Greeting */}
      <div className="flex items-center gap-2 sm:gap-4">
        {user && !vendor && (
          <div className="relative" ref={menuRef}>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              {menuOpen
                ? <X className="w-7 h-6 sm:w-9 sm:h-7 text-black" />
                : <Menu className="w-7 h-6 sm:w-9 sm:h-7 text-black" />
              }
            </button>

            {/* Sidebar Drawer */}
            {menuOpen && (
              <>
                {/* Backdrop (mobile only) */}
                <div
                  className="fixed inset-0 bg-black/40 z-30 sm:hidden"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="
                  fixed top-[64px] sm:top-[72px] left-0
                  h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)]
                  w-64 sm:w-72
                  bg-[#0C2C47] text-[#EFEAE6]
                  shadow-2xl rounded-r-3xl
                  animate-slideInLeft z-40
                  overflow-y-auto
                ">
                  <div className="flex flex-col mt-4">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className="
                            group flex items-center gap-4
                            mx-3 sm:mx-4 px-4 sm:px-5 py-3
                            rounded-xl border-b border-white/30
                            transition-all duration-300
                            hover:bg-white hover:shadow-lg
                          "
                        >
                          <Icon className="w-5 h-5 text-[#EFEAE6] group-hover:text-[#0C2C47] transition-colors shrink-0" />
                          <span className="text-sm sm:text-base text-[#EFEAE6] transition-all duration-300
                                           group-hover:text-[#0C2C47] group-hover:font-semibold group-hover:translate-x-1">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Greeting — truncated on small screens */}
        <span className="text-base sm:text-2xl font-semibold tracking-wide text-white truncate max-w-[100px] sm:max-w-none">
          {user ? `Hi, ${user.name}` : "Welcome"}
        </span>
      </div>

      {/* CENTER: Brand Title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-4xl font-bold tracking-wide drop-shadow-lg">
        <span className="text-white">Medo</span>
        <span className="text-[#EFEAE6]">Sof</span>
      </div>

      {/* RIGHT: Auth Button */}
      <div className="ml-auto">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-white text-[#0C2C47] font-semibold
                       px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base
                       rounded-xl sm:rounded-2xl shadow hover:shadow-md hover:bg-[#EFEAE6] transition-all"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-white text-[#0C2C47] font-semibold
                       px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base
                       rounded-xl sm:rounded-2xl shadow hover:bg-[#EFEAE6] transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;