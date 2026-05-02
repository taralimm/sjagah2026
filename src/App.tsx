import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Sponsorship = lazy(() => import("./pages/Sponsorship"));
const Merch = lazy(() => import("./pages/Merch"));

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans selection:bg-gold selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="h-screen flex items-center justify-center font-display font-light text-denim-900/40">SJA 2026...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sponsorship" element={<Sponsorship />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

