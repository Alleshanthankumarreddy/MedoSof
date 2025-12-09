import React from "react";
import "../App.css";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white px-6 py-4 flex flex-col justify-center items-center fixed bottom-0 left-0 w-full z-50 shadow-lg border-t border-white/20">

      <p className="text-center text-sm mb-2 opacity-90">
        &copy; {new Date().getFullYear()} Medicine Shop Automation. All rights reserved.
      </p>

      <div className="flex gap-8 font-semibold">
        <span className="text-lg font-semibold tracking-wide">
          Features
        </span>
        <span className="text-lg font-semibold tracking-wide">
          Contact
        </span>
        <span className="text-lg font-semibold tracking-wide">
          Help
        </span>
      </div>

    </footer>
  );
};

export default Footer;
