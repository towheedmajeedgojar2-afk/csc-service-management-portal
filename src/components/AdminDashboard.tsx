import React, { useState, useEffect } from "react";
import { AdminUser, Application } from "../types";
import { 
  Lock, Landmark, Users, TrendingUp, CheckCircle, Clock, FileSpreadsheet, 
  Search, Eye, Edit2, AlertCircle, X, Download, MessageSquare, Mail, Phone, 
  ExternalLink, Check, Copy, RefreshCcw
} from "lucide-react";

interface AdminDashboardProps {
  token: string;
  onLoginSuccess: (token: string, admin: AdminUser) => void;
  adminInfo: AdminUser | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLoginSuccess,
  adminInfo,
}) => {
  // Login State
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("cscadmin@uttersoo");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Stats & Applications State
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Application Editor States (Modal)
  const [editStatus, setEditStatus] = useState("");
  const [editGovRef, setEditGovRef] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);

  // Notification simulator visual state
  const [notifSuccessMsg, setNotifSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login failed");
      }

      const result = await response.json();
      if (result.success) {
        onLoginSuccess(result.token, result.user);
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Invalid credentials. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Fetch Stats and Applications
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);

    try {
      // Fetch Applications
      const appRes = await fetch("/api/admin/applications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }

      // Fetch Stats
      const statRes = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (statRes.ok) {
        const statData = await statRes.json();
        setStats(statData);
      }
    } catch (err) {
      console.error("Error fetching admin metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Open Edit Modal
  const openAppDetails = (app: Application) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditGovRef(app.govReference || "");
    setEditNotes(app.adminNotes || "");
    setNotifSuccessMsg("");
  };

  // Update Application
  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdatingApp(true);
    try {
      const response = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus,
          govReference: editGovRef,
          adminNotes: editNotes
        }),
      });

      if (!response.ok) throw new Error("Failed to update application");

      const result = await response.json();
      if (result.success) {
        // Refresh local items
        await fetchAdminData();
        // Update selected view
        setSelectedApp(result.application);
        alert("Application status, State Portal Ref, and Notes updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving updates to application.");
    } finally {
      setIsUpdatingApp(false);
    }
  };

  // Trigger JSON Backup
  const handleDownloadBackup = async () => {
    try {
      const response = await fetch("/api/admin/backup", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Backup failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `csc_portal_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Error downloading database backup.");
    }
  };

  // Generate WhatsApp Notification Link targeting candidate
  const getWhatsAppLink = (app: Application) => {
    const cleanMobile = app.personalDetails.mobile.replace(/\s+/g, "");
    
    let messageText = `Hello ${app.personalDetails.fullName},\n\nYour application for *${app.serviceName}* (ID: ${app.id}) is now updated to: *${app.status}* by Towheed Majeed CSC, Uttersoo.`;
    
    if (app.govReference) {
      messageText += `\n\nOfficial Gov Reference: *${app.govReference}*`;
    }
    
    messageText += `\n\nTrack your progress live here: ${window.location.origin}/track?id=${app.id}\n\nThank you,\nTowheed Majeed Gojar CSC\nUttersoo, Anantnag\n+916006821511`;
    
    return `https://api.whatsapp.com/send?phone=${cleanMobile}&text=${encodeURIComponent(messageText)}`;
  };

  // Simulated notification system triggers
  const triggerEmailSimulation = (app: Application) => {
    setNotifSuccessMsg(`Simulated Email Alert Sent to: ${app.personalDetails.email || "applicant@gmail.com"}.`);
    setTimeout(() => setNotifSuccessMsg(""), 4000);
  };

  const triggerSmsSimulation = (app: Application) => {
    setNotifSuccessMsg(`Simulated SMS dispatch ready for GSM Gateway: ${app.personalDetails.mobile}.`);
    setTimeout(() => setNotifSuccessMsg(""), 4000);
  };

  // Search and Filter computation
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.personalDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.govReference && app.govReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.personalDetails.village.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Render Login Card if not authorized
  if (!token) {
    return (
      <div className="max-w-md mx-auto space-y-6 pt-8 font-sans">
        <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 rounded-2xl p-6 shadow-md space-y-5">
          <div className="text-center space-y-1.5">
            <div className="mx-auto w-11 h-11 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-indigo-950 uppercase tracking-widest">Authorized VLE Access</h3>
            <p className="text-xs text-slate-500 font-medium">
              Sign in with your secure VLE password to manage state service applications.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-1">VLE Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="cscadmin@uttersoo"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-mono tracking-wider text-xs"
              />
            </div>

            <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-2.5 text-[10px] text-indigo-950 leading-relaxed font-medium">
              <strong>Tip:</strong> Default VLE demonstration parameters are prefilled. Simply click sign-in.
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-md shadow-indigo-100"
            >
              {isLoggingIn ? "Authenticating VLE..." : "Access Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Admin Title Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">CSC VLE Management Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Logged in as: <strong className="text-indigo-950 font-black">{adminInfo?.name || "Towheed Majeed"}</strong> • CSC ID: <span className="font-mono font-bold">{adminInfo?.cscId || "434741630021"}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-indigo-950 border border-slate-200 rounded-lg transition-all"
            title="Refresh list"
          >
            <RefreshCcw className="w-4 h-4 text-indigo-900" />
          </button>
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-indigo-100"
            title="Database JSON Backup"
          >
            <FileSpreadsheet className="w-4 h-4 text-orange-500" />
            <span>Export Portal Backup</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-kpi-grid">
          {/* Revenue */}
          <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 p-4 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-lg shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider">Revenue Received</span>
              <span className="text-lg font-black text-indigo-950 font-mono">₹{stats.totalRevenue}</span>
            </div>
          </div>

          {/* New / Unprocessed Payments */}
          <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 p-4 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider">New Received</span>
              <span className="text-lg font-black text-indigo-950 font-mono">
                {stats.paymentReceived}
              </span>
            </div>
          </div>

          {/* Under Processing */}
          <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 p-4 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider">Applied / Under Process</span>
              <span className="text-lg font-black text-indigo-950 font-mono">
                {stats.applied + stats.processing}
              </span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 p-4 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-lg shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-indigo-900 block font-black uppercase tracking-wider">Completed</span>
              <span className="text-lg font-black text-indigo-950 font-mono">
                {stats.completed}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Main Applications Data Grid */}
      <section className="space-y-4" id="admin-applications-section">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Applicant Name, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-bold"
            />
          </div>

          {/* Status quick select */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
            {[
              { id: "all", label: "All Items" },
              { id: "Payment Received", label: "New Payments" },
              { id: "Document Verification", label: "Verification" },
              { id: "Applied", label: "Applied to State" },
              { id: "Processing", label: "Processing" },
              { id: "Completed", label: "Completed" },
              { id: "Rejected", label: "Rejected" }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg font-black transition-all shrink-0 text-[9px] uppercase tracking-wider ${
                  statusFilter === st.id
                    ? "bg-indigo-900 text-white shadow-sm"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-700">
              <thead>
                <tr className="bg-indigo-950 border-b border-indigo-900 text-white font-black uppercase tracking-widest text-left text-[9px]">
                  <th className="p-4">ID</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Service Required</th>
                  <th className="p-4">Village</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Gov. Portal Ref</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className="border-b border-slate-150 hover:bg-indigo-50/20 transition-colors">
                    <td className="p-4 font-mono font-black text-indigo-950 text-[11px] tracking-wider">{app.id}</td>
                    <td className="p-4 font-semibold">
                      <div className="font-black text-indigo-950 uppercase text-xs">{app.personalDetails.fullName}</div>
                      <div className="text-[9px] text-indigo-900 font-mono font-bold mt-0.5">{app.personalDetails.mobile}</div>
                    </td>
                    <td className="p-4 font-bold text-indigo-950 text-xs uppercase tracking-wide">{app.serviceName}</td>
                    <td className="p-4 font-bold uppercase text-slate-600 text-[11px]">{app.personalDetails.village}</td>
                    <td className="p-4">
                      <div className="font-black text-indigo-950 font-mono">₹{app.payment.amount}</div>
                      <span className="text-[9px] bg-orange-100 text-orange-950 border border-orange-200 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {app.payment.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-indigo-900 text-xs tracking-widest uppercase">{app.govReference || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded border text-[9px] font-bold uppercase tracking-wider ${
                        app.status === "Completed" ? "bg-orange-100 text-orange-950 border-orange-300 font-black" :
                        app.status === "Rejected" ? "bg-red-50 text-red-950 border-red-200 font-black" :
                        app.status === "Payment Received" ? "bg-orange-50 text-orange-950 border-orange-200" :
                        "bg-indigo-50 text-indigo-950 border-indigo-200"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openAppDetails(app)}
                        className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-[9px] uppercase tracking-widest rounded transition-all inline-flex items-center gap-1 shadow-sm shadow-indigo-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-500" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-500">
                      No applications currently meet the search or category parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INSPECT DETAIL MODAL (Opens upon click) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col justify-between border-t-8 border-t-indigo-900 font-sans">
            
            {/* Modal Header */}
            <div className="bg-indigo-950 text-white p-5 border-b border-indigo-900 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[9px] text-orange-400 font-black block uppercase tracking-widest">INSPECT APPLICATION</span>
                <h4 className="text-sm font-black font-mono tracking-wider uppercase">{selectedApp.id}</h4>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 hover:bg-indigo-900 rounded text-indigo-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
              
              {/* Left Column: Citizen Data Sheets */}
              <div className="md:col-span-7 space-y-6">
                {/* Personal Grid */}
                <div className="space-y-3.5">
                  <h5 className="font-black text-indigo-950 uppercase border-b border-slate-200 pb-1.5 text-[10px] tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span>Applicant Sheet</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-4 font-semibold">
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Full Name</span>
                      <strong className="text-indigo-950 uppercase text-xs font-black">{selectedApp.personalDetails.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Guardian Relation</span>
                      <span className="text-indigo-950 uppercase">{selectedApp.personalDetails.guardianName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Mobile</span>
                      <span className="text-indigo-950 font-mono">{selectedApp.personalDetails.mobile}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Aadhaar Number</span>
                      <span className="text-indigo-950 font-mono">{selectedApp.personalDetails.aadhaar}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Email Address</span>
                      <span className="text-indigo-950 font-mono">{selectedApp.personalDetails.email || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Date of Birth</span>
                      <span className="text-indigo-950 font-mono">{selectedApp.personalDetails.dob || "—"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Detailed Address</span>
                      <span className="text-indigo-950 uppercase">
                        {selectedApp.personalDetails.address}, Village {selectedApp.personalDetails.village}, Tehsil {selectedApp.personalDetails.tehsil}, District {selectedApp.personalDetails.district}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Family Grid (Conditional) */}
                {selectedApp.familyDetails && selectedApp.familyDetails.fatherName && (
                  <div className="space-y-3.5 pt-2">
                    <h5 className="font-black text-indigo-950 uppercase border-b border-slate-200 pb-1.5 text-[10px] tracking-widest flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>Family Registry</span>
                    </h5>
                    <div className="grid grid-cols-2 gap-4 font-semibold">
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Father's Name</span>
                        <span className="text-indigo-950 uppercase">{selectedApp.familyDetails.fatherName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Mother's Name</span>
                        <span className="text-indigo-950 uppercase">{selectedApp.familyDetails.motherName}</span>
                      </div>
                      {selectedApp.familyDetails.familyId && (
                        <div>
                          <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Family / Ration Card ID</span>
                          <span className="text-indigo-950 font-mono font-black uppercase tracking-wider">{selectedApp.familyDetails.familyId}</span>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Family Members list</span>
                        <span className="text-indigo-950 uppercase leading-relaxed">{selectedApp.familyDetails.familyMembers || "—"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Grid (Conditional) */}
                {selectedApp.bankDetails && selectedApp.bankDetails.accountNo && (
                  <div className="space-y-3.5 pt-2">
                    <h5 className="font-black text-indigo-950 uppercase border-b border-slate-200 pb-1.5 text-[10px] tracking-widest flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-orange-500" />
                      <span>Bank Account Sheet</span>
                    </h5>
                    <div className="grid grid-cols-2 gap-4 font-semibold">
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Account Holder Name</span>
                        <span className="text-indigo-950 uppercase font-black">{selectedApp.bankDetails.accountHolder}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Bank Name</span>
                        <span className="text-indigo-950 uppercase">{selectedApp.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">Account Number</span>
                        <span className="text-indigo-950 font-mono font-black">{selectedApp.bankDetails.accountNo}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">IFSC Code</span>
                        <span className="text-indigo-950 font-mono uppercase font-black">{selectedApp.bankDetails.ifsc}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scanned Files Vault */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-black text-indigo-950 uppercase border-b border-slate-200 pb-1.5 text-[10px] tracking-widest flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-orange-500" />
                    <span>Scanned Documents Vault</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center gap-3">
                        <div className="font-semibold">
                          <span className="font-black text-indigo-950 uppercase text-[10px] block tracking-wide">{doc.name}</span>
                          <span className="text-[9px] text-indigo-900 font-mono font-bold">Status: Secure Base64 Blob Saved</span>
                        </div>
                        {doc.dataUrl ? (
                          <a
                            href={doc.dataUrl}
                            download={`${selectedApp.id}_${doc.name.replace(/\s+/g, "_")}`}
                            className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-[9px] uppercase tracking-wider rounded transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5 text-orange-500" />
                            <span>Download Payload</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">No File Payload</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Workflow Sync & Actions */}
              <div className="md:col-span-5 space-y-6 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100">
                
                {/* Workflow Form */}
                <form onSubmit={handleUpdateApplication} className="space-y-4">
                  <h5 className="font-black text-indigo-950 uppercase border-b border-indigo-100 pb-2 text-[10px] tracking-widest">
                    Government Sync Controls
                  </h5>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-0.5">Transition Application Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="p-2 border border-slate-200 rounded-lg bg-white font-bold text-indigo-950 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900"
                    >
                      <option value="Payment Received">Payment Received</option>
                      <option value="Document Verification">Document Verification</option>
                      <option value="Applied">Applied to State Portal</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-0.5">Gov. Portal Reference ID</label>
                    <input
                      type="text"
                      value={editGovRef}
                      onChange={(e) => setEditGovRef(e.target.value)}
                      placeholder="e.g. JK-DOM-2026-991823"
                      className="p-2 border border-slate-200 rounded-lg bg-white font-mono font-bold tracking-widest uppercase text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 text-xs"
                    />
                    <span className="text-[9px] text-slate-400 font-medium leading-relaxed">
                      Step: Submit manually on government portal, then copy reference ID here to let applicant track.
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900 mb-0.5">Admin Notes / Comments</label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="e.g. Patwari verified continuous 15 years local residence. Passed to Naib Tehsildar."
                      rows={3}
                      className="p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-medium text-xs leading-relaxed text-indigo-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingApp}
                    className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-black rounded-lg text-[10px] uppercase tracking-widest transition-all shadow-md shadow-indigo-100"
                  >
                    {isUpdatingApp ? "Saving Changes..." : "Sync & Save Application"}
                  </button>
                </form>

                {/* Notification Alerts */}
                <div className="space-y-3 pt-4 border-t border-indigo-100">
                  <h5 className="font-black text-indigo-950 uppercase text-[10px] tracking-widest">
                    Frictionless Applicant Alerts
                  </h5>

                  {notifSuccessMsg && (
                    <div className="bg-orange-50 text-indigo-950 p-2.5 rounded-lg border border-orange-200 text-[10px] font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{notifSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 text-[9px] font-black uppercase tracking-wider">
                    {/* Real WhatsApp integration button */}
                    <a
                      href={getWhatsAppLink(selectedApp)}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 border border-orange-200 bg-orange-100 text-orange-950 hover:bg-orange-200 rounded-lg flex items-center gap-2 transition-all justify-center"
                    >
                      <MessageSquare className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="truncate">Send Live WhatsApp Update</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => triggerEmailSimulation(selectedApp)}
                      className="py-2.5 px-3 border border-indigo-100 bg-indigo-50 text-indigo-950 hover:bg-indigo-100 rounded-lg flex items-center gap-2 transition-all text-left justify-center"
                    >
                      <Mail className="w-4 h-4 text-indigo-900 shrink-0" />
                      <span className="truncate">Dispatch Simulated Email alert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerSmsSimulation(selectedApp)}
                      className="py-2.5 px-3 border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-2 transition-all text-left justify-center"
                    >
                      <Phone className="w-4 h-4 text-slate-600 shrink-0" />
                      <span className="truncate">Broadcast GSM SMS Broadcast</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
