"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { AdminStats } from "@/actions/stats.action";

interface StatsCardsProps {
  stats: AdminStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardData = [
    {
      title: "Unread Messages",
      value: stats.totalUnreadContacts,
      icon: "📧",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-600",
      description: "New contact messages",
    },
    {
      title: "Delivered Orders",
      value: stats.totalDeliveredOrders,
      icon: "📦",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-600",
      description: "Successfully delivered",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-600",
      description: "From delivered orders",
    },
    {
      title: "Processing Orders",
      value: stats.totalProcessingOrders,
      icon: "⏳",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-600",
      description: "Pending & shipped orders",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <Card key={index} className={`${card.color} border`}>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className="text-3xl opacity-80">{card.icon}</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
