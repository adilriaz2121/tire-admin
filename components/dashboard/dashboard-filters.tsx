"use client";

import React from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Calendar } from "lucide-react";
import { DashboardFilters } from "@/actions/stats.action";

interface DashboardFiltersBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

const periods = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
] as const;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

const months = [
  { key: 1, label: "January" },
  { key: 2, label: "February" },
  { key: 3, label: "March" },
  { key: 4, label: "April" },
  { key: 5, label: "May" },
  { key: 6, label: "June" },
  { key: 7, label: "July" },
  { key: 8, label: "August" },
  { key: 9, label: "September" },
  { key: 10, label: "October" },
  { key: 11, label: "November" },
  { key: 12, label: "December" },
];

const DashboardFiltersBar: React.FC<DashboardFiltersBarProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handlePeriodChange = (period: DashboardFilters["period"]) => {
    onFiltersChange({ ...filters, period });
  };

  const handleYearChange = (value: string) => {
    const year = parseInt(value);
    if (!isNaN(year)) {
      onFiltersChange({ ...filters, year });
    }
  };

  const handleMonthChange = (value: string) => {
    const month = parseInt(value);
    if (!isNaN(month)) {
      onFiltersChange({ ...filters, month });
    } else {
      onFiltersChange({ ...filters, month: undefined });
    }
  };

  const handleReset = () => {
    onFiltersChange({
      period: "month",
      year: currentYear,
      month: undefined,
    });
  };

  return (
    <div className=" ">
      <div className="flex flex-wrap items-center gap-4">
        {/* Period Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {periods.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={filters.period === p.key ? "solid" : "light"}
              color={filters.period === p.key ? "primary" : "default"}
              className={`min-w-[60px] text-xs font-medium ${
                filters.period === p.key
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onPress={() =>
                handlePeriodChange(p.key as DashboardFilters["period"])
              }
            >
              {p.label}
            </Button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        {/* Year & Month Selectors */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>

        <Select
          label="Year"
          size="sm"
          variant="bordered"
          className="w-[130px]"
          selectedKeys={filters.year ? [String(filters.year)] : []}
          onChange={(e) => handleYearChange(e.target.value)}
          classNames={{
            trigger: "h-10 min-h-10 border-gray-300",
            label: "text-xs",
            value: "text-sm",
          }}
        >
          {years.map((year) => (
            <SelectItem key={String(year)} textValue={String(year)}>
              {year}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Month"
          size="sm"
          variant="bordered"
          className="w-[150px]"
          selectedKeys={filters.month ? [String(filters.month)] : []}
          onChange={(e) => handleMonthChange(e.target.value)}
          classNames={{
            trigger: "h-10 min-h-10 border-gray-300",
            label: "text-xs",
            value: "text-sm",
          }}
        >
          {months.map((m) => (
            <SelectItem key={String(m.key)} textValue={m.label}>
              {m.label}
            </SelectItem>
          ))}
        </Select>

        {/* Reset Button */}
        <Button
          size="sm"
          variant="flat"
          className="ml-auto text-xs text-gray-500 hover:text-gray-800 bg-gray-100 min-w-[60px]"
          onPress={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DashboardFiltersBar;
