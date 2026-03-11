import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Star,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Market", path: "/market", icon: ShoppingBag },
    { name: "Send", path: "/send", icon: Package },
    { name: "Logistics", path: "/logistics", icon: Truck },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="hidden md:flex items-center space-x-2">
            <span className="text-gold font-bold text-xl tracking-tighter uppercase">Phiroz</span>
            <span className="text-white font-light text-xl tracking-tighter uppercase">Connect</span>
          </Link>

          <div className="flex justify-around w-full md:w-auto md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
                  location.pathname === item.path ? "text-gold" : "text-white/60 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/account"
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
                location.pathname === "/account" ? "text-gold" : "text-white/60 hover:text-white"
              )}
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProductCard = ({ product }: { product: any, key?: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group"
  >
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={product.image_url} 
        alt={product.name} 
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-gold font-bold uppercase tracking-wider">
        {product.category}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-white font-medium text-sm mb-1 truncate">{product.name}</h3>
      <div className="flex justify-between items-end">
        <span className="text-gold font-bold text-lg">K{product.price.toFixed(2)}</span>
        <button className="bg-gold text-black p-2 rounded-full hover:bg-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

// --- Pages ---

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter leading-none"
          >
            EVERYTHING <br /> <span className="text-gold">DELIVERED.</span>
          </motion.h1>
          <p className="text-white/70 max-w-md mb-8 text-lg">
            The market in your pocket. Shop, send, and deliver across Zambia with Phiroz Connect.
          </p>
          <div className="flex space-x-4">
            <Link to="/market" className="bg-gold text-black px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-white transition-all">
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { title: "Send Package", icon: Package, color: "bg-blue-500/10 text-blue-500", path: "/send" },
          { title: "Local Delivery", icon: Truck, color: "bg-gold/10 text-gold", path: "/logistics" },
          { title: "Pay Bills", icon: CreditCard, color: "bg-emerald-500/10 text-emerald-500", path: "/payments" },
          { title: "Support", icon: MessageCircle, color: "bg-purple-500/10 text-purple-500", path: "/support" },
        ].map((action) => (
          <Link key={action.title} to={action.path} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-gold/50 transition-all group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", action.color)}>
              <action.icon className="w-6 h-6" />
            </div>
            <h3 className="text-white font-medium">{action.title}</h3>
            <p className="text-white/40 text-xs mt-1">Fast & Secure</p>
          </Link>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Featured Products</h2>
          <Link to="/market" className="text-gold text-sm font-medium flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

const MarketScreen = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const categories = ["All", "Groceries", "Clothing", "Electronics", "Household"];

  const filteredProducts = category === "All" 
    ? products 
    : products.filter((p: any) => p.category === category);

  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-4xl font-bold text-white tracking-tighter">Marketplace</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-zinc-900 border border-white/10 rounded-full py-3 pl-10 pr-6 text-white w-full md:w-80 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              category === cat ? "bg-gold text-black" : "bg-zinc-900 text-white/60 hover:text-white border border-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredProducts.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

const LogisticsScreen = () => {
  const [type, setType] = useState<"local" | "intercity">("local");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [status, setStatus] = useState<any>(null);

  const handleBook = async () => {
    const res = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, pickup, destination })
    });
    const data = await res.json();
    alert(`Booking Successful! Tracking ID: ${data.trackingId}`);
    setTrackingId(data.trackingId);
  };

  const handleTrack = async () => {
    const res = await fetch(`/api/tracking/${trackingId}`);
    if (res.ok) {
      const data = await res.json();
      setStatus(data);
    } else {
      alert("Tracking ID not found");
    }
  };

  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white tracking-tighter mb-8 text-center">Logistics & Delivery</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Truck className="w-6 h-6 text-gold" />
            <span>Book a Delivery</span>
          </h2>

          <div className="flex space-x-2 mb-6">
            <button 
              onClick={() => setType("local")}
              className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all", type === "local" ? "bg-gold text-black" : "bg-black text-white/40")}
            >
              Local (Lusaka)
            </button>
            <button 
              onClick={() => setType("intercity")}
              className={cn("flex-1 py-2 rounded-xl text-sm font-bold transition-all", type === "intercity" ? "bg-gold text-black" : "bg-black text-white/40")}
            >
              Intercity
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Pickup Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input 
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  placeholder="Street, Area, City" 
                  className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input 
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Street, Area, City" 
                  className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <button 
              onClick={handleBook}
              className="w-full bg-gold text-black py-4 rounded-xl font-bold hover:bg-white transition-all mt-4"
            >
              Calculate & Book
            </button>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Search className="w-6 h-6 text-gold" />
            <span>Track Shipment</span>
          </h2>
          <div className="space-y-4">
            <input 
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID (e.g. PHZ-XXXXXX)" 
              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
            />
            <button 
              onClick={handleTrack}
              className="w-full border border-gold text-gold py-4 rounded-xl font-bold hover:bg-gold hover:text-black transition-all"
            >
              Track Status
            </button>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-black rounded-2xl border border-white/5"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-white/40 uppercase font-bold">Status</span>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {status.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <p className="text-sm text-white">{status.pickup_address}</p>
                  </div>
                  <div className="w-px h-6 bg-white/10 ml-1" />
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm text-white">{status.destination_address}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentsScreen = () => {
  const services = [
    { name: "Airtime", icon: "📱", provider: "MTN, Airtel, Zamtel" },
    { name: "Electricity", icon: "⚡", provider: "ZESCO Tokens" },
    { name: "Water", icon: "💧", provider: "LWSC" },
    { name: "TV", icon: "📺", provider: "DSTV, GOtv, TopStar" },
  ];

  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white tracking-tighter mb-4">Payment Hub</h1>
      <p className="text-white/60 mb-12">Pay for services directly with Mobile Money or Bank Card.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.name} className="bg-zinc-900 border border-white/5 p-6 rounded-3xl flex items-center space-x-6 hover:border-gold/30 transition-all cursor-pointer group">
            <div className="text-4xl bg-black w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
              <p className="text-white/40 text-sm">{s.provider}</p>
            </div>
            <div className="ml-auto">
              <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-gold" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gold/10 border border-gold/20 p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-gold mb-4">Supported Methods</h2>
        <div className="flex flex-wrap gap-4">
          {["MTN MoMo", "Airtel Money", "Zamtel Kwacha", "VISA", "Mastercard"].map(m => (
            <span key={m} className="bg-black/50 px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/5">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccountScreen = () => {
  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mb-4 border-4 border-black shadow-2xl">
          <User className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-white">Emmanuel Nkole</h1>
        <p className="text-white/40">Young Phiroz Elite Member</p>
      </div>

      <div className="space-y-4">
        {[
          { label: "My Orders", icon: ShoppingBag },
          { label: "Delivery History", icon: Truck },
          { label: "Payment Methods", icon: CreditCard },
          { label: "Vendor Dashboard", icon: ShieldCheck, highlight: true },
          { label: "Settings", icon: Menu },
        ].map((item) => (
          <button 
            key={item.label}
            className={cn(
              "w-full flex items-center justify-between p-5 rounded-2xl border transition-all",
              item.highlight ? "bg-gold text-black border-gold" : "bg-zinc-900 text-white border-white/5 hover:border-white/20"
            )}
          >
            <div className="flex items-center space-x-4">
              <item.icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40" />
          </button>
        ))}
      </div>

      <button className="w-full mt-12 py-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
        Sign Out
      </button>
    </div>
  );
};

const SupportScreen = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Phiroz AI. How can I help you with your marketplace or delivery needs today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-8 md:pt-24 px-4 max-w-2xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-3xl font-bold text-white mb-6">Customer Support</h1>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm",
              m.role === "user" ? "bg-gold text-black font-medium" : "bg-zinc-900 text-white border border-white/5"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask about your order, delivery, or marketplace..." 
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-gold"
        />
        <button 
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-black p-2 rounded-xl hover:bg-white transition-all"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/market" element={<MarketScreen />} />
            <Route path="/logistics" element={<LogisticsScreen />} />
            <Route path="/send" element={<LogisticsScreen />} />
            <Route path="/payments" element={<PaymentsScreen />} />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/support" element={<SupportScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
