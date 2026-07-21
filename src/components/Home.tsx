import React, { useState } from "react";
import { J_K_SERVICES, ServiceDefinition } from "../types";
import { FileText, Search, CreditCard, Eye, Landmark, UserCheck, ShieldCheck, ArrowRight, ArrowDown, MapPin, Phone, Mail } from "lucide-react";

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  setSelectedServiceId: (id: string) => void;
  onSelectServiceToApply: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  setCurrentTab,
  setSelectedServiceId,
  onSelectServiceToApply,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = J_K_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Approved J&K Services", count: "13+", icon: FileText, color: "text-indigo-600 bg-indigo-50" },
    { label: "Processing Speed", count: "24-48h", icon: UserCheck, color: "text-orange-600 bg-orange-50" },
    { label: "VLE Trust Level", count: "100%", icon: ShieldCheck, color: "text-indigo-600 bg-indigo-50" },
    { label: "Govt. Gateways", icon: Landmark, count: "Unified", color: "text-orange-600 bg-orange-50" }
  ];

  return (
    <div className="space-y-12 font-sans">
      {/* Hero Banner Section */}
      <section
        className="relative bg-indigo-950 rounded-3xl overflow-hidden shadow-2xl border border-indigo-900 text-white"
        id="home-hero-banner"
      >
        {/* Editorial border decor */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-orange-500 opacity-40 m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-orange-500 opacity-40 m-4 pointer-events-none"></div>

        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900/90 to-slate-900 opacity-95"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 md:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/60 border border-orange-500/30 text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Online Application & Tracking
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto uppercase">
            Jammu & Kashmir CSC Service Management
            <span className="block text-lg md:text-xl text-orange-400 font-extrabold mt-3 tracking-wider font-sans leading-relaxed">
              जम्मू और कश्मीर सीएससी सेवा प्रबंधन पोर्टल
            </span>
          </h1>
          
          <p className="text-xs md:text-sm text-indigo-100 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-wider opacity-90">
            Apply online for J&K Domicile, Income, Category Certificates, PAN Card, Ayushman Card, Scholarships and more. Track status instantly and download certificates securely.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab("services")}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 font-extrabold rounded-xl text-xs tracking-widest uppercase transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2 group"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
            </button>
            <button
              onClick={() => setCurrentTab("track")}
              className="px-6 py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white border border-indigo-700 font-extrabold rounded-xl text-xs tracking-widest uppercase transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Track Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* VLE Card Info & Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-vle-info-grid">
        {/* VLE Contact Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-2xl border-b-4 border-orange-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">
              <span>Your Authorized VLE</span>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-1">Towheed Majeed Gojar</h3>
            <p className="text-xs text-indigo-200 font-mono mb-5">VLE CSC ID: 434741630021</p>
            
            <div className="space-y-4 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-indigo-100">Uttersoo, Anantnag, Jammu & Kashmir</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-indigo-100">+91 6006821511</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="text-indigo-100">towheedmajeed01@gmail.com</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-indigo-800/80 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-200">
            <span>Hours: 9:00 AM - 7:00 PM</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Online Status
            </span>
          </div>
        </div>

        {/* Stats & Trust Pillars */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div className={`p-3 rounded-xl w-fit ${st.color}`}>
                <st.icon className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-indigo-950 tracking-tight">{st.count}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{st.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Citizen Steps Workflow */}
      <section className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100" id="home-citizen-steps">
        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-950 mb-6 text-center">Citizen Online Application Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: "1", title: "Select Service", desc: "Select from 13+ digital certificates & CSC forms." },
            { step: "2", title: "Fill Details", desc: "Enter personal, family, and bank details correctly." },
            { step: "3", title: "Secure Payment", desc: "Pay the nominal CSC fee via scan UPI QR or cards." },
            { step: "4", title: "Track Status", desc: "Monitor application & get J&K Portal Ref numbers." }
          ].map((st, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center shadow-md">
                {st.step}
              </div>
              <h4 className="font-extrabold uppercase text-indigo-950 mt-2 text-xs tracking-wider">{st.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services List / Search */}
      <section className="space-y-6" id="home-search-services">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>Explore Available CSC Services</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Select any service below to check required documents and apply.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search for J&K services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 transition-all"
            />
          </div>
        </div>

        {/* Bento Grid layout for Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-orange-500/40 hover:shadow-lg transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {svc.shortCode}
                  </div>
                  <div className="text-xs font-black text-indigo-950 font-mono bg-orange-100 text-orange-950 px-2.5 py-1 rounded">
                    ₹{svc.fee}
                  </div>
                </div>

                <h3 className="font-black text-indigo-950 text-xs uppercase tracking-wider mt-4 group-hover:text-orange-500 transition-colors">
                  {svc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2 font-medium">
                  {svc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Required Uploads:
                  </div>
                  <ul className="space-y-1">
                    {svc.requiredDocuments.slice(0, 3).map((doc, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                        <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0"></span>
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                    {svc.requiredDocuments.length > 3 && (
                      <li className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">
                        + {svc.requiredDocuments.length - 3} More Document(s)
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedServiceId(svc.id);
                    setCurrentTab("services");
                  }}
                  className="w-1/2 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors text-center border border-slate-200"
                >
                  Check Details
                </button>
                <button
                  onClick={() => onSelectServiceToApply(svc.id)}
                  className="w-1/2 py-2 bg-indigo-900 text-white hover:bg-indigo-950 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors text-center flex items-center justify-center gap-1 shadow-md shadow-indigo-100"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3 text-orange-500" />
                </button>
              </div>
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="col-span-full bg-slate-50 border border-slate-150 rounded-xl p-12 text-center text-slate-500 text-xs">
              No matching services found for "{searchQuery}". Try searching "Domicile", "Income" or "PAN".
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
