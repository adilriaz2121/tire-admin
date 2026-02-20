"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import {
  getDashboardData,
  DashboardData,
  DashboardFilters,
} from "@/actions/stats.action";
import StatsCards from "./stats-cards";
import ChartsSection from "./charts-section";
import DashboardFiltersBar from "./dashboard-filters";

const DashboardStats: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: "month",
    year: new Date().getFullYear(),
  });

  const fetchDashboardData = useCallback(async (filters?: DashboardFilters) => {
    try {
      setLoading(true);
      const response = await getDashboardData(filters);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(filters);
  }, [filters, fetchDashboardData]);

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  if (error && !dashboardData) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardFiltersBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <Card className="bg-red-50 border-red-200">
          <CardBody className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchDashboardData(filters)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <DashboardFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardBody className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardBody>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardBody className="p-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      ) : !dashboardData ? (
        <Card>
          <CardBody className="p-6 text-center">
            <p className="text-gray-600">No data available</p>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <StatsCards stats={dashboardData.cards} />

          {/* Charts Section */}
          <ChartsSection charts={dashboardData.charts} period={filters.period} />
        </>
      )}
    </div>
  );
};

export default DashboardStats;
