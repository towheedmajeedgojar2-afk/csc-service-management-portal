import React, { useState } from "react";
import { J_K_SERVICES, ServiceDefinition } from "../types";
import { Info, CheckCircle, FileText, ArrowRight, ShieldCheck, Wallet, RefreshCw } from "lucide-react";

interface ServicesListProps {
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  onSelectServiceToApply: (id: string) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  selectedServiceId,
  setSelectedServiceId,
  onSelectServiceToApply,
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "certificates" | "cards" | "agriculture_scholarships">("all");

  const categories = [
    { id: "all", label: "All Services" },
    { id: "certificates", label: "J&K Certificates" },
    { id: "cards", label: "Identity & Cards" },
    { id: "agriculture_scholarships", label: "Agriculture & Scholarships" }
  ];

  const getCategoryOfService = (svc: ServiceDefinition) => {
    const certs = ["domicile", "income", "category", "rba", "alc_osc", "ews", "birth", "death"];
    const cards = ["pan", "ayushman"];
    if (certs.includes(svc.id)) return "certificates";
    if (cards.includes(svc.id)) return "cards";
    return "agriculture_scholarships";
  };

  const filteredServices = J_K_SERVICES.filter((svc) => {
    if (activeCategory === "all") return true;
    return getCategoryOfService(svc) === activeCategory;
  });

  // Get active selected service object
  const activeService = J_K_SERVICES.find((s) => s.id === selectedServiceId) || J_K_SERVICES[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Services Directory</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Review the list of available services, statutory fees, required uploads, and proceed with digital application filing.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              // Auto-select first service of that category if not current
              const firstOfCat = J_K_SERVICES.find(s => cat.id === "all" || getCategoryOfService(s) === cat.id);
              if (firstOfCat) {
                setSelectedServiceId(firstOfCat.id);
              }
            }}
            className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Side by Side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand: Services List */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredServices.map((svc) => {
            const isSelected = svc.id === activeService.id;
            return (
              <div
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all flex justify-between items-center ${
                  isSelected
                    ? "bg-indigo-50/60 border-indigo-500 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-indigo-950" : "text-slate-800"}`}>
                    {svc.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      {svc.shortCode}
                    </span>
                    <span>•</span>
                    <span className="font-black text-indigo-950 bg-orange-100 px-1.5 py-0.5 rounded text-[10px]">₹{svc.fee}</span>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${isSelected ? "text-orange-500" : "text-slate-300"}`} />
              </div>
            );
          })}
        </div>

        {/* Right Hand: Detailed Information View */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 border-b-4 border-b-indigo-900 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            {/* Service Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Service Details & Requirements</span>
              </div>
              <h3 className="text-base font-black text-indigo-950 uppercase tracking-wider leading-tight">
                {activeService.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                {activeService.description}
              </p>
            </div>

            {/* Fee & Processing Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-orange-500" />
                  <span>CSC Portal Fee</span>
                </div>
                <div className="text-xl font-black text-indigo-950 mt-1">₹{activeService.fee}</div>
                <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mt-1">Includes Service Fee</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                  <span>Estimated Processing</span>
                </div>
                <div className="text-xs font-black text-indigo-950 uppercase mt-2 tracking-wide">3 to 7 Working Days</div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">Subject to Govt portal SLA</div>
              </div>
            </div>

            {/* Required Documents checklist */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                Mandatory Supporting Documents
              </h4>
              <div className="space-y-2.5">
                {activeService.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-indigo-50/40 p-3 rounded-lg border border-indigo-100 font-medium">
                    <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 flex gap-3 text-xs text-indigo-950">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                <strong className="font-black uppercase tracking-wider block mb-1 text-orange-950 text-[10px]">Important Security Notice</strong>
                All document uploads must be original scans. Please make sure that Aadhaar numbers, photographs, signatures, and stamps are fully legible. Stale or incorrect records will be rejected by the Tehsildar or respective verifying officer.
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={() => onSelectServiceToApply(activeService.id)}
              className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <span>Apply Online for {activeService.name}</span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
