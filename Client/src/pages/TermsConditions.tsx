import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Terms & <span className="text-blue-600">Conditions</span>
          </h1>
          <p className="text-gray-600">
            Please read these terms carefully before using our website and services.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-7">

          {/* Acceptance */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Rapport.com, you agree to comply with
              and be bound by these Terms & Conditions. If you do not agree
              with any part of these terms, please do not use our website.
            </p>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              2. Services Provided
            </h2>
            <p>
              Rapport provides doorstep SIM delivery, porting assistance,
              prepaid and postpaid connection services through authorized
              telecom partners. Service availability may vary based on
              location.
            </p>
          </div>

          {/* User Responsibilities */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate personal and KYC information.</li>
              <li>Ensure availability at the selected delivery address.</li>
              <li>Comply with telecom regulatory requirements.</li>
              <li>Use services only for lawful purposes.</li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              4. Payments & Pricing
            </h2>
            <p>
              All payments must be made through approved payment methods
              available on the website. Prices are subject to change without
              prior notice. Refunds will be governed by our Refund Policy.
            </p>
          </div>

          {/* Activation & Delivery */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              5. SIM Activation & Delivery
            </h2>
            <p>
              Delivery timelines are estimated and may vary due to operational
              or regulatory factors. Activation is subject to successful KYC
              verification and telecom operator approval.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All content on this website including logos, text, graphics,
              and design is the property of Rapport and may not be copied or
              reproduced without permission.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              Rapport shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our services.
            </p>
          </div>

          {/* Termination */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              8. Termination of Service
            </h2>
            <p>
              We reserve the right to suspend or terminate services in cases
              of fraud, misuse, or violation of these terms.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              9. Governing Law
            </h2>
            <p>
              These Terms & Conditions shall be governed by and interpreted
              in accordance with the laws of India. Any disputes shall be
              subject to the jurisdiction of courts in Gurugram, Haryana.
            </p>
          </div>

          {/* Changes */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              10. Changes to Terms
            </h2>
            <p>
              Rapport reserves the right to update or modify these Terms &
              Conditions at any time without prior notice.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              11. Contact Information
            </h2>
            <p>
              For any questions regarding these terms, please contact us:
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

export default TermsConditions;
