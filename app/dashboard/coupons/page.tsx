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
    return <Coupons data={data?.items || []} meta={meta} />;
};

export default coupons;
