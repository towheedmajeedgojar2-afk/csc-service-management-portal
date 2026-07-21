import React from "react";
import { ShieldCheck, Phone, Mail, MapPin, Grid, Lock, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-indigo-900 text-white shadow-lg border-b-4 border-orange-500">
      <div className="bg-indigo-950 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-indigo-200 flex flex-wrap justify-between items-center max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>Govt. Approved CSC Service Point</span>
          </span>
          <span className="hidden md:inline-block border-l border-indigo-800 h-3"></span>
          <span className="hidden md:flex items-center gap-1">
            CSC ID: <strong className="text-white font-mono">434741630021</strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:+916006821511"
            className="flex items-center gap-1 hover:text-orange-400 transition-colors"
          >
            <Phone className="w-3 h-3 text-orange-500" />
            <span>+91 6006821511</span>
          </a>
          <span className="border-l border-indigo-800 h-3"></span>
          <a
            href="mailto:towheedmajeed01@gmail.com"
            className="hidden sm:flex items-center gap-1 hover:text-orange-400 transition-colors"
          >
            <Mail className="w-3 h-3 text-orange-500" />
            <span>towheedmajeed01@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand Logo and Title */}
        <div
          onClick={() => setCurrentTab("home")}
          className="flex items-center gap-4 cursor-pointer group"
          id="brand-header-logo"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-900 font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
            CSC
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none">
              Towheed Majeed Gojar CSC
            </h1>
            <p className="text-xs text-indigo-200 font-mono tracking-wider flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-orange-500" />
              <span>Uttersoo, Anantnag, J&K</span>
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <button
            id="nav-btn-home"
            onClick={() => setCurrentTab("home")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              currentTab === "home"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-200 hover:bg-indigo-950 hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            id="nav-btn-services"
            onClick={() => setCurrentTab("services")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              currentTab === "services"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-200 hover:bg-indigo-950 hover:text-white"
            }`}
          >
            All Services
          </button>
          <button
            id="nav-btn-track"
            onClick={() => setCurrentTab("track")}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              currentTab === "track"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-200 hover:bg-indigo-950 hover:text-white"
            }`}
          >
            Track Status
          </button>
          <span className="border-l border-indigo-800 h-5 mx-1"></span>
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                id="nav-btn-admin-dashboard"
                onClick={() => setCurrentTab("admin")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all border ${
                  currentTab === "admin"
                    ? "bg-indigo-950 text-orange-500 border-orange-500"
                    : "bg-indigo-950 text-indigo-300 border-indigo-800 hover:bg-indigo-950/80 hover:text-white"
                }`}
              >
                Admin Panel
              </button>
              <button
                id="nav-btn-logout"
                onClick={onLogout}
                className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-red-800 hover:bg-red-700 text-white transition-all shadow-md shadow-red-950/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              id="nav-btn-login-tab"
              onClick={() => setCurrentTab("admin")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                currentTab === "admin"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-indigo-950 text-indigo-200 hover:bg-indigo-950/80 hover:text-white border border-indigo-800"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 text-slate-600 border-t-4 border-indigo-900 pt-12 pb-6 px-4 no-print font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Info Column */}
        <div id="footer-info-col">
          <h2 className="text-indigo-950 text-base font-black uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            Towheed Majeed Gojar CSC
          </h2>
          <p className="text-sm leading-relaxed mb-4 text-slate-600 font-medium">
            Authorized Common Service Center (CSC) providing J&K digital governance, identity cards, certificates, and online scheme applications directly to the citizens of Uttersoo and adjacent districts.
          </p>
          <div className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 inline-block text-indigo-900 font-bold">
            CSC ID: 434741630021
          </div>
        </div>

        {/* Contact Column */}
        <div id="footer-contact-col">
          <h3 className="text-indigo-950 text-xs font-black tracking-widest uppercase mb-4 border-b border-slate-200 pb-1.5">
            Contact Details
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>Uttersoo, Block Shangus, Tehsil Shangus, District Anantnag, Jammu & Kashmir, 192201</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <a href="tel:+916006821511" className="hover:text-indigo-900 transition-colors">
                +91 6006821511 (WhatsApp / Call)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-500 shrink-0" />
              <a href="mailto:towheedmajeed01@gmail.com" className="hover:text-indigo-900 transition-colors">
                towheedmajeed01@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* J&K Official Resources Portal Column */}
        <div id="footer-government-col">
          <h3 className="text-indigo-950 text-xs font-black tracking-widest uppercase mb-4 border-b border-slate-200 pb-1.5">
            Govt. Portal References
          </h3>
          <p className="text-xs mb-3 leading-relaxed text-slate-500">
            Applications processed here are manually synchronized and submitted to the official Union Territory portals:
          </p>
          <ul className="space-y-2 text-xs font-bold">
            <li>
              <a
                href="https://services.jk.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-800 hover:text-orange-500 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span>J&K e-Services Portal (ServicePlus)</span>
              </a>
            </li>
            <li>
              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-800 hover:text-orange-500 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span>PM Kisan Samman Nidhi Portal</span>
              </a>
            </li>
            <li>
              <a
                href="https://scholarships.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-800 hover:text-orange-500 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                <span>National Scholarship Portal (NSP)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © 2026 Towheed Majeed Gojar CSC. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <span>Security: 256-bit AES Encrypted</span>
          <span>System Status: Online</span>
          <span className="text-indigo-900">Designed for VLE: Towheed Majeed Gojar</span>
        </div>
      </div>
    </footer>
  );
};
