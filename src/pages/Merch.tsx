import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Upload, 
  X,
  Smartphone,
  Building2,
  Package,
  Calendar,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { PAYMENT_METHODS, MERCH_PAYMENT_METHODS } from "../constants";
// @ts-ignore
import sjaShirtImage from "../assets/images/sja_monogram_shirt_1780966648233.png";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: "monogram-shirt",
    name: "SJA Monogram Shirt",
    price: 350,
    description: "Premium heavyweight white cotton crewneck t-shirt featuring a stylized vertical navy blue alignment of interlocking SJA monogram letters",
    image: "/merch-shirt.jpg"
  },
  {
    id: "cap",
    name: "SJA Baseball Cap",
    price: 500,
    description: "Navy Blue Baseball cap with embroidered SJA logo",
    image: "/SJA Merch BB Cap.jpg"
  },
  {
    id: "running-cap",
    name: "SJA Running Cap",
    price: 500,
    description: "Lightweight, breathable dry-fit running cap with SJA logo",
    image: "/SJA Merch Running Cap.jpg"
  },
  {
    id: "umbrella",
    name: "SJA J-Type Umbrella",
    price: 500,
    description: "Navy blue J type umbrella with SJA logo",
    image: "/SJA Merch Umbrella.jpg"
  }
];

type View = "catalog" | "checkout" | "success";

