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
    <section className="pt-16 pb-8 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Services We Provide</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-lg transition"
            >
              <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
              <p className="text-gray-700">{service}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
