import DashboardStats from "@/components/dashboard/dashboard-stats";

const Home = async () => {
  return (
    <div className="flex-col p-5 mt-7">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <DashboardStats />
    </div>
  );
};

export default Home;
