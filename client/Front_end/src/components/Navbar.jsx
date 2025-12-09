import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

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
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 flex justify-between items-center shadow-[0_3px_10px_rgba(0,0,0,0.2)] fixed top-0 left-0 w-full z-50">

      {/* Left: Logo + Greeting */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/istockphoto-1275720974-612x612.jpg"
          alt="Home"
          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
        />
        <span className="text-lg font-semibold tracking-wide">
          {user ? `Hi, ${user.name}` : "Welcome"}
        </span>
      </div>

      {/* Center Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold tracking-wide drop-shadow-lg">
        MedoSof
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {user ? (
          <>
            {/* Hamburger Menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-300 transition-all active:scale-95"
              >
                <div className="flex flex-col justify-between h-4">
                  <span className="block w-6 h-[3px] bg-black rounded"></span>
                  <span className="block w-6 h-[3px] bg-black rounded"></span>
                  <span className="block w-6 h-[3px] bg-black rounded"></span>
                </div>
              </button>



              {/* Dropdown Menu */}
              {(!vendor && menuOpen) && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
                  {[
                    { path: "/medicines", label: "Medicines" },
                    { path: "/racks", label: "Rack Management" },
                    { path: "/sales", label: "Sales" },
                    { path: "/purchase", label: "Go to Purchase" },
                    { path: "/lowstockmedicines", label: "Low Stock Medicines" },
                    { path: "/vendor", label: "Vendors" },
                    { path: "/expiredMedicines", label: "Expired Medicines" },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block px-5 py-2.5 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
              {(vendor && menuOpen) && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
                  {[
                    { path: "/vendorMedicines", label: "vendorMedicines" },
                    
                  ].map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block px-5 py-2.5 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-md hover:bg-blue-100 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 hover:shadow-md transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
