import React, { useState } from "react";
import { Search, MapPin, Eye, FileText, CheckCircle2, AlertTriangle, Upload, ChevronRight, Copy, Check, ShieldCheck, Download } from "lucide-react";

interface TrackingProps {
  initialAppId?: string;
}

export const Tracking: React.FC<TrackingProps> = ({ initialAppId = "" }) => {
  const [appId, setAppId] = useState(initialAppId);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Missing document upload inputs
  const [missingDocName, setMissingDocName] = useState("");
  const [missingDocFile, setMissingDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [copiedId, setCopiedId] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setApplication(null);
    setUploadSuccess(false);

    try {
      const response = await fetch(`/api/applications/${appId.trim()}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Application not found");
      }
      const data = await response.json();
      setApplication(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid Application ID. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!application) return;
    navigator.clipboard.writeText(application.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyRef = () => {
    if (!application || !application.govReference) return;
    navigator.clipboard.writeText(application.govReference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Missing doc submit handler
  const handleUploadMissingDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!missingDocName || !missingDocFile || !application) return;

    setIsUploading(true);
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await fetch(`/api/applications/${application.id}/upload-missing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: missingDocName,
            dataUrl: reader.result as string,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        const result = await response.json();
        if (result.success) {
          setApplication(result.application);
          setUploadSuccess(true);
          setMissingDocName("");
          setMissingDocFile(null);
        }
      } catch (err) {
        console.error(err);
        alert("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(missingDocFile);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Payment Received":
        return "bg-orange-50 text-orange-950 border-orange-200 uppercase tracking-wider text-[10px]";
      case "Document Verification":
        return "bg-orange-50 text-orange-950 border-orange-200 uppercase tracking-wider text-[10px]";
      case "Applied":
        return "bg-indigo-50 text-indigo-950 border-indigo-200 uppercase tracking-wider text-[10px]";
      case "Processing":
        return "bg-indigo-50 text-indigo-950 border-indigo-200 uppercase tracking-wider text-[10px]";
      case "Completed":
        return "bg-orange-100 text-orange-950 border-orange-300 uppercase tracking-wider text-[10px] font-black";
      case "Rejected":
        return "bg-red-50 text-red-950 border-red-200 uppercase tracking-wider text-[10px]";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 uppercase tracking-wider text-[10px]";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Tracking Search Input */}
      <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 rounded-2xl p-6 shadow-md max-w-2xl mx-auto space-y-4 no-print">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black text-indigo-950 uppercase tracking-widest flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-orange-500" />
            <span>Track Application Status</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your official J&K CSC Application ID (e.g. <code className="bg-indigo-50/50 px-1.5 py-0.5 rounded text-orange-600 font-bold font-mono">CSC-DOM-434701</code>) to track progress.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={appId}
            onChange={(e) => setAppId(e.target.value.toUpperCase())}
            placeholder="CSC-DOM-XXXXXX"
            className="w-full p-3 border border-slate-200 rounded-xl bg-white text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 text-xs font-mono font-black tracking-widest uppercase placeholder-slate-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-900 hover:bg-indigo-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-indigo-100 shrink-0"
          >
            {loading ? "Searching..." : "Track ID"}
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-950 flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Output Details */}
      {application && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Info Card & Files */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Details */}
            <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 rounded-2xl p-6 shadow-md space-y-6">
              
              {/* Application Header */}
              <div className="flex justify-between items-start gap-4 flex-wrap border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="text-[9px] text-indigo-900 font-black uppercase tracking-widest">CSC Application</div>
                  <h3 className="text-base font-black text-indigo-950 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <span>{application.id}</span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 hover:bg-slate-100 rounded text-indigo-500 hover:text-indigo-900 transition-colors"
                      title="Copy Application ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </h3>
                  <div className="text-xs text-indigo-950 uppercase font-bold tracking-wider mt-1">{application.serviceName}</div>
                </div>

                <span className={`px-3 py-1 rounded border font-bold uppercase tracking-wider text-[10px] ${getStatusBadgeStyles(application.status)}`}>
                  {application.status}
                </span>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-5 font-semibold">
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Applicant</span>
                  <span className="text-indigo-950 uppercase">{application.personalDetails.fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Guardian Relation</span>
                  <span className="text-indigo-950 uppercase">{application.personalDetails.guardianName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Mobile</span>
                  <span className="text-indigo-950 font-mono">{application.personalDetails.mobile}</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Aadhaar Card</span>
                  <span className="text-indigo-950 font-mono">XXXX-XXXX-{application.personalDetails.aadhaar.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Domicile Village</span>
                  <span className="text-indigo-950 uppercase">{application.personalDetails.village}, Tehsil {application.personalDetails.tehsil}, District {application.personalDetails.district}</span>
                </div>
                <div>
                  <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider mb-0.5">Date Applied</span>
                  <span className="text-indigo-950 font-mono">{new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Government Portal Reference Number */}
              <div>
                <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-widest mb-2.5">
                  OFFICIAL J&K GOVT PORTAL SYNCHRONIZATION
                </span>
                {application.govReference ? (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wide">ServicePlus / NSP Reference Number</span>
                      <div className="font-mono text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <span>{application.govReference}</span>
                        <button
                          onClick={handleCopyRef}
                          className="p-1 hover:bg-indigo-100 rounded text-indigo-500 transition-colors"
                          title="Copy Government Reference"
                        >
                          {copiedRef ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <span className="text-[9px] bg-orange-100 border border-orange-200 text-orange-950 font-black px-2.5 py-1 rounded uppercase tracking-wider">Applied on Portal</span>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-500 text-xs flex gap-2 font-medium">
                    <ShieldCheck className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-950 block font-black uppercase tracking-wider text-[10px] mb-0.5">Under VLE Verification</strong>
                      CSC Agent is currently checking uploaded files before submitting to the Jammu & Kashmir e-Services portal. Once submitted, your State Reference ID will appear here.
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Upload Missing Documents Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4 no-print">
              <div>
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                  <Upload className="w-4.5 h-4.5 text-orange-500" />
                  <span>Upload Corrected / Missing Documents</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Did the admin request additional details? Select a file category and upload the corrected scan below.
                </p>
              </div>

              {uploadSuccess && (
                <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-3.5 text-xs text-indigo-950 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Document uploaded successfully! Application log updated.</span>
                </div>
              )}

              <form onSubmit={handleUploadMissingDoc} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end text-xs font-semibold">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-1">Document Category Name</label>
                  <select
                    required
                    value={missingDocName}
                    onChange={(e) => setMissingDocName(e.target.value)}
                    className="p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-bold text-indigo-950 text-xs"
                  >
                    <option value="">Select Category...</option>
                    <option value="Corrected Aadhaar Card">Corrected Aadhaar Card</option>
                    <option value="Recent Passport Photo">Recent Passport Photo</option>
                    <option value="Latest Residence Proof">Latest Residence Proof</option>
                    <option value="Land Nakal Report">Land Nakal Report</option>
                    <option value="Income/Salary Certificate">Income/Salary Certificate</option>
                    <option value="Academic Marksheet">Academic Marksheet</option>
                    <option value="VLE Signature Scan">VLE Signature Scan</option>
                    <option value="Other Missing Document">Other Missing Document</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-1">File Attachment</label>
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMissingDocFile(e.target.files[0]);
                      }
                    }}
                    className="p-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[9px] file:font-black file:uppercase file:tracking-wider file:bg-indigo-900 file:text-white file:cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={isUploading || !missingDocName || !missingDocFile}
                    className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black rounded-lg text-[10px] uppercase tracking-widest transition-all shadow-md shadow-indigo-100"
                  >
                    {isUploading ? "Uploading Document..." : "Submit File to Agent"}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Status Timeline & Receipts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Action Card: Receipts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-3.5 no-print">
              <h4 className="font-black text-indigo-950 text-[10px] uppercase tracking-widest border-b border-slate-100 pb-2">
                Download / Print
              </h4>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 border border-slate-200 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-black text-indigo-950 uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-orange-500" />
                <span>Download Payment Receipt</span>
              </button>
              <div className="text-[10px] text-slate-400 font-medium leading-relaxed text-center">
                Pressing this button activates a styled landscape print configuration of your invoice with VLE cryptographic signatures.
              </div>
            </div>

            {/* Application Timeline Logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-5">
              <div>
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">
                  Application Tracking Logs
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Updated in real-time by VLE agent</p>
              </div>

              {/* Vertical timeline */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-50">
                {application.history.map((log: any, idx: number) => {
                  const isLatest = idx === application.history.length - 1;
                  return (
                    <div key={idx} className="flex gap-4 relative">
                      {/* Timeline dot */}
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                        isLatest
                          ? "bg-orange-500 border-orange-200 text-white"
                          : "bg-white border-indigo-100 text-indigo-300"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Log details */}
                      <div className="space-y-1 pt-0.5 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isLatest ? "text-indigo-950" : "text-slate-500"}`}>
                            {log.status}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono font-bold">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                        </div>
                        {log.comment && (
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {log.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
