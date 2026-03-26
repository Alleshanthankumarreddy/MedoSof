// Services.jsx
import React, { useContext } from "react";
import {
  Receipt, CalendarX, BarChart3, Search, Layers, Sparkles, ShieldCheck,
  UserPlus, Building2, Users, Key, Truck, PackageCheck
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

const workflowSteps = [
  // Owner Workflow
  { 
    title: "Owner Onboarding", 
    description: "Create account → Enter shop code → Add staff count → Verify vendors → Setup racks → Add medicines", 
    icon: UserPlus,
    gradient: "from-blue-500 to-indigo-400",
    users: "Owner"
  },
  // Staff Workflow  
  { 
    title: "Staff Registration", 
    description: "Register using shop code → Login → Find medicines → Process sales → Update inventory", 
    icon: Users,
    gradient: "from-green-500 to-emerald-400",
    users: "Staff"
  },
  // Vendor Workflow
  { 
    title: "Vendor Setup", 
    description: "Register account → Login → Add supply medicines → Manage inventory → Track orders", 
    icon: Truck,
    gradient: "from-purple-500 to-violet-400",
    users: "Vendor"
  }
];

const Services = () => {
  const { user } = useContext(AppContext);

  return (
    <section className="relative py-12 sm:py-16 md:py-24 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-72 sm:h-72 bg-blue-100 blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-72 sm:h-72 bg-purple-100 blur-3xl opacity-20" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-50 rounded-full mb-4 mx-auto w-fit">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="text-xs sm:text-sm font-semibold text-blue-600">Intelligent Pharmacy Solutions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Comprehensive Pharmacy Management
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Role-based access for owners, staff, and vendors with seamless workflows
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 xl:gap-16">
          {/* LEFT — SERVICES + WORKFLOWS */}
          <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10">
            
            {/* Services Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 lg:mb-8">
              <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Everything You Need In One Platform
              </h2>
            </div>

            {/* Core Services */}
            <div className="space-y-3 sm:space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-white rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-br ${service.gradient} shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed flex-1 group-hover:text-gray-900">{service.text}</p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT — IMAGE */}
          <div className="relative flex justify-center items-center w-full lg:w-1/2 order-first lg:order-last">
            <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/20 blur-xl rounded-3xl" />
            <div className="absolute -bottom-4 -right-4 w-28 h-28 sm:w-40 sm:h-40 bg-purple-500/20 blur-xl rounded-3xl" />
            <img
              src={MedoSofImg}
              alt="Pharmacy Management Dashboard"
              className="w-full max-w-xs sm:max-w-sm lg:max-w-lg xl:max-w-xl rounded-2xl lg:rounded-3xl shadow-2xl object-cover relative z-10 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
