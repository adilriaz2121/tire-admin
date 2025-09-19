import React from "react";
import { Reviews } from "@/components/reviews";
import { getAllReviews } from "@/actions/review.action";
import Error from "@/components/error";

const reviews = async ({
  searchParams,
}: {
  searchParams: {
    page?: number;
    limit?: number;
    query?: string;
    rating?: number;
    productId?: string;
  };
}) => {
  const { error, data, meta } = await getAllReviews({
    page: searchParams.page,
    limit: searchParams.limit,
    query: searchParams.query,
    rating: searchParams.rating,
    productId: searchParams.productId,
  });
  
  if (error || !meta) return <Error error={error || "No Data found"} />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>
      <Reviews data={data?.items || []} meta={meta} />
    </div>
  );
};

export default reviews;
