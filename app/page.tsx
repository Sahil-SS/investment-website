import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import TradingViewWidget from "@/components/tradingview-widget";
import Navbar from "@/components/navbar";
import WhyChooseSection from "@/components/why-choose-us";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <HeroSection />
      <TradingViewWidget />
      <WhyChooseSection />
      <Footer />
    </main>
  );
}
