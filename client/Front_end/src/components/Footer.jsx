import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white px-6 py-2 flex flex-col justify-center items-center fixed bottom-0 left-0 w-full z-50 shadow-md">
      {/* Text */}
      <p className="text-center text-m mb-2">
        &copy; {new Date().getFullYear()} Medicine Shop Automation. All rights reserved.
      </p>

      {/* Links */}
      <div className="flex gap-6 text-white">
        <a href="#features" className="hover:underline">
          Features
        </a>
        <a href="#contact" className="hover:underline">
          Contact
        </a>
        <a href="#" className="hover:underline">
          Help
        </a>
      </div>
    </footer>
  );
};

export default Footer;
