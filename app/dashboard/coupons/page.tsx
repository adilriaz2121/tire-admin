import React from "react";
import Error from "@/components/error";
import { getAllCoupons } from "@/actions/coupon.action";
import { Coupons } from "@/components/coupons";

const coupons = async ({
    searchParams,
}: {
    searchParams: { page?: number; limit?: number; query?: string };
}) => {
    const { error, data, meta } = await getAllCoupons({
        page: searchParams.page,
        limit: searchParams.limit,
        query: searchParams.query,
    });
    if (error || !meta) return <Error error={error || "No Data found"} />;
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
                <p className="text-gray-600">Manage discount coupons and promotional codes</p>
            </div>
            <Coupons data={data?.items || []} meta={meta} />
        </div>
    );
};

export default coupons;
