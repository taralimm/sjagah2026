import { motion } from "motion/react";
import { Sparkles, Diamond, ShoppingBag, ArrowLeft, Instagram, Camera } from "lucide-react";
import { Link } from "react-router-dom";

export default function Merch() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-denim-900/40 hover:text-denim-900 mb-12 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Back Home</span>
        </Link>

        {/* Hero */}
        <header className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 text-gold mb-6"
          >
            <ShoppingBag size={24} />
            <span className="font-bold tracking-[0.3em] uppercase text-xs">Official Collection</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-light text-denim-900 mb-8"
          >
            Curating <span className="font-serif italic text-gold">Magic.</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
             <div className="bg-denim-900 text-ivory inline-block px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[0.2em] mb-10 shadow-2xl shadow-denim-900/20">
                Coming Soon
             </div>
             <p className="text-denim-900/60 text-xl font-light italic leading-relaxed">
               Something truly grand is in the works. Our limited-edition Denim & Diamonds collection is currently being crafted for all alumnae.
             </p>
          </motion.div>
        </header>

        {/* Coming Soon Teasers (Abstract) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Apparel", icon: <Sparkles size={40} /> },
             { label: "Accessories", icon: <Diamond size={40} /> },
             { label: "Collectibles", icon: <ShoppingBag size={40} /> }
           ].map((teaser, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-white border border-denim-900/5 aspect-square rounded-[3rem] shadow-xl shadow-denim-900/5 flex flex-col items-center justify-center space-y-6 group hover:border-gold/30 transition-all"
             >
                <div className="text-gold/20 group-hover:text-gold transition-colors transform group-hover:scale-110 duration-500">
                  {teaser.icon}
                </div>
                <h3 className="font-serif text-2xl italic text-denim-900/40 group-hover:text-denim-900 transition-colors uppercase tracking-widest">{teaser.label}</h3>
             </motion.div>
           ))}
        </div>

        {/* Fun Interaction Section */}
        <section className="mt-32 p-16 md:p-24 bg-denim-900 rounded-[4rem] text-center text-ivory relative overflow-hidden">
           <div className="absolute bottom-0 right-0 p-12 text-gold/10 -rotate-12">
              <Diamond size={300} />
           </div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 italic">
                Want to vote on <br /> the merch?
              </h2>
              <p className="text-ivory/60 mb-12 font-light text-lg">
                Join our Facebook community to see the designs and vote for your favorites before they go live!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a 
                  href="https://www.facebook.com/SJAGAH2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-denim-900 px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center space-x-3 hover:bg-gold hover:text-white transition-all w-full sm:w-auto justify-center"
                >
                   <Instagram size={18} />
                   <span>Join the Vote</span>
                </a>
                <button className="bg-ivory/5 border border-ivory/10 hover:border-ivory/30 px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center space-x-3 transition-all w-full sm:w-auto justify-center">
                   <Camera size={18} />
                   <span>Sneak Peek</span>
                </button>
              </div>
           </div>
        </section>

        {/* Footer Text */}
        <div className="mt-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-denim-900/20">SJA Alumni Merch Committee</p>
        </div>
      </div>
    </div>
  );
}
