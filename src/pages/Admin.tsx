import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Package, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  History,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Lock
} from "lucide-react";

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  mobile: string;
  facebook: string;
  delivery_option: string;
  total_amount: number;
  status: string;
  created_at: string;
  proof_url: string;
  items: { name: string; quantity: number; price: number }[];
  address: string;
  notes: string;
}

const STATUS_COLORS: Record<string, string> = {
  "Pending Verification": "bg-amber-100 text-amber-700",
  "Paid": "bg-green-100 text-green-700",
  "For Delivery": "bg-blue-100 text-blue-700",
  "Claimed": "bg-purple-100 text-purple-700",
  "Completed": "bg-slate-100 text-slate-700"
};

const STATUS_LIST = ["Pending Verification", "Paid", "For Delivery", "Claimed", "Completed"];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${pwd}` }
      });
      if (res.ok) {
        setOrders(await res.json());
        setIsAuthenticated(true);
        localStorage.setItem("admin_pwd", pwd);
      } else if (res.status === 401) {
        const data = await res.json();
        const msg = data.details || "Invalid Password";
        alert(`Access Denied: ${msg}`);
      } else {
        alert(`Server Error: ${res.status}. Your backend might not be configured correctly on Vercel.`);
      }
    } catch (err) {
      console.error(err);
      alert("Connection Error: Could not reach the server. Please check your deployment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("admin_pwd");
    if (saved) {
      setPassword(saved);
      fetchOrders(saved);
    }
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === id ? updated : o));
        if (selectedOrder?.id === id) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    const s = search.toLowerCase();
    const matchesSearch = o.order_id.toLowerCase().includes(s) || o.customer_name.toLowerCase().includes(s);
    const matchesFilter = filter === "All" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-denim-900 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl">
          <div className="bg-gold/10 text-gold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-denim-900 mb-2 italic">Admin Gate</h1>
          <p className="text-denim-900/40 text-xs uppercase tracking-widest font-bold mb-8">SJA Homecoming Committee Only</p>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="w-full bg-ivory border border-denim-900/5 rounded-2xl px-6 py-4 mb-4 text-center outline-none focus:border-gold transition-all"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders(password)}
          />
          <button 
            onClick={() => fetchOrders(password)}
            disabled={loading}
            className="w-full bg-denim-900 text-ivory py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gold transition-all flex items-center justify-center space-x-2"
          >
            {loading ? <span>Verifying...</span> : <span>Access Dashboard</span>}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-gold mb-2">
              <ShieldCheck size={18} />
              <span className="font-bold text-[10px] uppercase tracking-widest">Committee Access</span>
            </div>
            <h1 className="text-5xl font-display font-light text-denim-900">Order <span className="font-serif italic text-gold">Management</span></h1>
          </div>
          
          <div className="flex items-center bg-white rounded-full p-2 shadow-xl shadow-denim-900/5 border border-denim-900/5">
             <div className="flex items-center space-x-2 px-4 py-2 bg-denim-100 text-denim-900 rounded-full">
               <Package size={14} />
               <span className="font-bold text-[10px]">{orders.length} Total</span>
             </div>
             <div className="flex items-center space-x-2 px-4 py-2 text-denim-900/40 rounded-full">
               <BarChart3 size={14} />
               <span className="font-bold text-[10px]">₱{orders.reduce((s, o) => s + o.total_amount, 0).toLocaleString()}</span>
             </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
           {/* List */}
           <div className="lg:w-2/3 space-y-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-denim-900/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search Order ID or Customer Name..."
                    className="w-full bg-white border border-denim-900/5 rounded-full px-14 py-4 outline-none focus:border-gold shadow-sm transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-denim-900/5 rounded-full px-8 py-4 pr-12 outline-none focus:border-gold shadow-sm font-bold text-[10px] uppercase tracking-widest"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Filter className="absolute right-6 top-1/2 -translate-y-1/2 text-denim-900/20 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <motion.div 
                    layoutId={order.id}
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'border-gold ring-1 ring-gold/20' : 'border-denim-900/5 hover:border-gold/30 shadow-lg shadow-denim-900/5'}`}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="bg-denim-100 w-12 h-12 rounded-2xl flex items-center justify-center text-denim-900">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-display font-bold text-denim-900">{order.order_id}</span>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-serif italic font-bold text-denim-900/60">{order.customer_name}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                       <div className="text-right">
                         <p className="text-[10px] text-denim-900/30 font-bold uppercase tracking-widest mb-1">Total</p>
                         <p className="font-display font-bold text-denim-900">₱{order.total_amount.toLocaleString()}</p>
                       </div>
                       <ChevronRight className={`text-denim-900/10 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90 text-gold' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           {/* Detail View */}
           <div className="lg:w-1/3">
             <div className="sticky top-24">
                {selectedOrder ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={selectedOrder.id}
                    className="bg-white rounded-[3rem] p-10 border border-denim-900/5 shadow-2xl shadow-denim-900/20"
                  >
                    <div className="flex justify-between items-center mb-8">
                       <h2 className="font-serif text-2xl font-bold italic text-denim-900">{selectedOrder.order_id}</h2>
                       <button onClick={() => setSelectedOrder(null)} className="text-denim-900/20 hover:text-denim-900"><XCircle /></button>
                    </div>

                    <div className="mb-10 aspect-[4/5] rounded-[2rem] overflow-hidden bg-ivory border border-denim-900/5 group relative">
                       <img src={selectedOrder.proof_url} alt="Proof" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       <a 
                        href={selectedOrder.proof_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="absolute inset-0 bg-denim-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-2"
                       >
                         <ExternalLink size={20} />
                         <span className="font-bold text-xs uppercase tracking-widest">Full Proof</span>
                       </a>
                    </div>

                    <div className="space-y-6 mb-10">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <p className="text-[10px] font-bold text-denim-900/30 uppercase mb-1">Customer</p>
                           <p className="text-sm font-bold text-denim-900">{selectedOrder.customer_name}</p>
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-denim-900/30 uppercase mb-1">Mobile</p>
                           <p className="text-sm font-bold text-denim-900">{selectedOrder.mobile}</p>
                         </div>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-denim-900/30 uppercase mb-1">Delivery / Address</p>
                         <p className="text-sm font-medium text-denim-900/70">{selectedOrder.address}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-denim-900/30 uppercase mb-1">Items</p>
                         <ul className="space-y-2">
                           {selectedOrder.items.map((it, idx) => (
                             <li key={idx} className="text-xs text-denim-900/60 py-2 border-b border-denim-900/5 flex justify-between">
                               <span>{it.quantity}x {it.name}</span>
                               <span className="font-bold">₱{(it.price * it.quantity).toLocaleString()}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-denim-900/30 uppercase mb-4 text-center">Update Status</p>
                       <div className="flex flex-wrap gap-2">
                         {STATUS_LIST.map(st => (
                           <button 
                            key={st}
                            onClick={() => updateStatus(selectedOrder.id, st)}
                            className={`flex-grow px-4 py-3 rounded-2xl text-[8px] font-bold uppercase tracking-widest transition-all ${selectedOrder.status === st ? 'bg-gold text-white shadow-lg shadow-gold/30' : 'bg-ivory text-denim-900/40 hover:bg-denim-100'}`}
                           >
                             {st}
                           </button>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[600px] bg-ivory/50 border-2 border-dashed border-denim-900/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                     <History size={48} className="mb-6" />
                     <h3 className="font-serif text-xl italic font-bold mb-2">Order Feed</h3>
                     <p className="text-xs font-light">Select an order to view payment proof and update fulfillment status.</p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
