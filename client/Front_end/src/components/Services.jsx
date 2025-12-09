import React from "react";
import { CheckCircle } from "lucide-react";

const services = [
  "Smart Inventory Management – Automatic reorder of medicines below threshold.",
  "Sales & Billing – Track sales and generate receipts easily.",
  "Expiry Management – Daily alerts and vendor-wise expiry reporting.",
  "Vendor Management – Maintain vendor details and automate payments.",
  "Revenue & Profit Reports – View daily, weekly, and monthly statistics.",
  "Medicine Lookup – Search by trade or generic name and check availability.",
  "Batch & Stock Management – Track batches, expiry dates, and stock levels.",
];

const Services = () => {
  return (
    <section className="relative bg-gray-50 py-32 overflow-hidden">

      {/* Decorative Arc + Glow */}
      <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[450px] h-[450px] border-[8px] border-blue-600/30 rounded-full opacity-60"></div>
      <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center md:text-left">
            Services We Provide
          </h2>

         <div className="space-y-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 bg-white border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-4"
            >
              <CheckCircle className="w-7 h-7 text-blue-600 mt-1" />
              <p className="text-gray-700 text-lg leading-relaxed">{service}</p>
            </div>
          ))}
        </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
