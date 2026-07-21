import React, { useState } from "react";
import { J_K_SERVICES, J_K_DISTRICTS, ServiceDefinition } from "../types";
import { User, Users, Landmark, FileText, Upload, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

interface ApplicationFormProps {
  serviceId: string;
  onBack: () => void;
  onSubmitSuccess: (application: any) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  serviceId,
  onBack,
  onSubmitSuccess,
}) => {
  const activeService = J_K_SERVICES.find((s) => s.id === serviceId) || J_K_SERVICES[0];

  // 1. Personal Details State
  const [fullName, setFullName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Anantnag");
  const [tehsil, setTehsil] = useState("Shangus");
  const [village, setVillage] = useState("Uttersoo");

  // 2. Family Details State (Conditional)
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [familyMembers, setFamilyMembers] = useState("");
  const [familyId, setFamilyId] = useState("");

  // 3. Bank Details State (Conditional)
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("J&K Bank");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("JAKA0UTTERSO");

  // 4. Documents State
  // Format: { [docName]: { name: string, dataUrl: string } }
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: { name: string; dataUrl: string } }>({});
  
  // Validation / Loading States
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActiveDoc, setDragActiveDoc] = useState<string | null>(null);

  // File to base64 conversion helper
  const processFile = (docName: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedDocs((prev) => ({
        ...prev,
        [docName]: {
          name: file.name,
          dataUrl: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(docName, e.target.files[0]);
    }
  };

  const handleDragOver = (docName: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(docName);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(null);
  };

  const handleDrop = (docName: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDoc(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(docName, e.dataTransfer.files[0]);
    }
  };

  const removeDoc = (docName: string) => {
    setUploadedDocs((prev) => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // --- VALIDATION RULES ---
    if (!fullName.trim()) errors.push("Full Name is mandatory.");
    if (!guardianName.trim()) errors.push("Guardian (S/o, D/o, W/o) detail is mandatory.");
    
    // Mobile Validation (exactly 10 digits after spaces/+91 filtering)
    const rawMobile = mobile.replace(/\D/g, "");
    const cleanMobile = rawMobile.startsWith("91") && rawMobile.length > 10 ? rawMobile.slice(2) : rawMobile;
    if (cleanMobile.length !== 10) {
      errors.push("Mobile number must be a valid 10-digit Indian number.");
    }

    // Aadhaar Validation (exactly 12 digits)
    const cleanAadhaar = aadhaar.replace(/\D/g, "");
    if (cleanAadhaar.length !== 12) {
      errors.push("Aadhaar Card number must be exactly 12 digits.");
    }

    // Conditional Family Validation
    if (activeService.requiresFamilyDetails) {
      if (!fatherName.trim()) errors.push("Father's Name is mandatory under Family Details.");
      if (!motherName.trim()) errors.push("Mother's Name is mandatory under Family Details.");
    }

    // Conditional Bank Validation
    if (activeService.requiresBankDetails) {
      if (!accountHolder.trim()) errors.push("Account Holder Name is mandatory.");
      if (!bankName.trim()) errors.push("Bank Name is mandatory.");
      if (!accountNo.trim()) errors.push("Account Number is mandatory.");
      if (!ifsc.trim()) errors.push("IFSC Code is mandatory.");
    }

    // Document Upload Validation (Make sure Aadhaar and Photo are uploaded)
    activeService.requiredDocuments.forEach((doc) => {
      if (!uploadedDocs[doc]) {
        errors.push(`Please upload supporting document: "${doc}"`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);
    setIsSubmitting(true);

    // Structure files for API payload
    const documentsPayload = Object.keys(uploadedDocs).map((key) => ({
      name: key,
      dataUrl: uploadedDocs[key].dataUrl,
    }));

    const payload = {
      serviceType: activeService.id,
      serviceName: activeService.name,
      amount: activeService.fee,
      personalDetails: {
        fullName,
        guardianName,
        dob,
        gender,
        mobile: `+91 ${cleanMobile}`,
        email,
        aadhaar: cleanAadhaar,
        address,
        district,
        tehsil,
        village,
      },
      familyDetails: {
        fatherName,
        motherName,
        familyMembers,
        familyId,
      },
      bankDetails: {
        accountHolder: activeService.requiresBankDetails ? accountHolder : "",
        bankName: activeService.requiresBankDetails ? bankName : "",
        accountNo: activeService.requiresBankDetails ? accountNo : "",
        ifsc: activeService.requiresBankDetails ? ifsc : "",
      },
      documents: documentsPayload,
    };

    try {
      const response = await fetch("https://csc-service-management-portal.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const result = await response.json();
      if (result.success) {
        onSubmitSuccess(result.application);
      } else {
        setValidationErrors(["Could not submit. Please try again."]);
      }
    } catch (err) {
      console.error(err);
      setValidationErrors(["Network error during submission. Check your connectivity."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition-colors"
          id="back-btn-form"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-900" />
        </button>
        <div>
          <h2 className="text-xl font-black text-indigo-950 uppercase tracking-widest">Application Registration</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Applying for: <strong className="text-indigo-900 uppercase">{activeService.name}</strong> • Portal Fee: <strong className="text-orange-600">₹{activeService.fee}</strong>
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-950 rounded-xl p-4 flex gap-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-black uppercase tracking-wider text-red-900 text-[10px] block mb-1.5">Please correct the following errors before submitting:</strong>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 border-b-4 border-b-indigo-900 rounded-2xl p-6 shadow-sm">
        
        {/* Section 1: Personal Details */}
        <section className="space-y-4" id="form-personal-section">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <User className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest">1. Applicant Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name (as in Aadhaar)"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* Guardian Detail */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">S/o, D/o, W/o <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. S/o Mohammad Yusuf"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 px-3 py-2.5 rounded-l-lg flex items-center font-mono font-bold text-xs">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="6006821511"
                  className="w-full p-2.5 border border-slate-200 rounded-r-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-mono font-semibold text-xs transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* Aadhaar Number */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Aadhaar Card Number (12 Digits) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="434741630021"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-mono tracking-wider font-semibold text-xs transition-all"
              />
            </div>

            {/* District */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">District <span className="text-red-500">*</span></label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              >
                {J_K_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Tehsil */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Tehsil <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                placeholder="e.g. Shangus"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* Village */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Village <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Uttersoo"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
              <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Detailed Address <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Ward No 3, Gujjar Basti, Uttersoo"
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Family Details (Render Conditionally) */}
        {activeService.requiresFamilyDetails && (
          <section className="space-y-4" id="form-family-section">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Users className="w-5 h-5 text-orange-500" />
              <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest">2. Family Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Father's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Enter Father's full name"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Mother's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Enter Mother's full name"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Family ID (Ration Card Number / optional)</label>
                <input
                  type="text"
                  value={familyId}
                  onChange={(e) => setFamilyId(e.target.value)}
                  placeholder="e.g. JK01A202681"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-mono uppercase font-semibold text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Family Member Names (Comma Separated)</label>
                <input
                  type="text"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(e.target.value)}
                  placeholder="e.g. Abdul Hamid Bhat, Fatima Begum, Shazia Hamid"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
                />
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Bank Account Details (Render Conditionally) */}
        {activeService.requiresBankDetails && (
          <section className="space-y-4" id="form-bank-section">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Landmark className="w-5 h-5 text-orange-500" />
              <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest">3. Bank Account Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Account Holder Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Enter Account Holder's name (as in passbook)"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Bank Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. J&K Bank"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-semibold text-xs transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Account Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 0123040100012234"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-mono font-semibold text-xs transition-all"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="font-black uppercase tracking-wider text-slate-500 text-[9px]">Bank IFSC Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. JAKA0UTTERSO"
                  className="p-2.5 border border-slate-200 rounded-lg bg-white text-indigo-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 font-mono uppercase font-semibold text-xs transition-all"
                />
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Document Uploads */}
        <section className="space-y-4" id="form-documents-section">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <FileText className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest">4. Supporting Document Uploads</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeService.requiredDocuments.map((docName) => {
              const fileUploaded = uploadedDocs[docName];
              const isDragActive = dragActiveDoc === docName;

              return (
                <div
                  key={docName}
                  onDragOver={(e) => handleDragOver(docName, e)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(docName, e)}
                  className={`border-2 border-dashed p-5 rounded-xl flex flex-col justify-between items-center text-center transition-all min-h-[160px] ${
                    fileUploaded
                      ? "border-orange-500 bg-orange-50/10"
                      : isDragActive
                      ? "border-indigo-500 bg-indigo-50/30"
                      : "border-slate-200 hover:border-indigo-300 bg-white"
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-950 block text-left mb-2">
                      {docName} <span className="text-red-500">*</span>
                    </span>

                    {fileUploaded ? (
                      <div className="flex items-center justify-between gap-3 bg-orange-100/50 border border-orange-200 rounded-lg px-3 py-2 w-full text-xs">
                        <div className="flex items-center gap-2 text-indigo-950 font-bold truncate">
                          <CheckCircle className="w-4 h-4 text-orange-500 shrink-0" />
                          <span className="truncate">{fileUploaded.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDoc(docName)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                          title="Remove uploaded document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                        <Upload className="w-8 h-8 text-slate-300 mb-1" />
                        <p className="text-[11px] font-medium text-slate-500">
                          Drag & drop or{" "}
                          <label className="text-orange-500 hover:text-orange-600 cursor-pointer underline font-bold">
                            browse
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              onChange={(e) => handleFileChange(docName, e)}
                              className="hidden"
                            />
                          </label>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">PDF or JPG/PNG image up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Submission Action */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            By submitting, you declare that all entered information is true to your knowledge.
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Proceed to Online Payment</span>
                <ArrowRight className="w-4 h-4 text-orange-500" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
