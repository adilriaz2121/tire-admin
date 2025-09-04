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
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <p className="text-gray-600">Manage your blog articles and content</p>
      </div>
      <Articles data={data?.items || []} meta={meta} />
    </div>
  );
};

export default articles;
