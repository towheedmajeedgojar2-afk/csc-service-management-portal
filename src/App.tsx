import { useState, useEffect } from "react";
import { Header, Footer } from "./components/HeaderFooter";
import { Home } from "./components/Home";
import { ServicesList } from "./components/ServicesList";
import { ApplicationForm } from "./components/ApplicationForm";
import { PaymentSimulator } from "./components/PaymentSimulator";
import { Tracking } from "./components/Tracking";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminUser } from "./types";
import { Landmark } from "lucide-react";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("domicile");
  const [appToPay, setAppToPay] = useState<any>(null);
  const [trackId, setTrackId] = useState<string>("");

  // Admin state with persistent check in LocalStorage
  const [adminToken, setAdminToken] = useState<string>("");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // 1. Check if returning admin session exists
    const storedToken = localStorage.getItem("csc_admin_token");
    const storedUser = localStorage.getItem("csc_admin_user");
    if (storedToken && storedUser) {
      setAdminToken(storedToken);
      setAdminUser(JSON.parse(storedUser));
    }

    // 2. Parse query parameters for deep-linking (e.g., track updates)
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
      setTrackId(idParam);
      setCurrentTab("track");
    }
  }, []);

  const handleAdminLogout = () => {
    setAdminToken("");
    setAdminUser(null);
    localStorage.removeItem("csc_admin_token");
    localStorage.removeItem("csc_admin_user");
    setCurrentTab("home");
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case "home":
        return (
          <Home
            setCurrentTab={setCurrentTab}
            setSelectedServiceId={setSelectedServiceId}
            onSelectServiceToApply={(id) => {
              setSelectedServiceId(id);
              setCurrentTab("apply");
            }}
          />
        );
      case "services":
        return (
          <ServicesList
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            onSelectServiceToApply={(id) => {
              setSelectedServiceId(id);
              setCurrentTab("apply");
            }}
          />
        );
      case "apply":
        return (
          <ApplicationForm
            serviceId={selectedServiceId}
            onBack={() => setCurrentTab("services")}
            onSubmitSuccess={(app) => {
              console.log("Application Received:", app);
              setAppToPay(app);
              setCurrentTab("pay");
            }}
          />
        );
      case "pay":
        return (
          <PaymentSimulator
            application={appToPay}
            onCancel={() => setCurrentTab("apply")}
            onPaymentSuccess={(updatedApp) => {
              setTrackId(updatedApp.id);
              setCurrentTab("track");
            }}
          />
        );
      case "track":
        return <Tracking initialAppId={trackId} />;
              case "privacy":
        return <PrivacyPolicy />;

      case "terms":
        return <Terms />;

      case "refund":
        return <RefundPolicy />;
      case "admin":
        return (
          <AdminDashboard
            token={adminToken}
            adminInfo={adminUser}
            onLoginSuccess={(token, user) => {
              setAdminToken(token);
              setAdminUser(user);
              localStorage.setItem("csc_admin_token", token);
              localStorage.setItem("csc_admin_user", JSON.stringify(user));
            }}
          />
        );
      default:
        return (
          <Home
            setCurrentTab={setCurrentTab}
            setSelectedServiceId={setSelectedServiceId}
            onSelectServiceToApply={(id) => {
              setSelectedServiceId(id);
              setCurrentTab("apply");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white">
      {/* Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If moving away from Tracking, clear track ID query params
          if (tab !== "track" && window.location.search) {
            window.history.pushState({}, "", window.location.pathname);
            setTrackId("");
          }
        }}
        isAdminLoggedIn={!!adminToken}
        onLogout={handleAdminLogout}
      />

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="animate-fade-in transition-all">
          {renderActiveTab()}
        </div>
      </main>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}
