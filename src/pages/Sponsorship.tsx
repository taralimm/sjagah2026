import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, CreditCard, Gift, Heart, Info, Sparkles, Diamond, ArrowLeft, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { SPONSORSHIP_PACKAGES, PAYMENT_METHODS, CONTACT_FACEBOOK } from "../constants";

export default function Sponsorship() {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'gcash' | null>(null);

  const openGCash = () => {
    window.location.href = "gcash://";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="pt-32 pb-24 bg-ivory min-h-screen selection:bg-gold selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-denim-900/40 hover:text-denim-900 mb-12 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Back Home</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -z-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 text-gold mb-6"
          >
            <Sparkles size={20} />
            <span className="font-bold tracking-[0.3em] uppercase text-xs">The Power of Your Pledge</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-display font-light text-denim-900 mb-8"
          >
            Build the <span className="font-serif italic text-gold">Next Chapter</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-xl text-denim-900/60 font-light italic leading-relaxed"
          >
            Your sponsorship isn't just a donation—it's a statement of pride. Help us create a homecoming that honors our past and fuels the future of St. Joseph's Academy.
          </motion.p>
        </header>

        {/* Why Support Section */}
        <section className="mb-40">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { title: "Student Excellence", desc: "Your support directly funds scholarships and facility upgrades for the current Josephinians.", icon: <Sparkles size={32} /> },
                { title: "Campus Heritage", desc: "Help preserve the halls that shaped us. Every diamond pledge goes back into the school's growth.", icon: <Diamond size={32} /> },
                { title: "Batch Legacy", desc: "Cement your batch's place in history. Be remembered as the giants who paved the way back home.", icon: <Heart size={32} /> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-6"
                >
                   <div className="text-gold flex justify-center">{item.icon}</div>
                   <h3 className="font-serif text-2xl font-bold italic text-denim-900">{item.title}</h3>
                   <p className="text-denim-900/60 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Packages Grid */}
        <section className="mb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
            {SPONSORSHIP_PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.level}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col bg-white border border-denim-900/5 rounded-[3rem] p-10 relative shadow-xl shadow-denim-900/5 transition-all group hover:border-gold/50 hover:shadow-gold/10 ${
                  pkg.mostPrestigious ? "ring-2 ring-gold/40" : ""
                }`}
              >
                {pkg.mostPrestigious && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg animate-bounce">
                    Most Prestigious Role
                  </div>
                )}
                
                <div className="bg-denim-900 text-gold w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-12 transition-transform">
                  {pkg.level === "Platinum" && <Diamond size={24} />}
                  {pkg.level === "Diamond" && <Sparkles size={24} />}
                  {pkg.level === "Gold" && <Heart size={24} />}
                  {pkg.level === "Silver" && <Check size={24} />}
                </div>

                <h3 className="font-serif text-3xl font-bold mb-1 italic text-denim-900">{pkg.level}</h3>
                <div className="text-xl font-display font-medium text-gold mb-8">{pkg.price}</div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3 text-xs leading-relaxed text-denim-900/70">
                      <div className="bg-gold/10 p-1 rounded-full text-gold shrink-0 mt-0.5">
                        <Check size={10} strokeWidth={4} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => document.getElementById('payment-channels')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all text-center ${
                    pkg.mostPrestigious
                      ? "bg-gold text-white hover:bg-gold/90 shadow-lg shadow-gold/30"
                      : "bg-denim-900 text-white hover:bg-denim-800 shadow-lg shadow-denim-900/20"
                  }`}
                >
                  Pledge
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other Contributions - Bento Style */}
        <section className="mb-40 grid grid-cols-1 md:grid-cols-2 gap-10">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-denim-900 rounded-[3.5rem] p-12 text-ivory relative overflow-hidden group"
           >
              <div className="bg-gold/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 text-gold group-hover:rotate-12 transition-transform">
                <Gift size={32} />
              </div>
              <h2 className="font-serif text-4xl font-bold mb-6 italic">In-Kind Donations</h2>
              <p className="text-ivory/60 font-light text-lg leading-relaxed mb-10">
                We gladly welcome raffle prizes, staycation vouchers, gadgets, and appliances. Your items help make our program more rewarding.
              </p>
              <div className="flex flex-wrap gap-2">
                 {["RAFFLE", "GADGETS", "STAYCATIONS", "ELECTRONICS"].map(t => (
                   <span key={t} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest">{t}</span>
                 ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-white border border-denim-900/5 rounded-[3.5rem] p-12 text-denim-900 group"
           >
              <div className="bg-denim-900/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 text-gold group-hover:-rotate-12 transition-transform">
                <Heart size={32} />
              </div>
              <h2 className="font-serif text-4xl font-bold mb-6 italic text-gold">Open Donations</h2>
              <p className="text-denim-900/60 font-light text-lg leading-relaxed mb-10">
                No contribution is too small. If you'd like to contribute an open amount, we welcome your generosity with heartfelt gratitude.
              </p>
              <div className="p-6 bg-gold/5 border border-gold/10 rounded-3xl italic text-gold text-sm">
                "Every gift strengthens our Josephinian bonds and ensures a future for our shared legacy."
              </div>
           </motion.div>
        </section>

        {/* Payment Details */}
        <section id="payment-channels" className="bg-ivory py-24 border-y border-denim-900/5">
           <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                 <h2 className="text-4xl font-display font-light text-denim-900 mb-4 uppercase tracking-[0.2em]">Secure Channels</h2>
                 <p className="text-denim-900/40 text-xs font-bold uppercase tracking-widest">Select your preferred method of contribution</p>
              </div>

              {/* Selector Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                 <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-full font-display text-xs font-bold uppercase tracking-widest border-2 transition-all cursor-pointer ${
                       selectedMethod === 'bank'
                         ? "bg-denim-900 border-denim-900 text-white shadow-xl shadow-denim-900/25"
                         : "bg-white border-denim-900/10 text-denim-900 hover:border-denim-900/30 hover:bg-denim-900/5"
                    }`}
                 >
                    <CreditCard size={18} />
                    <span>Bank Transfer</span>
                 </button>
                 <button
                    onClick={() => setSelectedMethod('gcash')}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-full font-display text-xs font-bold uppercase tracking-widest border-2 transition-all cursor-pointer ${
                       selectedMethod === 'gcash'
                         ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/25"
                         : "bg-white border-blue-600/10 text-blue-600 hover:border-blue-600/30 hover:bg-blue-600/5"
                    }`}
                 >
                    <Diamond size={18} />
                    <span>GCash Mobile</span>
                 </button>
              </div>

              <div className="max-w-xl mx-auto">
                 <AnimatePresence mode="wait">
                    {selectedMethod === null ? (
                       <motion.div
                          key="empty"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center p-12 bg-white rounded-[3rem] border border-denim-900/5 shadow-xl shadow-denim-900/5"
                       >
                          <Info size={36} className="text-gold mx-auto mb-4 animate-pulse" />
                          <p className="text-lg text-denim-900/70 font-light leading-relaxed mb-1">
                             Select a channel above to retrieve payment instructions
                          </p>
                          <p className="text-xs text-denim-900/40">
                             Offline secure transactions with real-time support confirmation.
                          </p>
                       </motion.div>
                    ) : selectedMethod === 'bank' ? (
                       <motion.div
                          key="bank"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-8 p-10 bg-white rounded-[3rem] shadow-2xl shadow-denim-900/5 border border-denim-900/10"
                       >
                          <div className="flex items-center space-x-4 mb-4">
                             <div className="bg-denim-900 p-4 rounded-2xl text-white shadow-xl shadow-denim-900/20">
                                <CreditCard size={24} />
                             </div>
                             <div>
                                <h3 className="font-display font-bold text-lg uppercase tracking-widest text-denim-900">Bank Transfer</h3>
                                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Secure Account Details</p>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <div>
                                <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">Bank</p>
                                <p className="font-bold text-lg text-denim-900">{PAYMENT_METHODS.bank.name}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">Name</p>
                                <p className="font-bold text-lg text-denim-900">{PAYMENT_METHODS.bank.accountName}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">Account</p>
                                <p className="font-display text-4xl font-medium tracking-tight text-denim-900">{PAYMENT_METHODS.bank.accountNumber}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-denim-100/50 p-4 rounded-2xl">
                                   <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">SWIFT</p>
                                   <p className="font-mono text-xs text-denim-900">{PAYMENT_METHODS.bank.swiftCode}</p>
                                </div>
                                <div className="bg-gold/5 p-4 rounded-2xl">
                                   <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-1">CODE</p>
                                   <p className="font-mono text-xs text-gold font-bold">{PAYMENT_METHODS.bank.bankCode}</p>
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    ) : (
                       <motion.div
                          key="gcash"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-8 p-10 bg-white rounded-[3rem] shadow-2xl shadow-denim-900/5 border border-blue-600/10 flex flex-col"
                       >
                          <div className="flex items-center space-x-4 mb-4">
                             <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl shadow-blue-600/20">
                                <Diamond size={24} />
                             </div>
                             <div>
                                <h3 className="font-display font-bold text-lg uppercase tracking-widest text-blue-600">GCash Mobile</h3>
                                <p className="text-[10px] uppercase tracking-widest text-blue-600/70 font-bold">Fast & Convenient</p>
                             </div>
                          </div>
                           <div className="space-y-8 flex-grow">
                             <div>
                                <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">Name</p>
                                <p className="font-bold text-lg text-denim-900">{PAYMENT_METHODS.gcash.accountName}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-denim-900/30 uppercase tracking-widest mb-1">Mobile</p>
                                <p className="font-display text-5xl font-medium tracking-tighter text-blue-600">{PAYMENT_METHODS.gcash.mobileNumber}</p>
                             </div>
                             
                             <button 
                                type="button"
                                onClick={openGCash}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-blue-600/25 cursor-pointer transition-all mt-auto"
                             >
                                <Smartphone size={18} />
                                <span>Open GCash App</span>
                             </button>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Shared Verification Instructions Card */}
                 <AnimatePresence>
                    {selectedMethod !== null && (
                       <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.25 }}
                          className="mt-8 p-8 bg-gold/5 border border-gold/20 rounded-[2.5rem] shadow-xl shadow-denim-900/5 text-left"
                       >
                          <div className="flex items-start space-x-4">
                             <Info className="text-gold shrink-0 mt-0.5" size={20} />
                             <div className="space-y-1">
                                <h4 className="font-display font-bold text-[10px] uppercase tracking-widest text-denim-900">Verification Steps</h4>
                                <p className="text-xs text-denim-900/70 leading-relaxed">
                                   Please secure a screenshot or transaction slip of your transfer and send it to our <a href={CONTACT_FACEBOOK} target="_blank" rel="noopener noreferrer" className="font-bold underline text-gold hover:text-gold/80 transition-colors">Facebook team</a>. Our automated verification group will match your pledge with our records today.
                                </p>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
