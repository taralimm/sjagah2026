import { Facebook, Mail, MapPin } from "lucide-react";
import { CONTACT_FACEBOOK } from "../constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-denim-900/5 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <img src="/necktie logo_bg_fixed.png" alt="SJA Logo" className="h-10 w-10 object-contain" />
              <span className="font-serif text-xl font-bold italic tracking-tight text-denim-900">St. Joseph's Academy</span>
            </div>
            <p className="text-denim-900/40 font-light leading-relaxed max-w-xs">
              Celebrating our roots, reconnection, and the shared heritage of the Josephinian spirit since our very first days.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Event Location</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-denim-900/60">
                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                <span className="text-sm font-light leading-relaxed">St. Joseph's Academy Campus<br />Mandaue City, Cebu, Philippines</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Social Channels</h3>
            <div className="flex space-x-4">
              <a
                href={CONTACT_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-denim-900 text-ivory hover:bg-gold p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-denim-900/10"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:lim.taramarie@gmail.com"
                className="bg-ivory border border-denim-900/5 text-denim-900 hover:border-gold p-4 rounded-2xl transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-denim-900/5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-denim-900/30">
            © 2026 SJA Grand Alumni Homecoming • Hosted by Batch '97 & '01
          </p>
        </div>
      </div>
    </footer>
  );
}
