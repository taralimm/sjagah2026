import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { REGISTRATION_URL } from "../constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sponsorship", path: "/sponsorship" },
    { name: "Merch Store", path: "/merch" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-ivory/80 backdrop-blur-md border-b border-denim-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/necktie logo_bg_fixed.png" alt="SJA Logo" className="h-10 w-10 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-serif text-lg font-bold tracking-tight text-denim-900 hidden sm:block uppercase">
                SJA Homecoming 2026
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-denim-900/60 hover:text-denim-900 font-bold transition-colors text-xs uppercase tracking-[0.2em]"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-denim-900 hover:bg-denim-800 text-ivory px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-denim-900/10"
            >
              Register Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-denim-900 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-ivory border-b border-denim-900/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-denim-900/60 hover:text-denim-900 font-bold text-xs uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gold text-white px-6 py-3 rounded-full font-bold text-center text-xs uppercase tracking-widest"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
