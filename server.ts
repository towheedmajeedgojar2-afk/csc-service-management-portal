import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
const app = express();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
const PORT = 3000;
app.use(
  cors({
    origin: "https://csc-service-management-portal-le5tyht7o-towheed-csc.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set up larger limit for base64 file uploads (PDFs, images)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "applications.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pre-seeded high-fidelity mock data from Jammu & Kashmir
const initialSeedData = [
  {
    id: "CSC-DOM-434701",
    serviceType: "domicile",
    serviceName: "Jammu & Kashmir Domicile Certificate",
    amount: 150,
    status: "Completed",
    createdAt: "2026-07-10T10:30:00.000Z",
    personalDetails: {
      fullName: "Mohammad Rafiq Bhat",
      guardianName: "S/o Abdul Gani Bhat",
      dob: "1994-04-12",
      gender: "Male",
      mobile: "+91 9906123456",
      email: "rafiqbhat@gmail.com",
      aadhaar: "123456789012",
      address: "Main Bazar, Uttersoo",
      district: "Anantnag",
      tehsil: "Shangus",
      village: "Uttersoo"
    },
    familyDetails: {
      fatherName: "Abdul Gani Bhat",
      motherName: "Haleema Begum",
      familyMembers: "Mohammad Rafiq Bhat (Self), Haleema Begum (Mother)",
      familyId: "FID-882193"
    },
    bankDetails: {
      accountHolder: "Mohammad Rafiq Bhat",
      bankName: "J&K Bank",
      accountNo: "0123040100002345",
      ifsc: "JAKA0UTTERSO"
    },
    documents: [
      { name: "Aadhaar Card", dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..." },
      { name: "Passport Size Photo", dataUrl: "data:image/png;base64,iVBORw0KG..." },
      { name: "Residence Proof", dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..." }
    ],
    payment: {
      amount: 150,
      status: "Paid",
      txId: "UPI9921827481",
      method: "UPI / QR",
      date: "2026-07-10T10:35:00.000Z"
    },
    govReference: "JK-DOM-2026-991823",
    adminNotes: "Manually applied on JK ServicePlus portal. Certificate approved and issued.",
    history: [
      { status: "Payment Received", date: "2026-07-10T10:35:00.000Z", comment: "Payment verified successfully" },
      { status: "Document Verification", date: "2026-07-10T14:20:00.000Z", comment: "All submitted documents verified as authentic" },
      { status: "Applied", date: "2026-07-11T09:15:00.000Z", comment: "Application submitted on state portal" },
      { status: "Processing", date: "2026-07-12T11:00:00.000Z", comment: "Under process by Tehsildar Shangus" },
      { status: "Completed", date: "2026-07-15T16:45:00.000Z", comment: "Domicile Certificate issued and downloaded" }
    ]
  },
  {
    id: "CSC-INC-434702",
    serviceType: "income",
    serviceName: "Income Certificate",
    amount: 120,
    status: "Document Verification",
    createdAt: "2026-07-18T14:22:00.000Z",
    personalDetails: {
      fullName: "Sajad Ahmad Ganie",
      guardianName: "S/o Ghulam Hassan Ganie",
      dob: "1998-08-22",
      gender: "Male",
      mobile: "+91 6006543210",
      email: "sajadganie@gmail.com",
      aadhaar: "888877776666",
      address: "Ganie Mohalla, Uttersoo",
      district: "Anantnag",
      tehsil: "Shangus",
      village: "Uttersoo"
    },
    familyDetails: {
      fatherName: "Ghulam Hassan Ganie",
      motherName: "Saja Begum",
      familyMembers: "Ghulam Hassan (Father), Saja Begum (Mother), Sajad Ahmad (Self)",
      familyId: ""
    },
    bankDetails: {
      accountHolder: "Sajad Ahmad Ganie",
      bankName: "State Bank of India",
      accountNo: "33445566778",
      ifsc: "SBIN0003214"
    },
    documents: [
      { name: "Aadhaar Card", dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..." },
      { name: "Chaukidar Salary Report", dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..." }
    ],
    payment: {
      amount: 120,
      status: "Paid",
      txId: "UPI1120839510",
      method: "UPI / QR",
      date: "2026-07-18T14:28:00.000Z"
    },
    govReference: "",
    adminNotes: "Awaiting physical verification of the Chaukidar income report.",
    history: [
      { status: "Payment Received", date: "2026-07-18T14:28:00.000Z", comment: "Payment received for Income Certificate application" },
      { status: "Document Verification", date: "2026-07-19T10:00:00.000Z", comment: "Verifying reported annual family income is under threshold" }
    ]
  },
  {
    id: "CSC-SCH-434703",
    serviceType: "scholarship",
    serviceName: "Scholarship Forms",
    amount: 120,
    status: "Applied",
    createdAt: "2026-07-19T09:12:00.000Z",
    personalDetails: {
      fullName: "Aarifat Jaan",
      guardianName: "D/o Mohammad Yusuf Gojar",
      dob: "2005-11-05",
      gender: "Female",
      mobile: "+91 7006123987",
      email: "aarifatjaan01@gmail.com",
      aadhaar: "444455556666",
      address: "Gujjar Basti, Sundbrari, Uttersoo",
      district: "Anantnag",
      tehsil: "Shangus",
      village: "Sundbrari"
    },
    familyDetails: {
      fatherName: "Mohammad Yusuf Gojar",
      motherName: "Zeba Begum",
      familyMembers: "Mohammad Yusuf (Father), Aarifat Jaan (Self)",
      familyId: "FID-2291"
    },
    bankDetails: {
      accountHolder: "Aarifat Jaan",
      bankName: "J&K Bank",
      accountNo: "0123040291029182",
      ifsc: "JAKA0UTTERSO"
    },
    documents: [
      { name: "Aadhaar Card", dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJ..." },
      { name: "12th Class Marksheet", dataUrl: "data:application/pdf;base64,JVBERi0x..." },
      { name: "Income Certificate", dataUrl: "data:application/pdf;base64,JVBERi0x..." }
    ],
    payment: {
      amount: 120,
      status: "Paid",
      txId: "UPI8872164921",
      method: "UPI / QR",
      date: "2026-07-19T09:20:00.000Z"
    },
    govReference: "NSP-2026-ST-8821",
    adminNotes: "Applied successfully on National Scholarship Portal (NSP). Printout shared with applicant.",
    history: [
      { status: "Payment Received", date: "2026-07-19T09:20:00.000Z", comment: "Fee collected" },
      { status: "Document Verification", date: "2026-07-19T14:00:00.000Z", comment: "Marksheet and ST category verified" },
      { status: "Applied", date: "2026-07-20T11:30:00.000Z", comment: "Submitted on NSP Portal with Ref: NSP-2026-ST-8821" }
    ]
  },
  {
    id: "CSC-RBA-434704",
    serviceType: "rba",
    serviceName: "RBA Certificate",
    amount: 180,
    status: "Processing",
    createdAt: "2026-07-15T11:40:00.000Z",
    personalDetails: {
      fullName: "Showkat Ahmad Shah",
      guardianName: "S/o Ghulam Rasool Shah",
      dob: "1991-02-15",
      gender: "Male",
      mobile: "+91 9149765432",
      email: "showkatshah@gmail.com",
      aadhaar: "555511112222",
      address: "Shah Mohalla, Sundbrari",
      district: "Anantnag",
      tehsil: "Shangus",
      village: "Sundbrari"
    },
    familyDetails: {
      fatherName: "Ghulam Rasool Shah",
      motherName: "Fazi Begum",
      familyMembers: "Ghulam Rasool (Father), Fazi Begum (Mother), Showkat Ahmad (Self)",
      familyId: ""
    },
    bankDetails: {
      accountHolder: "Showkat Ahmad Shah",
      bankName: "J&K Bank",
      accountNo: "0123040100099881",
      ifsc: "JAKA0UTTERSO"
    },
    documents: [
      { name: "Aadhaar Card", dataUrl: "data:application/pdf;base64,JVBERi0x..." },
      { name: "Land Revenue Records (Nakal)", dataUrl: "data:application/pdf;base64,JVBERi..." }
    ],
    payment: {
      amount: 180,
      status: "Paid",
      txId: "UPI3309128312",
      method: "UPI / QR",
      date: "2026-07-15T11:55:00.000Z"
    },
    govReference: "JK-RBA-2026-44122",
    adminNotes: "File submitted to Patwari Sundbrari for verification of 15 years local continuous residence.",
    history: [
      { status: "Payment Received", date: "2026-07-15T11:55:00.000Z", comment: "Payment received" },
      { status: "Document Verification", date: "2026-07-15T16:30:00.000Z", comment: "Land Nakal documents scanned and verified" },
      { status: "Applied", date: "2026-07-16T10:00:00.000Z", comment: "Applied on JK ServicePlus portal" },
      { status: "Processing", date: "2026-07-17T12:00:00.000Z", comment: "Forwarded to Naib Tehsildar office" }
    ]
  },
  {
    id: "CSC-PMK-434705",
    serviceType: "pmkisan",
    serviceName: "PM Kisan",
    amount: 100,
    status: "Payment Received",
    createdAt: "2026-07-20T16:10:00.000Z",
    personalDetails: {
      fullName: "Zubair Ahmad Gojar",
      guardianName: "S/o Majeed Gojar",
      dob: "1983-06-10",
      gender: "Male",
      mobile: "+91 6006821511",
      email: "zubairgojar@gmail.com",
      aadhaar: "999988887777",
      address: "Main Basti, Uttersoo",
      district: "Anantnag",
      tehsil: "Shangus",
      village: "Uttersoo"
    },
    familyDetails: {
      fatherName: "Majeed Gojar",
      motherName: "Saja Begum",
      familyMembers: "Majeed Gojar (Father), Zubair Ahmad (Self)",
      familyId: "FID-7731"
    },
    bankDetails: {
      accountHolder: "Zubair Ahmad Gojar",
      bankName: "J&K Bank",
      accountNo: "0123040100234123",
      ifsc: "JAKA0UTTERSO"
    },
    documents: [
      { name: "Aadhaar Card", dataUrl: "data:application/pdf;base64,JVBERi..." },
      { name: "Land Passbook Proof", dataUrl: "data:application/pdf;base64,JVBERi..." }
    ],
    payment: {
      amount: 100,
      status: "Paid",
      txId: "UPI4491028391",
      method: "UPI / QR",
      date: "2026-07-20T16:15:00.000Z"
    },
    govReference: "",
    adminNotes: "New registration request. Needs uploading on PM Kisan official portal.",
    history: [
      { status: "Payment Received", date: "2026-07-20T16:15:00.000Z", comment: "Payment received. Waiting for verification." }
    ]
  }
];

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2));
}

// Read database helper
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file", err);
    return [];
  }
}

// Write database helper
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// ----------------------
// Express API Endpoints
// ----------------------

// 1. Submit Application (creates a temporary/pending payment application)
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Order creation failed",
    });
  }
});
app.post("/api/applications", (req, res) => {
  const { serviceType, serviceName, amount, personalDetails, familyDetails, bankDetails, documents } = req.body;

  if (!personalDetails?.fullName || !personalDetails?.guardianName || !personalDetails?.mobile || !personalDetails?.aadhaar) {
    return res.status(400).json({ error: "Missing mandatory personal details (Full Name, Guardian, Mobile, Aadhaar)" });
  }

  const applications = readDb();
  
  // Create temporary ID
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const tempId = `TEMP-${randNum}`;

  const newApp = {
    id: tempId,
    serviceType,
    serviceName,
    amount,
    status: "Pending Payment",
    createdAt: new Date().toISOString(),
    personalDetails,
    familyDetails: familyDetails || {},
    bankDetails: bankDetails || {},
    documents: documents || [],
    payment: {
      amount,
      status: "Pending",
      txId: "",
      method: "",
      date: ""
    },
    govReference: "",
    adminNotes: "",
    history: [
      {
        status: "Created",
        date: new Date().toISOString(),
        comment: "Application form submitted. Awaiting online payment."
      }
    ]
  };

  applications.push(newApp);
  writeDb(applications);

  res.json({ success: true, application: newApp });
});

