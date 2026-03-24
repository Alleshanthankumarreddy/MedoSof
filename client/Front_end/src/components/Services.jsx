// Services.jsx
import React, { useContext } from "react";
import {
  Receipt, CalendarX, BarChart3, Search, Layers, Sparkles, ShieldCheck,
} from "lucide-react";
import MedoSofImg from "../assets/MedoSofImg.jpeg";
import { AppContext } from "../AppContext";

const services = [
  { text: "Sales & Billing – Track sales and generate receipts easily.", icon: Receipt, gradient: "from-emerald-500 to-green-400" },
  { text: "Expiry Management – Daily alerts and vendor-wise expiry reporting.", icon: CalendarX, gradient: "from-amber-500 to-orange-400" },
  { text: "Revenue & Profit Reports – View daily, weekly, and monthly statistics.", icon: BarChart3, gradient: "from-indigo-500 to-blue-400" },
  { text: "Medicine Lookup – Search by trade or generic name and check availability.", icon: Search, gradient: "from-rose-500 to-pink-400" },
  { text: "Batch & Stock Management – Track batches, expiry dates, and stock levels.", icon: Layers, gradient: "from-teal-500 to-emerald-400" },
];

const Services = () => {
  const { user } = useContext(AppContext);

  return (
    <section className="relative py-16 md:py-24 pb-8 overflow-hidden">

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 blur-3xl opacity-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600">Intelligent Pharmacy Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Comprehensive Pharmacy Management
          </h1>
        </div>

        {/* CONTENT GRID — stacks on mobile, side-by-side on lg+ */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4">

          {/* LEFT — SERVICES */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Everything You Need In One Platform
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${service.gradient} shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{service.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="relative flex justify-center items-center w-full lg:w-1/2">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/20 blur-2xl rounded-3xl" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-500/20 blur-2xl rounded-3xl" />
            <img
              src={MedoSofImg}
              alt="Pharmacy Management"
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl shadow-2xl object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;