export default function Merch() {
  const [view, setView] = useState<View>("catalog");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    facebookName: "",
    deliveryOption: "claim", // 'deliver' | 'claim'
    address: "",
    notes: "",
    paymentMethod: "gcash" // 'gcash' | 'bank'
  });
  
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), 
    [cart]
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      setSubmitError("Please upload payment proof first.");
      return;
    }

    setUploading(true);
    setSubmitError(null);

    try {
      // 1. Upload proof
      const proofFormData = new FormData();
      proofFormData.append("proof", proofFile);
      
      const uploadRes = await fetch("/api/upload-proof", {
        method: "POST",
        body: proofFormData
      });
      
      if (!uploadRes.ok) {
        let errMsg = "Failed to upload payment proof";
        try {
          const errData = await uploadRes.json();
          if (errData && errData.error) errMsg = `Failed to upload payment proof: ${errData.error}`;
        } catch (e) {}
        throw new Error(errMsg);
      }
      const { url: proofUrl } = await uploadRes.json();

      // 2. Submit order
      const orderPayload = {
        customer_name: formData.fullName,
        mobile: formData.mobileNumber,
        facebook: formData.facebookName,
        delivery_option: formData.deliveryOption,
        address: formData.deliveryOption === "deliver" ? formData.address : "N/A (Claim on Event)",
        notes: formData.notes,
        payment_method: formData.paymentMethod,
        proof_url: proofUrl,
        items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        total_amount: cartTotal
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        let errMsg = "Failed to submit order";
        try {
          const errData = await orderRes.json();
          if (errData && errData.error) errMsg = `Failed to submit order: ${errData.error}`;
        } catch (e) {}
        throw new Error(errMsg);
      }
      const { orderId } = await orderRes.json();
      
      setOrderId(orderId);
      setView("success");
      setCart([]);
      localStorage.removeItem("sja_cart"); // Optional persistence
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred during submission.");
    } finally {
      setUploading(false);
    }
  };

  const openGCash = () => {
    // Attempt deep link
    window.location.href = "gcash://";
    // Fallback info is already on screen
  };

  if (view === "success") {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-ivory flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-denim-900/5 border border-denim-900/5"
        >
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="font-serif text-4xl font-bold text-denim-900 mb-4 italic">Order Received!</h1>
          <p className="text-denim-900/60 mb-8 font-light">
            Thank you for your order, Josephinian! Your payment will be verified within 24 hours.
          </p>
          
          <div className="bg-denim-100/50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-denim-900/40">Order ID</span>
              <span className="font-display font-bold text-denim-900">{orderId}</span>
            </div>
            <p className="text-[10px] text-denim-900/40 uppercase tracking-widest">Keep this ID for your records.</p>
          </div>

          <Link to="/" className="inline-block bg-denim-900 text-ivory px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-denim-800 transition-all">
            Back Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {view === 'catalog' ? (
          <>
            {/* Header Navigation & Open Cart Trigger */}
            <div className="flex justify-between items-center mb-12 border-b border-denim-900/5 pb-6">
              <Link to="/" className="inline-flex items-center space-x-2 text-denim-900/60 hover:text-denim-900 text-xs font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft size={16} />
                <span>Return Home</span>
              </Link>
              
              <button 
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center space-x-2 bg-white hover:bg-denim-900 hover:text-white text-denim-900 border border-denim-900/10 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm cursor-pointer"
              >
                <ShoppingBag size={16} className="text-gold" />
                <span>View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
              </button>
            </div>

            <header className="mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 bg-gold/10 text-gold px-4 py-1.5 rounded-full mb-6"
              >
                <ShoppingBag size={14} />
                <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Homecoming Exclusive Souvenirs</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-light text-denim-900 mb-6 font-semibold">
                Homecoming <span className="font-serif italic text-gold font-normal">Memorabilia.</span>
              </h1>
              <p className="text-denim-900/60 max-w-2xl mx-auto font-light leading-relaxed">
                Commemorative pre-order collection for the upcoming 2026 Grand Alumnae Homecoming event. <br />
                <span className="text-[10px] text-denim-900/40 uppercase tracking-widest font-bold block mt-2">(Not affiliated with official SJA school stores • Organised by Alumni Host Batches)</span>
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
              {PRODUCTS.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-denim-900/5 border border-denim-900/5 group"
                >
                  <div className="aspect-[4/3] bg-denim-100 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/800x600/1a233e/ffffff?text=" + product.name;
                      }}
                    />
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                        <span className="font-display font-bold text-denim-900">₱{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="font-serif text-2xl font-bold text-denim-900 mb-3 italic">{product.name}</h3>
                    <p className="text-denim-900/60 font-light text-sm mb-8 leading-relaxed">
                      {product.description}
                    </p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-denim-900 text-ivory py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 hover:bg-gold transition-all"
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setView("catalog")}
              className="inline-flex items-center space-x-2 text-denim-900/40 hover:text-denim-900 mb-12 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-[10px] uppercase tracking-widest">Back to products</span>
            </button>

            <form onSubmit={handleCheckout} className="space-y-12">
              <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-denim-900/5 border border-denim-900/5">
                <h2 className="font-serif text-3xl font-bold text-denim-900 mb-8 italic flex items-center">
                   <ChevronRight className="text-gold mr-2" />
                   Customer Details
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-2 px-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Juana Dela Cruz"
                        className="w-full bg-ivory/50 border border-denim-900/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-colors"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-2 px-2">Mobile Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="0917XXXXXXX"
                        className="w-full bg-ivory/50 border border-denim-900/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-colors"
                        value={formData.mobileNumber}
                        onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-2 px-2">Facebook Name / Profile Link</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-ivory/50 border border-denim-900/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-colors"
                      value={formData.facebookName}
                      onChange={e => setFormData({ ...formData, facebookName: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-denim-900/5 border border-denim-900/5">
                <h2 className="font-serif text-3xl font-bold text-denim-900 mb-8 italic flex items-center">
                   <ChevronRight className="text-gold mr-2" />
                   Delivery Option
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryOption: "claim" })}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${
                      formData.deliveryOption === "claim" 
                      ? "border-gold bg-gold/5" 
                      : "border-denim-900/5 bg-ivory/50 opacity-60"
                    }`}
                  >
                    <Calendar className="text-gold mb-4" />
                    <span className="font-bold text-sm uppercase tracking-widest text-denim-900">Claim on Event</span>
                    <span className="text-[10px] text-denim-900/40 mt-1 uppercase">July 18, 2026</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryOption: "deliver" })}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${
                      formData.deliveryOption === "deliver" 
                      ? "border-gold bg-gold/5" 
                      : "border-denim-900/5 bg-ivory/50 opacity-60"
                    }`}
                  >
                    <Package className="text-gold mb-4" />
                    <span className="font-bold text-sm uppercase tracking-widest text-denim-900">Deliver to Address</span>
                    <span className="text-[10px] text-denim-900/40 mt-1 uppercase">Standard Rates Apply</span>
                  </button>
                </div>
                
                {formData.deliveryOption === "deliver" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-2 px-2">Delivery Address</label>
                    <textarea 
                      required
                      className="w-full bg-ivory/50 border border-denim-900/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-colors h-32 resize-none"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </motion.div>
                )}

                <div className="mt-6">
                  <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-2 px-2">Additional Notes</label>
                  <input 
                    type="text" 
                    placeholder="E.g. landmark nearby, preferred courier"
                    className="w-full bg-ivory/50 border border-denim-900/5 rounded-2xl px-6 py-4 outline-none focus:border-gold/50 transition-colors"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </section>

              <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-denim-900/5 border border-denim-900/5">
                <h2 className="font-serif text-3xl font-bold text-denim-900 mb-8 italic flex items-center">
                   <ChevronRight className="text-gold mr-2" />
                   Payment Details
                </h2>
                <div className="bg-denim-900 text-ivory rounded-[2.5rem] p-8 mb-8 overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 text-gold/10">
                     <CreditCard size={120} />
                   </div>
                   <div className="relative z-10">
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-6">Total Amount to Pay</p>
                     <p className="text-6xl font-display font-light tracking-tighter">₱{cartTotal.toLocaleString()}.00</p>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                    <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest mb-1">GCash Account Name</p>
                    <p className="font-bold text-lg text-blue-900">{MERCH_PAYMENT_METHODS.gcash.accountName}</p>
                    <div className="mt-4">
                      <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest mb-1">GCash Number</p>
                      <p className="font-display text-4xl font-medium tracking-tighter text-blue-600">{MERCH_PAYMENT_METHODS.gcash.mobileNumber}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={openGCash}
                    className="w-full bg-blue-600 text-white py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/20"
                  >
                    <Smartphone size={18} />
                    <span>Open GCash App</span>
                  </button>
                </div>

                <div className="mt-12">
                   <label className="block text-[10px] font-bold text-denim-900/30 uppercase tracking-[0.2em] mb-4 px-2">Upload Proof of Payment</label>
                   <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all text-center ${proofFile ? 'border-green-500 bg-green-50' : 'border-denim-900/10 hover:border-gold/50'}`}>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) setProofFile(file);
                        }}
                      />
                      {proofFile ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 className="text-green-500 mb-4" size={48} />
                          <p className="font-bold text-green-900">{proofFile.name}</p>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setProofFile(null); }} className="mt-2 text-xs text-red-500 underline uppercase tracking-widest">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="text-denim-900/20 mb-4" size={48} />
                          <p className="text-denim-900/60 text-sm italic font-light">Drag and drop or click to upload screenshot</p>
                        </div>
                      )}
                   </div>
                </div>
              </section>

              {submitError && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center space-x-3 text-red-900">
                   <AlertCircle className="shrink-0" />
                   <p className="text-sm font-medium">{submitError}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={uploading}
                className={`w-full bg-denim-900 text-ivory py-6 rounded-full font-bold uppercase text-sm tracking-[0.2em] shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold'}`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Complete Preorder</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-denim-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-denim-900/5 flex justify-between items-center">
                <h2 className="font-serif text-2xl font-bold italic text-denim-900">Your Basket</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-denim-900/40 hover:text-denim-900"><X /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="text-center py-20 opacity-40 italic font-light">Your basket is empty</div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex space-x-6 items-center border-b border-denim-900/5 pb-6 last:border-none last:pb-0">
                        <div className="w-20 h-24 bg-denim-100 rounded-2xl overflow-hidden shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/150x200/1a233e/ffffff?text=" + item.name;
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-denim-900 text-sm uppercase tracking-tight">{item.name}</h4>
                          <p className="text-gold font-display font-bold text-lg mb-3">₱{(item.price * item.quantity).toLocaleString()}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-denim-900/5 rounded-full overflow-hidden h-8">
                              <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-denim-100 transition-colors"><Minus size={12} /></button>
                              <span className="px-2 text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-denim-100 transition-colors"><Plus size={12} /></button>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Nice user prompt asking to add more products */}
                    <div className="p-5 bg-gold/5 border border-gold/15 rounded-2xl flex items-start gap-3 mt-8">
                      <Sparkles className="text-gold shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-denim-900 uppercase tracking-widest">Adding More Items?</p>
                        <p className="text-[11px] text-denim-900/60 leading-relaxed text-left">
                          Simply close this cart drawer! Your selected items will remain in your basket so you can continue browsing and add caps, umbrellas, or event gear.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-ivory/50 border-t border-denim-900/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-denim-900/40 font-bold uppercase tracking-[0.2em] text-xs">Subtotal</span>
                  <span className="text-2xl font-display font-light text-denim-900">₱{cartTotal.toLocaleString()}.00</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => { setView("checkout"); setIsCartOpen(false); }}
                  className="w-full bg-denim-900 text-white py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-gold transition-all disabled:opacity-30 flex items-center justify-center space-x-2"
                >
                  <span>Checkout Now</span>
                  <ArrowLeft size={16} className="rotate-180" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Checkout Bar */}
      {cart.length > 0 && view === 'catalog' && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:hidden"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-denim-900 text-white py-6 rounded-[2rem] font-bold uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-between px-10 border border-white/10"
          >
            <span>Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <div className="flex items-center space-x-2">
              <span className="text-gold">₱{cartTotal.toLocaleString()}</span>
              <ChevronRight size={16} />
            </div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
