import React from "react";
import { Package, ShoppingCart, CalendarDays, FileText, DollarSign } from "lucide-react";

const features = [
  {
    icon: <Package className="w-10 h-10 text-blue-600" />,
    title: "Smart Inventory",
    description: "Automatically reorder medicines when stock falls below threshold using JIT philosophy."
  },
  {
    icon: <ShoppingCart className="w-10 h-10 text-blue-600" />,
    title: "Sales & Billing",
    description: "Generate receipts and track sales seamlessly with medicine code and quantity."
  },
  {
    icon: <CalendarDays className="w-10 h-10 text-blue-600" />,
    title: "Expiry Alerts",
    description: "Daily expiry list generation and vendor-wise reporting to ease returns."
  },
  {
    icon: <FileText className="w-10 h-10 text-blue-600" />,
    title: "Vendor Management",
    description: "Maintain vendor details and generate cheques automatically on supply."
  },
  {
    icon: <DollarSign className="w-10 h-10 text-blue-600" />,
    title: "Profit & Reports",
    description: "Get daily, weekly, and monthly revenue and profit analysis."
  }
];

const Features = () => {
  return (
    <section className="pt-0 py-16 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Why Choose MSA?</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
