import { getAllArticles } from "@/actions/article.action";
import { getAllCoupons } from "@/actions/coupon.action";

const Home = async () => {
  const [articlesResult, couponsResult] = await Promise.all([
    getAllArticles({ limit: 5 }),
    getAllCoupons({ limit: 5 })
  ]);

  const articlesCount = articlesResult.meta?.total || 0;
  const couponsCount = couponsResult.meta?.total || 0;

  return (
    <div className="flex-col p-5 mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Articles</h3>
          <p className="text-3xl font-bold text-blue-600">{articlesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Coupons</h3>
          <p className="text-3xl font-bold text-green-600">{couponsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Coupons</h3>
          <p className="text-3xl font-bold text-orange-600">
            {couponsResult.data?.items.filter(c => c.isActive).length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Recent Articles</h3>
          <p className="text-3xl font-bold text-purple-600">
            {articlesResult.data?.items.length || 0}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {articlesResult.data?.items.map((article) => (
              <div key={article.id} className="border-b pb-2">
                <h4 className="font-medium text-gray-900">{article.title}</h4>
                <p className="text-sm text-gray-500">{article.detail}</p>
                <p className="text-xs text-gray-400">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Coupons</h3>
          <div className="space-y-3">
            {couponsResult.data?.items.map((coupon) => (
              <div key={coupon.id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{coupon.code}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`} off
                </p>
                <p className="text-xs text-gray-400">
                  Used: {coupon.usedCount} times
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
