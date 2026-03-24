import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import { Users, Trash2, Calendar, Mail, User } from "lucide-react";

const StaffList = () => {
  const { owner, token, shopCode, backendUrl, role } = useContext(AppContext);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (!owner) return;
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/staff/getAllStaff/${shopCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStaffList(res.data.staff || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [owner, shopCode, token]);

  const handleDeleteStaff = async (mail, name) => {
    const ok = window.confirm(
      `Are you sure you want to remove staff "${name}" (${mail})?`
    );
    if (!ok) return;

    try {
      const res = await axios.delete(`${backendUrl}api/staff/removeStaff`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-role": role
        },
        data: {
          mail,
          shopCode,
        },
      });

      if (res.data.success) {
        setStaffList((prev) => prev.filter((s) => s.mail !== mail));
      } else {
        alert(res.data.message || "Failed to remove staff");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error");
    }
  };

  if (!owner) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
        <Users className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mb-4 sm:mb-6" />
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Access Denied
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Only the shop owner can view and manage the staff list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full mb-4 sm:mb-6 mx-auto">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Staff Members
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Manage your team members and their access to the shop
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10 lg:mb-12">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-600">Total Staff</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {staffList.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {staffList.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Users className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Staff Members</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
              Your shop currently has no staff members assigned.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffList.map((staff) => (
                    <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {staff.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.mail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleDeleteStaff(staff.mail, staff.name)}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-200">
              {staffList.map((staff) => (
                <div key={staff._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{staff.name}</h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStaff(staff.mail, staff.name)}
                      className="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{staff.mail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{new Date(staff.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;
