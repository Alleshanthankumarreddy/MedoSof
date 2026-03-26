import React from "react";
import { Key, Users, UserPlus, Truck } from "lucide-react";

const workflowSteps = [
  {
    title: "Owner Setup & Management",
    description:
      "Create your account, register your shop using a unique shop code, configure racks, add medicines, and manage staff access efficiently.",
    icon: UserPlus,
    gradient: "from-blue-500 to-indigo-500",
    users: "Owner",
  },
  {
    title: "Staff Operations",
    description:
      "Login using shop credentials, search medicines quickly, handle billing and sales, and keep inventory updated in real-time.",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
    users: "Staff",
  },
  {
    title: "Vendor Management",
    description:
      "Register as a vendor, supply medicines to shops.",
    icon: Truck,
    gradient: "from-purple-500 to-violet-500",
    users: "Vendor",
  },
];

function RoleWorkflows() {
  return (
    <div className="pt-10 border-t border-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Role-Based Workflows
        </h3>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient top border */}
              <div
                className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${step.gradient}`}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} mb-4 group-hover:scale-110 transition`}
              >
                <Icon className="text-white w-5 h-5" />
              </div>

              {/* Role Badge */}
              <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                {step.users}
              </span>

              {/* Title */}
              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">
                {step.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoleWorkflows;