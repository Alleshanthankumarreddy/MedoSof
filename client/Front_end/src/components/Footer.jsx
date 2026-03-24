// Footer.jsx — (minimal changes, was already mostly responsive)
import React from "react";
import { Heart, Shield, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Lock, Zap, TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0C2C47] text-white py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">MedoSof<span className="text-blue-300">.</span></h3>
              <p className="text-gray-300 text-xs">Pharmacy Automation Simplified</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-300">
            <a href="tel:+15551234567" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" /> Support
            </a>
            <a href="mailto:support@medosoft.com" className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Terms</a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <a key={index} href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-105">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Medicine Shop Automation. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Fast</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Reliable</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" /> for pharmacies
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;