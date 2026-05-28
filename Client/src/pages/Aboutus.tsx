import React from "react";
import { FaRocket, FaUsers, FaShieldAlt } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

const Aboutus: React.FC = () => {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About <span className="text-blue-600">Rapport</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Rapport is India’s fastest growing doorstep SIM delivery platform.
            We make telecom services simple, fast and completely hassle-free.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 mb-4">
              Rapport was started with a simple idea — why should customers
              stand in long queues for SIM connections when everything else
              is delivered at home?
            </p>
            <p className="text-gray-600 mb-4">
              We partnered with leading telecom operators to provide
              prepaid, postpaid, porting and business SIM services directly
              at your doorstep within hours.
            </p>
            <p className="text-gray-600">
              Today, we proudly serve customers across major cities with
              speed, security and professionalism.
            </p>
          </div>

          <div>
            <img
              src="/delivery.jpg"
              alt="about"
              className="rounded-2xl shadow-xl"
            />
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            Why Choose Rapport?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaRocket className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                SIM delivered within 2 hours in selected cities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Safe Process</h3>
              <p className="text-gray-600 text-sm">
                100% secure verification and activation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <MdDeliveryDining className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Doorstep Service</h3>
              <p className="text-gray-600 text-sm">
                No store visits. We come to you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Trusted by Customers</h3>
              <p className="text-gray-600 text-sm">
                Thousands of happy users across India.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div className="bg-blue-600 text-white p-10 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p>
              To simplify telecom services and provide the fastest,
              most convenient SIM connection experience in India.
            </p>
          </div>

          <div className="bg-gray-100 p-10 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Our Vision
            </h3>
            <p className="text-gray-700">
              To become India’s most trusted digital telecom
              distribution platform by focusing on customer satisfaction
              and innovation.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Aboutus;
