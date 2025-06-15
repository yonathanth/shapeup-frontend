"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  Eye,
  BarChart3,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  firstRegisteredAt: string;
  status: string;
  role: string;
}

interface AnalyticsData {
  period: string;
  startDate: string;
  endDate: string;
  totalNewUsers: number;
  newUsers: User[];
  dailyBreakdown: { date: string; count: number }[];
}

interface OverallStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  usersByRole: { role: string; _count: { id: number } }[];
  monthlyStats: { year: number; month: number; count: number }[];
}

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5003";

const UserAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  const periods = [
    { value: "day", label: "Last 24 Hours", icon: Calendar },
    { value: "week", label: "Last 7 Days", icon: Calendar },
    { value: "month", label: "Last 30 Days", icon: Calendar },
    { value: "3months", label: "Last 90 Days", icon: Calendar },
    { value: "6months", label: "Last 180 Days", icon: Calendar },
    { value: "year", label: "Last 365 Days", icon: Calendar },
  ];

  const fetchAnalytics = async (period: string) => {
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/users/analytics?period=${period}`
      );
      const data = await response.json();
      if (response.ok) {
        setAnalyticsData(data.data);
      } else {
        console.error("Failed to fetch analytics:", data.error);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchOverallStats = async () => {
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/users/stats`
      );
      const data = await response.json();
      if (response.ok) {
        setOverallStats(data.data);
      } else {
        console.error("Failed to fetch overall stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching overall stats:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(selectedPeriod), fetchOverallStats()]);
      setLoading(false);
    };
    loadData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">User Analytics</h1>
        <p className="text-gray-400">
          Track user registrations and growth metrics
        </p>
      </div>

      {/* Period Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              selectedPeriod === period.value
                ? "bg-customBlue text-black border-customBlue"
                : "bg-gray-800 text-white border-gray-600 hover:border-customBlue"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <period.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{period.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Overall Stats Cards */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">
                  {overallStats.totalUsers}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">
                  {overallStats.activeUsers}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Users</p>
                <p className="text-2xl font-bold text-white">
                  {overallStats.pendingUsers}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  New Users (
                  {periods.find((p) => p.value === selectedPeriod)?.label})
                </p>
                <p className="text-2xl font-bold text-white">
                  {analyticsData?.totalNewUsers || 0}
                </p>
              </div>
              <div className="bg-customBlue p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-black" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent New Users */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Recent New Users (
              {periods.find((p) => p.value === selectedPeriod)?.label})
            </h3>
            <TrendingUp className="h-5 w-5 text-customBlue" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analyticsData?.newUsers && analyticsData.newUsers.length > 0 ? (
              analyticsData.newUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-customBlue text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {user.fullName}
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {formatDate(user.firstRegisteredAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <UserX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No new users found for this period</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* User Distribution */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">User Distribution</h3>
            <BarChart3 className="h-5 w-5 text-customBlue" />
          </div>

          <div className="space-y-4">
            {/* By Status */}
            <div>
              <h4 className="text-white font-medium mb-3">By Status</h4>
              <div className="space-y-2">
                {overallStats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Active</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (overallStats.activeUsers /
                                  overallStats.totalUsers) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-12 text-right">
                          {overallStats.activeUsers}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Pending</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (overallStats.pendingUsers /
                                  overallStats.totalUsers) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-12 text-right">
                          {overallStats.pendingUsers}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* By Role */}
            <div>
              <h4 className="text-white font-medium mb-3">By Role</h4>
              <div className="space-y-2">
                {overallStats?.usersByRole.map((roleData) => (
                  <div
                    key={roleData.role}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-300 capitalize">
                      {roleData.role}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-customBlue h-2 rounded-full"
                          style={{
                            width: `${
                              overallStats
                                ? (roleData._count.id /
                                    overallStats.totalUsers) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-12 text-right">
                        {roleData._count.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserAnalytics;
