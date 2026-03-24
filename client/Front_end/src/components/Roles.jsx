// Roles.jsx
import React from "react";
import { UserCog, User, Truck, ShieldCheck, Zap } from "lucide-react";

const roles = [
  {
    title: "Pharmacy Owner",
    description: "Monitor profits, manage staff, track inventory, and make data-driven decisions effortlessly.",
    icon: UserCog,
    gradient: "from-blue-600 to-cyan-500",
    benefits: ["Profit Tracking", "Staff Management", "Full Control"],
  },
  {
    title: "Pharmacy Staff",
    description: "Handle billing, sales, and stock updates quickly with an easy-to-use interface.",
    icon: User,
    gradient: "from-emerald-600 to-green-500",
    benefits: ["Fast Billing", "Easy Sales Entry", "Medicines Searching", "Stock Managing"],
  },
  {
    title: "Vendors",
    description: "Manage supplied medicines, track orders, and get transparent payment records.",
    icon: Truck,
    gradient: "from-purple-600 to-pink-500",
    benefits: ["Order Visibility", "Payment Transparency"],
  },
];

const Roles = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">BUILT FOR EVERY ROLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Who Can Use <span className="text-blue-600">MedoSof?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Designed to simplify operations for everyone involved in pharmacy management.
          </p>
        </div>

        {/* Roles Grid — 1 col on mobile, 3 col on lg+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${role.gradient} mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{role.description}</p>
                <ul className="space-y-3">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Zap className="w-4 h-4 text-blue-500 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Roles;