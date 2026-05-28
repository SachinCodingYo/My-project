import React from "react";
import { ShieldCheck, Lock, FileCheck, PhoneCall } from "lucide-react";

const SafetyInfo = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center py-20">
        <ShieldCheck className="mx-auto mb-4" size={40} />
        <h1 className="text-4xl font-bold mb-4">
          Your Safety is Our Priority
        </h1>
        <p className="opacity-90 max-w-2xl mx-auto">
          We are committed to protecting your data, ensuring secure
          transactions, and providing a safe digital experience.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

        {/* Card 1 */}
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <Lock className="text-blue-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold mb-3">
            Data Protection
          </h3>
          <p className="text-gray-600">
            Your personal information is encrypted and stored securely.
            We follow strict privacy standards to prevent unauthorized access.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <FileCheck className="text-blue-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold mb-3">
            Secure KYC Verification
          </h3>
          <p className="text-gray-600">
            All SIM activations and services require verified KYC
            documentation to prevent misuse and fraud.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <ShieldCheck className="text-blue-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold mb-3">
            Fraud Prevention
          </h3>
          <p className="text-gray-600">
            We actively monitor suspicious activities and take
            immediate action to ensure customer protection.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <PhoneCall className="text-blue-600 mb-4" size={32} />
          <h3 className="text-xl font-semibold mb-3">
            24/7 Support
          </h3>
          <p className="text-gray-600">
            Our support team is available round the clock
            to assist you with any concerns or issues.
          </p>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="bg-blue-50 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Have Safety Concerns?
        </h2>
        <p className="text-gray-600 mb-6">
          Contact our support team immediately.
        </p>
        <a
          href="/contactus"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Contact Support
        </a>
      </div>

    </div>
  );
};

export default SafetyInfo;