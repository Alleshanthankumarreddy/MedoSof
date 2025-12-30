import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target, 
  BarChart3, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  TrendingDown,
  Award,
  Activity,
  ArrowRight
} from "lucide-react";
import { AppContext } from "../AppContext";

function LastWeekSales() {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
    lowest: 0,
    growth: 0,
    transactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");
  const { role, backendUrl } = useContext(AppContext);

  useEffect(() => {
    fetchSales();
  }, [period]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${backendUrl}api/sales/getLastWeekSales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-role": role
          }
        }
      );

      const sales = response.data.sales || [];

      // Convert raw data into day-wise format
      const grouped = groupByDay(sales);
      setSalesData(grouped);

      // Calculate stats
      const total = grouped.reduce((sum, d) => sum + d.sales, 0);
      const highest = Math.max(...grouped.map((d) => d.sales));
      const lowest = Math.min(...grouped.map((d) => d.sales));
      const average = total / grouped.length;
      
      // Mock growth calculation (in a real app, compare with previous period)
      const growth = 12.5; // percentage

      setStats({
        total,
        highest,
        lowest,
        average: average.toFixed(0),
        growth,
        transactions: sales.length
      });

    } catch (err) {
      console.error("Error fetching last week sales", err);
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (sales) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"];

    // Initialize 7 days with 0 sales
    const map = days.reduce((acc, day, index) => {
      acc[day] = { sales: 0, color: colors[index] };
      return acc;
    }, {});

    // Add sales for each day
    sales.forEach((s) => {
      const date = new Date(s.time);
      const day = days[date.getDay()];
      map[day].sales += s.totalAmount;
    });

    // Convert to array for Recharts
    return days.map((day, index) => ({
      day,
      sales: map[day].sales,
      color: colors[index],
      fullDay: getFullDayName(day)
    }));
  };

  const getFullDayName = (shortDay) => {
    const daysMap = {
      "Sun": "Sunday",
      "Mon": "Monday",
      "Tue": "Tuesday",
      "Wed": "Wednesday",
      "Thu": "Thursday",
      "Fri": "Friday",
      "Sat": "Saturday"
    };
    return daysMap[shortDay] || shortDay;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{getFullDayName(label)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
            <p className="text-lg font-bold text-gray-900">
              ₹ {payload[0].value.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {payload[0].value > stats.average ? 'Above average' : 'Below average'}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{getFullDayName(label)}</p>
          <p className="text-lg font-bold text-gray-900">
            ₹ {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              SALES ANALYTICS
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sales <span className="text-[#0C2C47]">Dashboard</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track revenue performance and analyze sales trends over time
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-10">
          <div className="inline-flex bg-white p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setPeriod("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                period === "week" 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="flex sm:flex-row gap-6 mb-10">
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatCurrency(stats.total)}</h3>
            <p className="text-blue-100 text-sm">Total Revenue</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+{stats.growth}% this week</span>
            </div>
          </div>

          {/* Average Daily */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.average)}</h3>
            <p className="text-gray-600 text-sm">Daily Average</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Per day</span>
            </div>
          </div>

          {/* Highest Day */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.highest)}</h3>
            <p className="text-gray-600 text-sm">Peak Day</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <Award className="w-4 h-4" />
              <span>Best performance</span>
            </div>
          </div>

          {/* Lowest Day */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.lowest)}</h3>
            <p className="text-gray-600 text-sm">Lowest Day</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
              <Activity className="w-4 h-4" />
              <span>Room for growth</span>
            </div>
          </div>

          {/* Transactions */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.transactions}</h3>
            <p className="text-gray-600 text-sm">Transactions</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-purple-600">
              <BarChart3 className="w-4 h-4" />
              <span>Total orders</span>
            </div>
          </div>

          {/* Growth */}
          <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <ArrowUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">+{stats.growth}%</h3>
            <p className="text-gray-600 text-sm">Growth Rate</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <ArrowRight className="w-4 h-4" />
              <span>vs last week</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
                <p className="text-sm text-gray-500">Revenue distribution by day</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="sales" 
                    radius={[8, 8, 0, 0]}
                  >
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>



        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Data updated: {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LastWeekSales;