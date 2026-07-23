import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        By using this website, users agree to provide accurate information and
        valid documents for CSC and digital service applications.
      </p>

      <p className="mb-4">
        The service provider is not responsible for delays caused by government
        portals, incorrect user information, or third-party technical issues.
      </p>

      <p className="mb-4">
        Payments are processed through Razorpay, and users must comply with
        applicable laws and platform policies.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Support</h2>
      <p>Email: support@cscportal.com</p>
      <p>Phone: +91 6006821511</p>
    </div>
  );
}