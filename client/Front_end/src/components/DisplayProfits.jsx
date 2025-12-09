import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function LastWeekSales() {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/api/sales/getLastWeekSales",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const sales = response.data.sales;

      // Convert raw data into day-wise format
      const grouped = groupByDay(sales);

      setSalesData(grouped);

      // Calculate stats
      const total = grouped.reduce((sum, d) => sum + d.sales, 0);
      const highest = Math.max(...grouped.map((d) => d.sales));
      const average = total / grouped.length;

      setStats({
        total,
        highest,
        average: average.toFixed(2),
      });

    } catch (err) {
      console.log("Error fetching last week sales", err);
    }
  };

  // --- Helper: Group sales by weekday ---
  const groupByDay = (sales) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // initialize 7 days with 0 sales
    const map = days.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {});

    // add sales for each day
    sales.forEach((s) => {
      const date = new Date(s.time);
      const day = days[date.getDay()];
      map[day] += s.totalAmount;
    });

    // Convert to array for Recharts
    return days.map((day) => ({
      day,
      sales: map[day],
    }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Last Week Sales Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">Total Sales</h2>
          <p className="text-2xl font-bold text-green-600">₹ {stats.total}</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">Highest Day Sale</h2>
          <p className="text-2xl font-bold text-blue-600">₹ {stats.highest}</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">Average Sale</h2>
          <p className="text-2xl font-bold text-purple-600">₹ {stats.average}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Sales in Last 7 Days</h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LastWeekSales;
