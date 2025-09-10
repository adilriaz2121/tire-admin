import React from "react";
import { Products } from "@/components/products";
import { getAllProducts } from "@/actions/product.action";
import Error from "@/components/error";

const products = async ({
  searchParams,
}: {
  searchParams: {
    page?: number;
    limit?: number;
    query?: string;
    make?: string;
    model?: string;
    year?: string;
  };
}) => {
  const { error, data, meta } = await getAllProducts({
    page: searchParams.page,
    limit: searchParams.limit,
    query: searchParams.query,
    make: searchParams.make,
    model: searchParams.model,
    year: searchParams.year,
  });
  if (error || !meta) return <Error error={error || "No Data found"} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600">Manage your tire and wheel inventory</p>
      </div>
      <Products data={data?.items || []} meta={meta} />
    </div>
  );
};

export default products;
