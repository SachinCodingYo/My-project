import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Support: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Customer <span className="text-blue-600">Support</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're here to help you with SIM activation, porting,
            recharge plans and any service related queries.
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-gray-100 p-8 rounded-xl shadow">
            <FaPhoneAlt className="text-3xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="bg-gray-100 p-8 rounded-xl shadow">
            <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600">support@Rapport.com</p>
          </div>

          <div className="bg-gray-100 p-8 rounded-xl shadow">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Office Address</h3>
            <p className="text-gray-600">
              Gurugram, Haryana, India
            </p>
          </div>

        </div>
      </section>

      {/* SUPPORT FORM */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6">

          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Raise a Support Ticket
            </h2>

            <form className="space-y-6">

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Your Issue
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Describe your issue..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Submit Request
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">

            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">
                How long does SIM delivery take?
              </h4>
              <p className="text-gray-600 text-sm">
                In selected cities, SIM delivery is completed within 2 hours.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">
                How can I port my number?
              </h4>
              <p className="text-gray-600 text-sm">
                You can select the port number option and our executive will
                assist you at your doorstep.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">
                Is doorstep activation safe?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes, we follow secure KYC verification as per telecom regulations.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Support;
