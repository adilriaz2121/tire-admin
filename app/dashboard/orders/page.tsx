import React from "react";
import OrdersPage from "@/components/orders";

const Orders = () => {
  return (
    <div className="my-14 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Order Management</h3>
      <div className="max-w-[95rem] mx-auto w-full">
        <OrdersPage />
      </div>
    </div>
  );
};

export default Orders;
