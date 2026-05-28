import React from "react";

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Website <span className="text-blue-600">Disclaimer</span>
          </h1>
          <p className="text-gray-600">
            Please read this disclaimer carefully before using our services.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10 text-gray-700 leading-7">

          {/* General Information */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              1. General Information
            </h2>
            <p>
              The information provided on Rapport.com is for general
              informational purposes only. While we strive to keep
              information accurate and up to date, we make no guarantees
              of completeness, reliability, or accuracy.
            </p>
          </div>

          {/* No Operator Ownership */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              2. No Direct Ownership of Telecom Brands
            </h2>
            <p>
              Rapport is an authorized partner and not directly owned or
              operated by telecom service providers such as Jio, Airtel,
              Vi™, or BSNL. All trademarks and brand names belong to
              their respective owners.
            </p>
          </div>

          {/* Service Availability */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              3. Service Availability
            </h2>
            <p>
              Doorstep SIM delivery and activation services are subject
              to availability in selected cities and locations. We do not
              guarantee service availability in all areas.
            </p>
          </div>

          {/* External Links */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              4. External Links Disclaimer
            </h2>
            <p>
              Our website may contain links to third-party websites.
              We are not responsible for the content, privacy practices,
              or policies of those external sites.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              Rapport shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the
              use of our website or services.
            </p>
          </div>

          {/* Policy Changes */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              6. Changes to Disclaimer
            </h2>
            <p>
              We reserve the right to update or change this disclaimer
              at any time without prior notice. Users are encouraged to
              review this page periodically.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Disclaimer;
