import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-gray-600">
            Your privacy is important to us. This policy explains how we collect and use your information.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-7">

          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              1. Introduction
            </h2>
            <p>
              Rapport respects your privacy and is committed to protecting
              your personal information. This Privacy Policy explains how
              we collect, use, and safeguard your data when you use our website
              and services.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full name and contact details (mobile number, email)</li>
              <li>Delivery address for SIM activation</li>
              <li>KYC information required by telecom regulations</li>
              <li>Payment details (processed securely via payment gateways)</li>
            </ul>
          </div>

          {/* How We Use Information */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process SIM activation and port requests</li>
              <li>To deliver SIM cards at your doorstep</li>
              <li>To provide customer support</li>
              <li>To improve our services and user experience</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              4. Data Protection & Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              personal information from unauthorized access, misuse, or
              disclosure. However, no online system can guarantee 100% security.
            </p>
          </div>

          {/* Sharing Information */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              5. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal data. Information may
              be shared only with authorized telecom partners and service
              providers strictly for service fulfillment purposes.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              6. Use of Cookies
            </h2>
            <p>
              Our website may use cookies to enhance user experience and
              analyze website traffic. You can choose to disable cookies
              in your browser settings.
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              7. Your Rights
            </h2>
            <p>
              You have the right to request access, correction, or deletion
              of your personal data. For such requests, please contact our
              support team.
            </p>
          </div>

          {/* Policy Updates */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              8. Changes to Privacy Policy
            </h2>
            <p>
              Rapport reserves the right to update this Privacy Policy at
              any time. Users are advised to review this page periodically
              for updates.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy,
              please contact us at:
            </p>
            <p className="mt-2 font-semibold">
              Email: support@Rapport.com
            </p>
            <p className="font-semibold">
              Phone: +91 98765 43210
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;
