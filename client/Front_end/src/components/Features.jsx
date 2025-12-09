import React from "react";
import { Package, ShoppingCart, CalendarDays, FileText, DollarSign } from "lucide-react";

const features = [
  {
    icon: <Package className="w-8 h-8 text-blue-700" />,
    title: "Smart Inventory",
    description: "Automatically reorder medicines when stock falls below threshold using JIT philosophy.",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-blue-700" />,
    title: "Sales & Billing",
    description: "Generate receipts and track sales seamlessly with medicine code and quantity.",
  },
  {
    icon: <CalendarDays className="w-8 h-8 text-blue-700" />,
    title: "Expiry Alerts",
    description: "Daily expiry list generation and vendor-wise reporting to ease returns.",
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-700" />,
    title: "Vendor Management",
    description: "Maintain vendor details and generate cheques automatically on supply.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-blue-700" />,
    title: "Profit & Reports",
    description: "Get daily, weekly, and monthly revenue and profit analysis.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-100 to-gray-50" id="features">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-14 tracking-tight">
          Why Choose <span className="text-blue-700">MSA?</span>
        </h2>

        {/* Features Grid */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-gray-100"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-full bg-blue-50 flex justify-center items-center shadow-inner">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
