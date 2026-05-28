import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Refund <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-gray-600">
            Please read our refund policy carefully before placing your order.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-7">

          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              1. General Policy
            </h2>
            <p>
              At Rapport, customer satisfaction is our priority. Refunds are
              processed in genuine cases where services could not be delivered
              due to technical or operational issues.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              2. Eligibility for Refund
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment was successfully made but SIM was not delivered.</li>
              <li>Order was cancelled before SIM activation.</li>
              <li>Duplicate payment was made due to technical error.</li>
            </ul>
          </div>

          {/* Non Refundable */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              3. Non-Refundable Cases
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SIM has already been activated successfully.</li>
              <li>Incorrect details provided by customer.</li>
              <li>Port request rejected due to telecom operator rules.</li>
            </ul>
          </div>

          {/* Refund Timeline */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              4. Refund Timeline
            </h2>
            <p>
              Approved refunds will be processed within 5–7 working days.
              The amount will be credited back to the original payment method.
            </p>
          </div>

          {/* How to Request */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              5. How to Request a Refund
            </h2>
            <p>
              To request a refund, please contact our support team at:
            </p>
            <p className="mt-2 font-semibold">
              Email: support@Rapport.com
            </p>
            <p className="font-semibold">
              Phone: +91 98765 43210
            </p>
          </div>

          {/* Final Note */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              6. Policy Updates
            </h2>
            <p>
              Rapport reserves the right to modify this refund policy at any
              time without prior notice. Customers are advised to review this
              page periodically.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default RefundPolicy;
