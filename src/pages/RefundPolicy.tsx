import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <p className="mb-4">
        Payments made for CSC and digital service applications are generally
        non-refundable once the application has been processed or submitted to
        the relevant authority.
      </p>

      <p className="mb-4">
        If a payment is deducted but the service is not initiated due to a
        technical issue, the customer may request a refund within 7 working
        days.
      </p>

      <p className="mb-4">
        Approved refunds will be processed to the original payment method.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Support</h2>
      <p>Email: support@cscportal.com</p>
      <p>Phone: +91 6006821511</p>
    </div>
  );
}