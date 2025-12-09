import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

const StaffList = () => {
  const { owner, token, shopCode, backendUrl } = useContext(AppContext);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (!owner) return;
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/staff/getAllStaff/${shopCode}`,
             {
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
      <div className="text-center mt-10 text-red-600 text-xl font-semibold">
        Access Denied — Only Owner Can View Staff List
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Members</h1>

      {staffList.length === 0 ? (
        <p className="text-gray-600 text-lg">No staff found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Joined
                </th>
                <th className="py-3 px-6 text-center font-semibold text-gray-700">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr
                  key={staff._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">{staff.name}</td>
                  <td className="py-3 px-6">{staff.mail}</td>
                  <td className="py-3 px-6">
                    {new Date(staff.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDeleteStaff(staff.mail, staff.name)}
                      className="bg-red-500 text-black px-3 py-1 rounded-md shadow hover:bg-red-600 transition"
                    >
                      ✖ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;
