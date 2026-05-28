import React from "react";

const RechargePlansInfo = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-10">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Recharge Plans Information
        </h1>

        <p className="text-gray-600 mb-6">
          At SimConnect, we provide flexible and affordable recharge plans
          for prepaid and postpaid customers. Our plans are designed to suit
          your daily data needs, unlimited calling requirements, and long-term
          validity preferences.
        </p>

        {/* Prepaid Plans */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Prepaid Recharge Plans
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Unlimited voice calling on all networks</li>
            <li>Daily data benefits (1GB / 1.5GB / 2GB per day)</li>
            <li>SMS benefits as per plan</li>
            <li>Validity ranging from 14 days to 365 days</li>
            <li>OTT subscription benefits (selected plans only)</li>
          </ul>
        </section>

        {/* Postpaid Plans */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Postpaid Plans
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Fixed monthly billing cycle</li>
            <li>High-speed data with rollover benefits</li>
            <li>Unlimited national roaming</li>
            <li>Family add-on connections available</li>
            <li>Priority customer support</li>
          </ul>
        </section>

        {/* Important Notes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Important Notes
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Plan benefits may vary by region.</li>
            <li>Prices are subject to change without prior notice.</li>
            <li>Fair usage policy (FUP) may apply.</li>
            <li>Recharge confirmation will be sent via SMS/email.</li>
          </ul>
        </section>

        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="font-semibold text-blue-600 mb-2">
            Need Help Choosing a Plan?
          </h3>
          <p className="text-gray-600">
            Contact our support team or visit the Support page to get
            personalized assistance in selecting the best recharge plan
            for your needs.
          </p>
        </div>

      </div>
    </div>
  );
};

export default RechargePlansInfo;
