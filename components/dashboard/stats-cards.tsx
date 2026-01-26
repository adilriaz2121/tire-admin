"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { AdminStats } from "@/actions/stats.action";
import { Mail, PackageCheck, DollarSign, Clock } from "lucide-react";

interface StatsCardsProps {
  stats: AdminStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardData = [
    {
      title: "Unread Messages",
      value: stats.totalUnreadContacts,
      icon: Mail,
      bgColor: "bg-white",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700",
      description: "New contact messages",
    },
    {
      title: "Delivered Orders",
      value: stats.totalDeliveredOrders,
      icon: PackageCheck,
      bgColor: "bg-white",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
      description: "Successfully delivered",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      bgColor: "bg-white",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      textColor: "text-orange-700",
      description: "Total revenue generated",
    },
    {
      title: "Processing Orders",
      value: stats.totalProcessingOrders,
      icon: Clock,
      bgColor: "bg-white",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      textColor: "text-amber-700",
      description: "Pending & shipped orders",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card
            key={index}
            className={`${card.bgColor} ${card.borderColor} border shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
                <div
                  className={`${card.iconBg} ${card.iconColor} p-3 rounded-lg`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
