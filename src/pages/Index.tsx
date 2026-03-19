import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Leaf, ShoppingBasket, Truck, Star, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const categories = [
  { name: "Vegetables", emoji: "🥬" },
  { name: "Fruits", emoji: "🍌" },
  { name: "Grains", emoji: "🌾" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Livestock", emoji: "🐄" },
];

const steps = [
  { icon: Leaf, title: "Farmers List Products", desc: "Local farmers upload fresh produce with prices and photos." },
  { icon: ShoppingBasket, title: "Buyers Browse & Order", desc: "Browse by category, place orders, and pay via Mobile Money." },
  { icon: Truck, title: "Fresh Delivery", desc: "Farmers confirm and deliver directly to buyers in Kabale." },
  { icon: Star, title: "Rate & Review", desc: "Buyers leave feedback to help the community grow." },
];

// Ugandan / East African central market images (Nakasero-style, Kampala)
const marketImages = [
  {
    url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1600&q=80&fit=crop",
    caption: "Nakasero Market, Kampala – Uganda's vibrant central market",
  },
  {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&fit=crop",
    caption: "Fresh produce from local Ugandan farms",
  },
  {
    url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80&fit=crop",
    caption: "Colorful vegetables at a modern East African market",
  },
  {
    url: "https://images.unsplash.com/photo-1577234843896-13e0e0c54c58?w=1600&q=80&fit=crop",
    caption: "Bustling urban market – fresh fruits and vegetables",
  },
  {
    url: "https://images.unsplash.com/photo-1519996658703-ee7b5f36ab1d?w=1600&q=80&fit=crop",
    caption: "Kabale farmers bringing produce to market",
  },
];

export default function Index() {
  const [currentBg, setCurrentBg] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % marketImages.length);
        setFading(false);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero with rotating background */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Background images */}
        {marketImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{
              backgroundImage: `url('${img.url}')`,
              opacity: i === currentBg ? (fading ? 0 : 1) : 0,
              zIndex: 0,
            }}
          />
        ))}

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,40,10,0.78) 0%, rgba(10,40,10,0.45) 60%, rgba(10,40,10,0.2) 100%)",
            zIndex: 1,
          }}
        />

        {/* Caption badge */}
        <div
          className="absolute bottom-4 right-4 text-xs text-white/70 bg-black/30 px-3 py-1 rounded-full"
          style={{ zIndex: 2 }}
        >
          📍 {marketImages[currentBg].caption}
        </div>

        {/* Dot indicators */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          style={{ zIndex: 2 }}
        >
          {marketImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFading(true);
                setTimeout(() => {
                  setCurrentBg(i);
                  setFading(false);
                }, 300);
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentBg ? "24px" : "8px",
                height: "8px",
                background: i === currentBg ? "#f59e0b" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 py-20 md:py-32 relative" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/30">
              <Leaf className="h-4 w-4 text-green-300" /> Fresh from Kabale farms
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              Farm Fresh Produce,{" "}
              <span className="text-amber-400">Directly to You</span>
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-lg drop-shadow">
              Connect with local farmers in Kabale, Uganda. Buy fresh vegetables, fruits, grains, dairy and livestock — all in one marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg">
                  Join as Buyer <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-white border-white/60 hover:bg-white/20 backdrop-blur-sm bg-transparent"
                >
                  Sell as Farmer <Leaf className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map(c => (
              <Link to="/products" key={c.name}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardContent className="pt-6 pb-4">
                    <span className="text-4xl block mb-2">{c.emoji}</span>
                    <span className="font-semibold">{c.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 font-serif">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 opacity-90 max-w-md mx-auto">Join hundreds of farmers and buyers in Kabale's largest online marketplace.</p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>© 2026 Kabale Farmers' Market. Built with local farmers.</p>
      </footer>
    </div>
  );
}
