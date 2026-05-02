import { motion } from "motion/react";
import { ArrowRight, Calendar, MapPin, Sparkles, Facebook, Heart, Diamond, Info, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_FACEBOOK, REGISTRATION_URL } from "../constants";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-ivory selection:bg-denim-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-ivory via-ivory/80 to-ivory"></div>
          {/* Subtle noise/texture or just clean background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-denim-900/5 px-4 py-2 rounded-full mb-8 border border-denim-900/10">
              <Sparkles className="text-gold h-4 w-4" />
              <span className="text-denim-900 font-bold text-[10px] uppercase tracking-[0.3em]">Denim & Diamonds • 2026</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-5xl md:text-8xl font-light text-denim-900 leading-[0.95] mb-10 tracking-tight"
            >
              St. Joseph’s Academy <br />
              <span className="font-serif italic text-gold font-normal">Grand Alumni</span><br />
              Homecoming
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-12 py-6 border-y border-denim-900/5">
              <div className="flex items-center space-x-3">
                <Calendar className="text-gold h-5 w-5" />
                <span className="font-display font-medium text-lg uppercase tracking-wider">July 18, 2026</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-denim-900/10"></div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-gold h-5 w-5" />
                <span className="font-display font-medium text-lg uppercase tracking-wider">Mandaue City</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-denim-900 hover:bg-denim-800 text-ivory px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl shadow-denim-900/20 flex items-center justify-center space-x-3"
              >
                <span>Register Now</span>
                <ArrowRight size={18} />
              </a>
              <Link
                to="/sponsorship"
                className="bg-white border border-denim-900/10 hover:border-gold/50 text-denim-900 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-sm flex items-center justify-center"
              >
                Become a Sponsor
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-16 flex items-center justify-center space-x-4">
               <img src="/necktie logo_bg_fixed.png" alt="SJA Logo" className="h-14 w-14 object-contain opacity-80" />
               <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-denim-900/40">Hosted By</p>
                  <p className="font-serif italic text-denim-900">Elem Batch '97 & HS Batch '01</p>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome Section - Vibe Coded */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800" 
                  alt="People celebrating at a gala" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-denim-900/40 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 bg-gold p-8 rounded-full shadow-2xl text-ivory">
                <Diamond size={40} className="animate-pulse" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="font-display text-4xl md:text-6xl font-light text-denim-900 leading-tight">
                   Welcome Home, <br />
                   <span className="font-serif italic text-gold font-normal">Josephinians.</span>
                </h2>
                <div className="w-20 h-1 bg-gold rounded-full"></div>
              </div>

              <div className="space-y-6 text-xl text-denim-900/70 font-light leading-relaxed relative">
                <p>
                  The Grand Alumni Homecoming is more than just an event; it's a journey back to the roots that shaped us. It's a time to celebrate the shared memories, the laughter in the hallways, and the enduring spirit of our beloved academy.
                </p>
                <p>
                  Whether you walked the stage decades ago or are a more recent graduate, this homecoming is your opportunity to reconnect across batches, share your stories, and witness how our community continues to grow and thrive.
                </p>
              </div>

              <div className="pt-6 flex items-center space-x-3 text-denim-900 font-bold uppercase tracking-widest text-xs">
                <Sparkles size={18} className="text-gold" />
                <span>Celebrating the Legacy of All SJA Alumni</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Host Batches Section */}
      <section className="py-32 bg-denim-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <header className="max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-light mb-4 text-denim-900">Your <span className="font-serif italic text-gold">Host Batches</span></h2>
            <p className="text-denim-900/60 leading-relaxed font-light">Leading the way for a spectacular 2026 homecoming. We can't wait to see you there!</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-denim-900/5 text-center relative group"
            >
              <div className="absolute top-0 right-0 p-8 text-gold opacity-5">
                <Sparkles size={120} />
              </div>
              <div className="bg-denim-900 text-ivory w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-12 transition-transform shadow-lg">
                <span className="font-display text-2xl font-bold">97</span>
              </div>
              <h3 className="font-serif text-3xl font-bold mb-4 italic text-denim-900">Elementary Dept</h3>
              <p className="text-denim-900/60 font-light mb-8 italic">Co-host Batch 1997</p>
              <p className="text-sm text-denim-900/80 leading-relaxed mb-8">
                Leading the elementary alumni with spirit and grace. Dedicated to creating a nostalgic journey for our earliest classmates.
              </p>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-denim-900/5 text-center relative group"
            >
              <div className="absolute top-0 right-0 p-8 text-gold opacity-5">
                <Diamond size={120} />
              </div>
              <div className="bg-gold text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 transform group-hover:-rotate-12 transition-transform shadow-lg">
                <span className="font-display text-2xl font-bold">01</span>
              </div>
              <h3 className="font-serif text-3xl font-bold mb-4 italic text-denim-900">High School Dept</h3>
              <p className="text-denim-900/60 font-light mb-8 italic">Co-host Batch 2001</p>
              <p className="text-sm text-denim-900/80 leading-relaxed mb-8">
                Spearheading the high school department's return. Committed to making our high school reunion the most sparkling event of the year.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid for Actions */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
              {/* Registration Main */}
              <div className="md:col-span-2 md:row-span-2 bg-denim-900 rounded-[3rem] p-12 text-ivory relative overflow-hidden flex flex-col justify-end group">
                 <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gold/20 rounded-full blur-[80px]"></div>
                 <Sparkles className="absolute top-12 left-12 text-gold opacity-40" />
                 <h2 className="font-display text-5xl font-light mb-6 tracking-tight relative z-10 leading-none">
                    Every <span className="font-serif italic text-gold">Josephinian</span><br /> counts.
                 </h2>
                 <p className="text-ivory/60 mb-10 max-w-sm relative z-10 font-light">Join us in celebrating the shared heritage of the Josephinian spirit. Don't wait—register today.</p>
                 <a 
                   href={REGISTRATION_URL}
                   className="bg-gold hover:bg-white hover:text-denim-900 text-denim-900 w-fit px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-all relative z-10 shadow-xl shadow-black/20"
                 >
                    Register for the event
                 </a>
              </div>

              {/* Sponsorship Link */}
              <Link to="/sponsorship" className="bg-white border-2 border-gold/30 rounded-[3rem] p-10 flex flex-col justify-between group hover:bg-gold transition-all duration-500 shadow-xl shadow-gold/5">
                 <div className="bg-denim-900 text-gold w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
                    <Heart size={20} />
                 </div>
                 <div>
                    <h3 className="font-serif text-2xl font-bold mb-2 italic group-hover:text-denim-900">Be a Legacy Maker</h3>
                    <p className="text-xs text-denim-900/60 group-hover:text-denim-900/40 uppercase tracking-widest font-bold">Invest in our heritage</p>
                 </div>
              </Link>

              {/* Merch Store Link */}
              <Link to="/merch" className="bg-gold rounded-[3rem] p-10 text-denim-900 flex flex-col justify-between group">
                 <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center group-hover:-rotate-12 transition-transform shadow-md">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <h3 className="font-serif text-2xl font-bold mb-2 italic">Official Merch</h3>
                    <p className="text-xs text-denim-900/60 uppercase tracking-widest font-bold">Coming Soon</p>
                 </div>
              </Link>

              {/* Social Link */}
              <a 
                href={CONTACT_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="md:col-span-1 bg-white border border-denim-900/10 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center group hover:bg-blue-50 transition-colors"
              >
                 <Facebook size={48} className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
                 <h3 className="font-display font-medium text-denim-900">Follow the Journey</h3>
                 <p className="text-sm text-denim-900/40 font-light mt-2 italic">Get real-time updates</p>
              </a>
           </div>
        </div>
      </section>

      {/* Community Quote */}
      <section className="py-40 bg-ivory text-center">
         <div className="max-w-4xl mx-auto px-4">
            <MessageSquare className="mx-auto text-gold/20 mb-12" size={80} />
            <h2 className="font-serif text-4xl md:text-6xl font-light text-denim-900 leading-tight italic">
               "SJA isn't just a place we went to, it's a part of who we are."
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mt-12 rounded-full"></div>
         </div>
      </section>
    </div>
  );
}
