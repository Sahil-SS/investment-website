import Sidebar from "@/components/user-dashboard/Sidebar";
import DashboardHeader from "@/components/user-dashboard/DashboardHeader";
import OrderSection from "@/components/user-dashboard/OrderSection";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a] text-white relative overflow-hidden">
      <Sidebar active="home" />

      <main className="flex-1 p-10 relative z-10">
        <DashboardHeader />
        <OrderSection />
      </main>

      <div className="absolute w-[600px] h-[600px] bg-green-700/10 rounded-full blur-3xl top-40 left-1/2 -z-0" />
    </div>
  );
}
