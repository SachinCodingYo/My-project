import React from "react";
import { FaMotorcycle, FaMoneyBillWave, FaClock, FaUserCheck } from "react-icons/fa";

const Hiring: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Hiring <span className="text-blue-600">Delivery Executives</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Join Rapport and become a part of India’s fastest growing
            doorstep SIM delivery platform.
          </p>
        </div>
      </section>

      {/* JOB HIGHLIGHTS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <FaMotorcycle className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Field Job</h3>
            <p className="text-sm text-gray-600">Doorstep SIM Delivery</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <FaMoneyBillWave className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Good Earnings</h3>
            <p className="text-sm text-gray-600">Attractive incentives</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <FaClock className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Flexible Hours</h3>
            <p className="text-sm text-gray-600">Work at your convenience</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <FaUserCheck className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold">Simple Process</h3>
            <p className="text-sm text-gray-600">Quick onboarding</p>
          </div>

        </div>
      </section>

      {/* JOB DETAILS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Job Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Deliver SIM cards to customer doorstep.</li>
              <li>Assist customers with basic KYC verification.</li>
              <li>Ensure timely delivery and activation process.</li>
              <li>Maintain professional behavior with customers.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Requirements
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Must have a two-wheeler and valid driving license.</li>
              <li>Basic smartphone knowledge.</li>
              <li>Good communication skills.</li>
              <li>Minimum 10th pass preferred.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Benefits
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Competitive earnings with incentives.</li>
              <li>Flexible working hours.</li>
              <li>Weekly payout options.</li>
              <li>Growth opportunities.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">

          <div className="bg-white shadow-xl rounded-2xl p-10">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Apply Now
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
                  City
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter your city"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Submit Application
              </button>

            </form>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Hiring;
