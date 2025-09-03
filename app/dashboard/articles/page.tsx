import React from "react";
import { Articles } from "@/components/articles";
import { getAllArticles } from "@/actions/article.action";
import Error from "@/components/error";

const articles = async ({
  searchParams,
}: {
  searchParams: { page?: number; limit?: number; query?: string };
}) => {
  const { error, data, meta } = await getAllArticles({
    page: searchParams.page,
    limit: searchParams.limit,
    query: searchParams.query,
  });
  if (error || !meta) return <Error error={error || "No Data found"} />;
  return <Articles data={data?.items || []} meta={meta} />;
};

export default articles;
