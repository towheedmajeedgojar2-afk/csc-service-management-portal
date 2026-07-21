import React, { useState } from "react";
import { API_URL } from "../config";
import { CreditCard, CheckCircle, Smartphone, AlertCircle, Copy, Check, Printer } from "lucide-react";

interface PaymentSimulatorProps {
  application: any;
  onPaymentSuccess: (updatedApp: any) => void;
  onCancel: () => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
  application,
  onPaymentSuccess,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [updatedApplication, setUpdatedApplication] = useState<any>(null);
  
  // Card state inputs
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  // Formulate real UPI string targeting Towheed Majeed Gojar's account with exact fee amount
  const cscUpiAddress = "towheedmajeed01@okaxis";
  const upiName = "Towheed Majeed Gojar CSC";
  const upiUrl = `upi://pay?pa=${cscUpiAddress}&pn=${encodeURIComponent(upiName)}&am=${application.amount}&cu=INR&tn=${application.id}`;
  
  // Real dynamic QR code image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(cscUpiAddress);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate bank delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const txId = `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const response = await fetch(`${API_URL}/api/applications/${application.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txId,
          method: paymentMethod === "upi" ? "UPI / QR" : paymentMethod === "card" ? "Credit/Debit Card" : "Net Banking",
          amount: application.amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment registration failed");
      }

      const result = await response.json();
      if (result.success) {
        setUpdatedApplication(result.application);
        setPaymentSuccess(true);
      } else {
        alert("Server error confirming payment. Please retry.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing payment. Check connectivity.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (paymentSuccess && updatedApplication) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 font-sans">
        {/* Payment Receipt / Success Screen */}
        <div className="bg-white border border-slate-200 border-b-4 border-b-indigo-900 rounded-2xl p-6 shadow-md space-y-6" id="receipt-print-area">
          
          <div className="text-center space-y-2 pb-5 border-b border-slate-100 no-print">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-indigo-950 uppercase tracking-widest">Payment Completed</h2>
            <p className="text-xs text-slate-500 font-medium">Your application has been registered with the Union Territory portal agent.</p>
          </div>

          {/* Actual Invoice Receipt (Perfect for Printout) */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest">OFFICIAL CSC PAYMENT RECEIPT</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">CSC ID: 434741630021</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-orange-100 text-orange-950 font-black px-2.5 py-1 rounded uppercase tracking-wider">PAID</span>
                <p className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">{new Date(updatedApplication.payment.date).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">CSC SERVICE APPLICATION ID</span>
                <span className="font-mono text-xs font-bold text-orange-600">{updatedApplication.id}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">SERVICE TYPE</span>
                <span className="text-indigo-950 uppercase">{updatedApplication.serviceName}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">APPLICANT NAME</span>
                <span className="text-indigo-950 uppercase">{updatedApplication.personalDetails.fullName}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">MOBILE NUMBER</span>
                <span className="font-mono text-indigo-950">{updatedApplication.personalDetails.mobile}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">AADHAAR NUMBER</span>
                <span className="font-mono text-indigo-950">XXXX-XXXX-{updatedApplication.personalDetails.aadhaar.slice(-4)}</span>
              </div>
              <div>
                <span className="text-[9px] text-indigo-900 font-black uppercase tracking-wider block mb-0.5">RESIDENCE LOCATION</span>
                <span className="text-indigo-950 uppercase">{updatedApplication.personalDetails.village}, {updatedApplication.personalDetails.district}</span>
              </div>
            </div>

            {/* Receipt Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <th className="text-left py-2">DESCRIPTION</th>
                  <th className="text-right py-2">AMOUNT (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 text-slate-700 font-medium">
                  <td className="py-2.5">Statutory J&K Portal Fee & Facilitation charge for {updatedApplication.serviceName}</td>
                  <td className="text-right py-2.5 font-mono font-bold">₹{updatedApplication.payment.amount}.00</td>
                </tr>
                <tr className="font-black text-indigo-950">
                  <td className="py-3 uppercase tracking-wider text-[10px]">TOTAL PAID AMOUNT</td>
                  <td className="text-right py-3 font-mono text-sm text-orange-600">₹{updatedApplication.payment.amount}.00</td>
                </tr>
              </tbody>
            </table>

            {/* Transaction metadata */}
            <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4 space-y-1 font-medium">
              <div><strong>Gateway ID:</strong> {updatedApplication.payment.txId}</div>
              <div><strong>Method:</strong> {updatedApplication.payment.method}</div>
              <div><strong>VLE Signature:</strong> Towheed Majeed Gojar (Uttersoo)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end no-print">
            <button
              onClick={handlePrintReceipt}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
            >
              <Printer className="w-4 h-4 text-indigo-900" />
              <span>Print Payment Receipt</span>
            </button>
            <button
              onClick={() => onPaymentSuccess(updatedApplication)}
              className="px-4 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-all shadow-md shadow-indigo-200"
            >
              Go to Customer Tracking Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        {/* Header Banner */}
        <div className="bg-indigo-950 text-white px-6 py-4.5 border-b border-indigo-900 flex justify-between items-center">
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-white">CSC Gateway Payments</h3>
            <p className="text-[10px] text-indigo-300 font-mono mt-0.5">TEMP ID: {application.id}</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-indigo-300 block uppercase font-black tracking-wider">Payable Amount</span>
            <span className="text-base font-black text-orange-400 font-mono">₹{application.amount}</span>
          </div>
        </div>

        {/* Payment Forms */}
        <div className="p-6 space-y-6">
          {/* Service detail pill */}
          <div className="bg-indigo-50/50 text-indigo-950 border border-indigo-100 rounded-xl p-4 text-xs flex justify-between items-center font-semibold">
            <div>
              <strong className="text-indigo-950 uppercase tracking-wide text-xs">{application.serviceName}</strong>
              <span className="block text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Applicant: {application.personalDetails.fullName}</span>
            </div>
            <span className="text-[9px] bg-orange-100 border border-orange-200 text-orange-950 px-2 py-1 rounded font-black uppercase tracking-wider shrink-0">
              {application.serviceType}
            </span>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center gap-1.5 border transition-all ${
                paymentMethod === "upi"
                  ? "bg-indigo-50 border-indigo-900 text-indigo-950"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Smartphone className={`w-4 h-4 ${paymentMethod === "upi" ? "text-orange-500" : "text-slate-400"}`} />
              <span>UPI Scan QR</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center gap-1.5 border transition-all ${
                paymentMethod === "card"
                  ? "bg-indigo-50 border-indigo-900 text-indigo-950"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <CreditCard className={`w-4 h-4 ${paymentMethod === "card" ? "text-orange-500" : "text-slate-400"}`} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("netbanking")}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg flex flex-col items-center gap-1.5 border transition-all ${
                paymentMethod === "netbanking"
                  ? "bg-indigo-50 border-indigo-900 text-indigo-950"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Smartphone className={`w-4 h-4 ${paymentMethod === "netbanking" ? "text-orange-500" : "text-slate-400"}`} />
              <span>Net Banking</span>
            </button>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-6">
            
            {/* Tab Content: UPI */}
            {paymentMethod === "upi" && (
              <div className="space-y-5 text-center flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500 max-w-sm font-semibold">
                  Scan this official dynamic UPI QR with <strong>BHIM, GPay, PhonePe, Paytm,</strong> or any UPI banking app to pay.
                </p>

                {/* UPI QR Display */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-md inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    width={180}
                    height={180}
                    referrerPolicy="no-referrer"
                    className="mx-auto"
                  />
                  <div className="text-[9px] text-slate-400 font-mono mt-3 uppercase font-bold tracking-wider">
                    {cscUpiAddress}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-indigo-950 bg-slate-50 hover:bg-indigo-50/50 transition-colors flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-orange-500" />
                        <span>Copied Address!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-900" />
                        <span>Copy VLE UPI ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content: Card */}
            {paymentMethod === "card" && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900">Cardholder Name</label>
                  <input
                    type="text"
                    required={paymentMethod === "card"}
                    placeholder="e.g. MOHAMMAD RAFIQ BHAT"
                    className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 uppercase font-bold text-indigo-950 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900">Card Number</label>
                  <input
                    type="text"
                    required={paymentMethod === "card"}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    placeholder="4347 1630 0021 5111"
                    className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-mono tracking-wider text-indigo-950 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900">Expiry Date</label>
                    <input
                      type="text"
                      required={paymentMethod === "card"}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                      placeholder="MM/YY"
                      className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-mono text-indigo-950 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900">CVV</label>
                    <input
                      type="password"
                      required={paymentMethod === "card"}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="•••"
                      className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-mono text-center text-indigo-950 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Netbanking */}
            {paymentMethod === "netbanking" && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-indigo-900">Select J&K Regional / National Bank</label>
                  <select className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-900 focus:border-indigo-900 font-bold text-indigo-950 text-xs bg-white">
                    <option value="jkb">J&K Bank (Jammu & Kashmir Bank Ltd)</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Redirects to the selected bank's retail secure credentials portal upon clicking pay.
                </p>
              </div>
            )}

            {/* Notice */}
            <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-3.5 text-[10px] text-indigo-950 flex gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                To simulate a complete successful API database write without actual money debit, please click the <strong>Confirm Payment</strong> button below.
              </span>
            </div>

            {/* Submission Actions */}
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel / Change Form
              </button>
              
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Securing Transaction...</span>
                ) : (
                  <span>Confirm Simulation Payment</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
