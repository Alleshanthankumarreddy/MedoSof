import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  TrendingUp, DollarSign, Calendar, Target, BarChart3, ArrowUp,
  ShoppingBag, TrendingDown, Award, Activity, ArrowRight
} from "lucide-react";
import { AppContext } from "../AppContext";

function LastWeekSales() {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, highest: 0, lowest: 0, growth: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");
  const { role, backendUrl, shopCode } = useContext(AppContext);

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log(shopCode);
      const response = await axios.get(
      `${backendUrl}/api/sales/getLastWeekSales`,
        {
          params: { shopCode },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-role": role,
          },
        }
      );
      const sales = response.sales || [];
      console.log(sales);
      const grouped = groupByDay(sales);
      setSalesData(grouped);
      const total = grouped.reduce((sum, d) => sum + d.sales, 0);
      const highest = Math.max(...grouped.map((d) => d.sales));
      const lowest = Math.min(...grouped.map((d) => d.sales));
      const average = total / grouped.length;
      setStats({ total, highest, lowest, average: average.toFixed(0), growth: 12.5, transactions: sales.length });
    } catch (err) {
      console.error("Error fetching last week sales", err);
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (sales) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"];
    const map = days.reduce((acc, day, index) => { acc[day] = { sales: 0, color: colors[index] }; return acc; }, {});
    sales.forEach((s) => { const day = days[new Date(s.time).getDay()]; map[day].sales += s.totalAmount; });
    return days.map((day) => ({ day, sales: map[day].sales, color: map[day].color, fullDay: getFullDayName(day) }));
  };

  const getFullDayName = (d) => ({ Sun:"Sunday",Mon:"Monday",Tue:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Fri:"Friday",Sat:"Saturday" }[d] || d);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-200">
        <p className="font-semibold text-gray-900 text-sm">{getFullDayName(label)}</p>
        <p className="text-base font-bold text-gray-900">₹ {payload[0].value.toLocaleString()}</p>
      </div>
    );
    return null;
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  if (loading) return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading sales data...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: "Total Revenue", value: formatCurrency(stats.total), sub: `+${stats.growth}% this week`, subIcon: <ArrowUp className="w-3 h-3" />, icon: <DollarSign className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Daily Average", value: formatCurrency(stats.average), sub: "Per day", subIcon: <Calendar className="w-3 h-3" />, icon: <Target className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Peak Day", value: formatCurrency(stats.highest), sub: "Best performance", subIcon: <Award className="w-3 h-3" />, icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: "bg-green-50" },
    { label: "Lowest Day", value: formatCurrency(stats.lowest), sub: "Room for growth", subIcon: <Activity className="w-3 h-3" />, icon: <TrendingDown className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    { label: "Transactions", value: stats.transactions, sub: "Total orders", subIcon: <BarChart3 className="w-3 h-3" />, icon: <ShoppingBag className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
    { label: "Growth Rate", value: `+${stats.growth}%`, sub: "vs last week", subIcon: <ArrowRight className="w-3 h-3" />, icon: <ArrowUp className="w-5 h-5 text-green-600" />, bg: "bg-green-50" },
  ];

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-600">SALES ANALYTICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Sales <span className="text-[#0C2C47]">Dashboard</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Track revenue performance and analyze sales trends over time
          </p>
        </div>

        {/* Stats Grid — 2 cols mobile, 3 tablet, 6 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className={`inline-flex p-2 ${card.bg} rounded-lg mb-3`}>{card.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">{card.value}</h3>
              <p className="text-gray-500 text-xs mb-2">{card.label}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {card.subIcon}<span>{card.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daily Performance</h3>
              <p className="text-xs sm:text-sm text-gray-500">Revenue distribution by day</p>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded" /><span>Revenue</span>
            </div>
          </div>
          <div className="h-[250px] sm:h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} width={45} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {salesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs sm:text-sm">
          <p className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Data updated: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LastWeekSales;