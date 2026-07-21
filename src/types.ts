export interface PersonalDetails {
  fullName: string;
  guardianName: string; // S/o, D/o, W/o
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  aadhaar: string;
  address: string;
  district: string;
  tehsil: string;
  village: string;
}

export interface FamilyDetails {
  fatherName: string;
  motherName: string;
  familyMembers: string;
  familyId?: string;
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
}

export interface DocumentFile {
  name: string;
  dataUrl: string; // Base64 formatted string
}

export interface PaymentDetails {
  amount: number;
  status: "Pending" | "Paid";
  txId: string;
  method: string;
  date: string;
}

export interface HistoryItem {
  status: string;
  date: string;
  comment?: string;
}

export interface Application {
  id: string; // Official CSC ID or Temp ID
  serviceType: string;
  serviceName: string;
  amount: number;
  status: "Pending Payment" | "Payment Received" | "Document Verification" | "Applied" | "Processing" | "Completed" | "Rejected";
  createdAt: string;
  personalDetails: PersonalDetails;
  familyDetails: FamilyDetails;
  bankDetails: BankDetails;
  documents: DocumentFile[];
  payment: PaymentDetails;
  govReference: string;
  adminNotes: string;
  history: HistoryItem[];
}

export interface ServiceDefinition {
  id: string;
  name: string;
  shortCode: string;
  fee: number;
  description: string;
  requiredDocuments: string[];
  requiresBankDetails: boolean;
  requiresFamilyDetails: boolean;
}

export interface AdminUser {
  name: string;
  cscId: string;
  email: string;
}

export const J_K_SERVICES: ServiceDefinition[] = [
  {
    id: "domicile",
    name: "Jammu & Kashmir Domicile Certificate",
    shortCode: "DOM",
    fee: 150,
    description: "Official resident proof of Jammu & Kashmir Union Territory required for admissions, government jobs, and land ownership.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Residence Proof / Ration Card / Voter List (PDF)", "Signature Scan (Image)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "income",
    name: "Income Certificate",
    shortCode: "INC",
    fee: 120,
    description: "Proof of annual family income, required for scholarships, subsidised services, and school admissions.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Salary Slip or Chaukidar / Nambardar Income Report (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "category",
    name: "Category Certificate (ST/SC/OBC)",
    shortCode: "CAT",
    fee: 150,
    description: "Official certification of reserved caste category, issued under J&K Reservation Rules.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Father's Category Certificate or Land Record Nakal (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "rba",
    name: "RBA Certificate (Resident of Backward Area)",
    shortCode: "RBA",
    fee: 180,
    description: "Issued to citizens living in designated backward areas of J&K, granting specific reservation benefits.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Continuous 15 Years Residence Certificate / Patwari report (PDF)", "Land Nakal / Record of Rights (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "alc_osc",
    name: "ALC/OSC Certificate (Actual Line of Control / Other Social Castes)",
    shortCode: "ALC",
    fee: 180,
    description: "Issued to persons living near the Actual Line of Control / International Border or belonging to designated weak/underprivileged sections.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Tehsildar / Border Inhabitant Residence Verification (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "ews",
    name: "EWS Certificate (Economically Weaker Section)",
    shortCode: "EWS",
    fee: 200,
    description: "Income & asset certificate for reservation under the Economically Weaker Sections category.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Family Income Statement / Asset Declaration (PDF)", "Patwari Halqa report (PDF)"],
    requiresBankDetails: true,
    requiresFamilyDetails: true
  },
  {
    id: "pan",
    name: "PAN Card Application",
    shortCode: "PAN",
    fee: 150,
    description: "New Permanent Account Number (PAN) Card application through NSDL/UTIITSL.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Passport Size Photo (Image)", "Signature Scan (Image)"],
    requiresBankDetails: false,
    requiresFamilyDetails: false
  },
  {
    id: "ayushman",
    name: "Ayushman Golden Card",
    shortCode: "AYU",
    fee: 100,
    description: "Registration for PM-JAY SEHAT scheme, providing up to ₹5 Lakh cashless health cover per family.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Ration Card / PM-JAY Letter (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "pmkisan",
    name: "PM Kisan Registration",
    shortCode: "PMK",
    fee: 100,
    description: "Income support scheme of ₹6,000 per year for landholding farmer families across J&K.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Land Ownership Passbook / Nakal (PDF)", "Bank Passbook Front Page (PDF)"],
    requiresBankDetails: true,
    requiresFamilyDetails: true
  },
  {
    id: "birth",
    name: "Birth Certificate",
    shortCode: "BRT",
    fee: 150,
    description: "Official registration and certificate for child birth, issued under municipal / block authorities.",
    requiredDocuments: ["Hospital Birth Report / Chaukidar Report (PDF)", "Parent's Aadhaar Cards (PDF)", "Affidavit / Delay Permission if older than 21 days (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "death",
    name: "Death Certificate",
    shortCode: "DTH",
    fee: 150,
    description: "Official registration and certificate of death issued by block authorities or local bodies.",
    requiredDocuments: ["Hospital Death Report or Cremation/Burial Certificate (PDF)", "Deceased Aadhaar Card (PDF)", "Applicant ID Proof (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: true
  },
  {
    id: "scholarship",
    name: "Scholarship Forms",
    shortCode: "SCH",
    fee: 120,
    description: "Form submission for National Scholarship Portal (NSP), Post-Matric, Pre-Matric, or J&K Special Scholarship (PMSSS).",
    requiredDocuments: ["Aadhaar Card (PDF)", "Previous Year Class Marksheet (PDF)", "Annual Income Certificate (PDF)", "Caste/Category Certificate if applicable (PDF)", "Fee Receipt & Bonafide Certificate (PDF)"],
    requiresBankDetails: true,
    requiresFamilyDetails: true
  },
  {
    id: "other",
    name: "Other CSC Services",
    shortCode: "CSC",
    fee: 100,
    description: "General CSC services including Passport, Voter ID Card, JKSSB Forms, Driving License renewals, or billing.",
    requiredDocuments: ["Aadhaar Card (PDF)", "Supporting Documents depending on request (PDF)"],
    requiresBankDetails: false,
    requiresFamilyDetails: false
  }
];

export const J_K_DISTRICTS = [
  "Anantnag",
  "Bandipora",
  "Baramulla",
  "Budgam",
  "Doda",
  "Ganderbal",
  "Jammu",
  "Kathua",
  "Kishtwar",
  "Kulgam",
  "Kupwara",
  "Poonch",
  "Pulwama",
  "Ramban",
  "Reasi",
  "Samba",
  "Shopian",
  "Srinagar",
  "Udhampur"
];
