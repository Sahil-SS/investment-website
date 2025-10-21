import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import TradingViewWidget from "@/components/tradingview-widget";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <HeroSection />
      <TradingViewWidget />
      <Footer />
    </main>
  );
}
