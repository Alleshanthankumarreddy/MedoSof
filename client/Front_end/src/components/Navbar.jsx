import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
    setOwner(null);
    setStaff(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("shopCode");
    localStorage.removeItem("role");
    setShowLogin(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50">
      {/* Left: Logo + User Greeting */}
      <div className="flex items-center gap-2 cursor-pointer" >
        <img
          src="/istockphoto-1275720974-612x612.jpg"
          alt="Home"
          className="w-8 h-8 rounded-full object-cover"
          onClick={() => navigate("/")}
        />
        <span className="text-xl font-semibold">
          {owner && user
            ? `Hi, ${user.name}`
            : staff && user
            ? `Hi, ${user.name}`
            : "Welcome"}
        </span>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold tracking-wide">
        MedoSof
      </div>

      {/* Right: Hamburger Menu + Logout / Signin */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Hamburger Menu */}
            <div className="relative">
            <button
              onClick={toggleMenu}
              className="focus:outline-none p-1.5 rounded-md hover:bg-blue-500 bg-white"
            >
              <div className="space-y-0.5">
                <span className="block w-4 h-0.5 bg-black"></span>
                <span className="block w-4 h-0.5 bg-black"></span>
                <span className="block w-4 h-0.5 bg-black"></span>
              </div>
            </button>

            {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              {[
                { path: "/medicines", label: "Medicines" },
                { path: "/racks", label: "Rack Management" },
                { path: "/sales", label: "Sales" },
                { path: "/purchase", label: "Go to Purchase" },
                { path: "/lowstockmedicines", label: "Low Stock Medicines" },
                { path: "/vendor" , label: "Vendors"},
                { path: "/expiredMedicines" , label: "Expired Medicines"},
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition duration-150"
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
              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition duration-300"
          >
            Signin
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