// 2. Submit payment (converts TEMP ID to official CSC Service ID)
app.post("/api/applications/:id/pay", (req, res) => {
  const { id } = req.params;
  const { txId, method, amount } = req.body;

  const applications = readDb();
  const appIndex = applications.findIndex((a) => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const application = applications[appIndex];

  // Convert Temp ID to formal CSC Service ID
  const svcShortMap = {
    domicile: "DOM",
    income: "INC",
    category: "CAT",
    rba: "RBA",
    alc_osc: "ALC",
    ews: "EWS",
    pan: "PAN",
    ayushman: "AYU",
    pmkisan: "PMK",
    birth: "BRT",
    death: "DTH",
    scholarship: "SCH",
    other: "CSC"
  };

  const shortCode = svcShortMap[application.serviceType] || "CSC";
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  
  // Count existing official applications with this shortcode to increment
  const totalWithCode = applications.filter(a => a.id.startsWith(`CSC-${shortCode}-`)).length;
  const nextNum = (totalWithCode + 1).toString().padStart(4, "0");
  const officialId = `CSC-${shortCode}-${yearSuffix}${nextNum}`;

  application.id = officialId;
  application.status = "Payment Received";
  application.payment = {
    amount: amount || application.amount,
    status: "Paid",
    txId: txId || `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
    method: method || "UPI / QR",
    date: new Date().toISOString()
  };

  application.history.push({
    status: "Payment Received",
    date: new Date().toISOString(),
    comment: `Payment of ₹${application.payment.amount} verified successfully via ${application.payment.method}. Reference: ${application.payment.txId}. Official ID issued: ${officialId}`
  });

  writeDb(applications);
  res.json({ success: true, application });
});

// 3. Track application (get by ID)
app.get("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const applications = readDb();
  
  const application = applications.find(
    (a) => a.id.toUpperCase() === id.toUpperCase()
  );

  if (!application) {
    return res.status(404).json({ error: "Application not found. Please verify the Application ID." });
  }

  res.json(application);
});

// 4. Upload missing documents (from Customer Tracking Page)
app.post("/api/applications/:id/upload-missing", (req, res) => {
  const { id } = req.params;
  const { name, dataUrl } = req.body;

  if (!name || !dataUrl) {
    return res.status(400).json({ error: "Missing document name or content" });
  }

  const applications = readDb();
  const appIndex = applications.findIndex((a) => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const application = applications[appIndex];
  
  // Add or update document
  const docIndex = application.documents.findIndex(d => d.name === name);
  if (docIndex !== -1) {
    application.documents[docIndex].dataUrl = dataUrl;
  } else {
    application.documents.push({ name, dataUrl });
  }

  application.history.push({
    status: application.status,
    date: new Date().toISOString(),
    comment: `Customer uploaded document: ${name}`
  });

  writeDb(applications);
  res.json({ success: true, application });
});

// 5. Admin authentication
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Simple, robust static credentials for Towheed Majeed Gojar CSC
  if (username === "admin" && password === "cscadmin@uttersoo") {
    res.json({
      success: true,
      token: "csc-admin-token-towheed-434741630021",
      user: {
        name: "Towheed Majeed Gojar",
        cscId: "434741630021",
        email: "towheedmajeed01@gmail.com"
      }
    });
  } else {
    res.status(401).json({ error: "Invalid admin username or password" });
  }
});

// 6. Admin Auth verification middleware helper
function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  return authHeader === "Bearer csc-admin-token-towheed-434741630021";
}

// 7. Admin: Get all applications (requires admin token)
app.get("/api/admin/applications", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const applications = readDb();
  // Return descending by creation date
  const sorted = [...applications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

// 8. Admin: Get statistics (requires admin token)
app.get("/api/admin/stats", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const applications = readDb();
  
  const stats = {
    total: applications.length,
    pendingPayment: applications.filter(a => a.status === "Pending Payment").length,
    paymentReceived: applications.filter(a => a.status === "Payment Received").length,
    docVerification: applications.filter(a => a.status === "Document Verification").length,
    applied: applications.filter(a => a.status === "Applied").length,
    processing: applications.filter(a => a.status === "Processing").length,
    completed: applications.filter(a => a.status === "Completed").length,
    rejected: applications.filter(a => a.status === "Rejected").length,
    totalRevenue: applications
      .filter(a => a.payment && a.payment.status === "Paid")
      .reduce((sum, a) => sum + (a.payment.amount || 0), 0)
  };

  res.json(stats);
});

// 9. Admin: Update application status or reference details
app.put("/api/admin/applications/:id", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const { id } = req.params;
  const { status, govReference, adminNotes, notificationMsg } = req.body;

  const applications = readDb();
  const appIndex = applications.findIndex((a) => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found" });
  }

  const application = applications[appIndex];
  const oldStatus = application.status;

  if (status && status !== oldStatus) {
    application.status = status;
    application.history.push({
      status,
      date: new Date().toISOString(),
      comment: `Status updated from "${oldStatus}" to "${status}"` + (adminNotes ? `. Notes: ${adminNotes}` : "")
    });
  } else if (adminNotes) {
    application.history.push({
      status: application.status,
      date: new Date().toISOString(),
      comment: `Admin added note: ${adminNotes}`
    });
  }

  if (govReference !== undefined) {
    application.govReference = govReference;
  }

  if (adminNotes !== undefined) {
    application.adminNotes = adminNotes;
  }

  writeDb(applications);
  res.json({ success: true, application });
});

// 10. Admin: Download full backup of database
app.get("/api/admin/backup", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const dbData = readDb();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=csc_portal_backup.json");
  res.json(dbData);
});


// ----------------------------
// Serve static frontend assets
// ----------------------------
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Towheed Majeed Gojar CSC Server running on port ${PORT}`);
});
