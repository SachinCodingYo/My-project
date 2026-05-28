import React from "react";
import { Link } from "react-router-dom";

import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#fffaf4] text-gray-700 pt-8">

      {/* TOP LINKS BAR */}
      <div className="border-b pb-6 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-sm font-medium">

          <a href="/aboutus" className="hover:text-blue-600 transition">
            About Us
          </a>

          <a href="/support" className="hover:text-blue-600 transition">
            Support
          </a>

          <a href="/refund-policy" className="hover:text-blue-600 transition">
            Refund Policy
          </a>

          <a href="/disclaimer" className="hover:text-blue-600 transition">
            Disclaimer
          </a>

          <a href="/privacypolicy" className="hover:text-blue-600 transition">
            Privacy Policy
          </a>

          <a href="/termsconditions" className="hover:text-blue-600 transition">
            Terms & Conditions
          </a>

          <a href="/hiring" className="hover:text-blue-600 transition">
            Hiring for Delivery Executives
          </a>

          <a href="/rechargeplan" className="hover:text-blue-600 transition">
            Recharge Plans Info
          </a>

        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* LEFT SECTION */}
        <div className="md:col-span-1">
          <h2 className="text-3xl  font-bold">
            Rapport          </h2>

          <p className="mt-3 text-sm leading-6">
            Authorized Online Partner Of:
          </p>

          {/* LOGOS */}
          <div className="flex gap-3 mt-3">

          </div>

          <p className="mt-4 text-sm leading-6">
            Rapport.com is the fastest way of getting your SIM
            connection and related services at your doorstep.
          </p>

          <p className="mt-3 text-sm">
            📧 support@Rapport.com
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-4 text-lg">
            <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            <FaYoutube className="cursor-pointer hover:text-red-600" />
            <FaInstagram className="cursor-pointer hover:text-pink-600" />
          </div>
        </div>

        {/* NEW SIM */}
        {/* NEW SIM */}
        <div>
          <h3 className="font-semibold mb-3">New SIM Connection</h3>
          <ul className="space-y-2 text-sm">
            <li>
             <Link to="/simstore?type=prepaid&operator=jio" className="hover:text-blue-600">
  Jio Prepaid Connection
</Link>
            </li>
            <li>
              <Link to="/simstore?type=prepaid&operator=airtel" className="hover:text-blue-600">
  Airtel Prepaid Connection
</Link>
            </li>
            <li>
              <Link to="/simstore?type=prepaid&operator=vi" className="hover:text-blue-600">
                Vi™ Prepaid Connection
              </Link>
            </li>
            <li>
              <Link to="/simstore?type=prepaid&operator=bsnl" className="hover:text-blue-600">
                BSNL Prepaid Connection
              </Link>
            </li>
          </ul>
        </div>

        {/* PORT NUMBER */}
        {/* PORT NUMBER */}
        <div>
          <h3 className="font-semibold mb-3">Port Number</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/portnumber/jio" className="hover:text-blue-600">
                Port to Jio
              </Link>
            </li>
            <li>
              <Link to="/portnumber/airtel" className="hover:text-blue-600">
                Port to Airtel
              </Link>
            </li>
            <li>
              <Link to="/portnumber/vi" className="hover:text-blue-600">
                Port to Vi™
              </Link>
            </li>
            <li>
              <Link to="/portnumber/bsnl" className="hover:text-blue-600">
                Port to BSNL
              </Link>
            </li>
          </ul>
        </div>

        {/* POSTPAID */}
        {/* POSTPAID */}
        <div>
          <h3 className="font-semibold mb-3">Postpaid Connection</h3>
          <ul className="space-y-2 text-sm">
            <li>
             <Link to="/simstore?type=postpaid&operator=jio" className="hover:text-blue-600">
  Jio Postpaid
</Link>
            </li>
            <li>
             <Link to="/simstore?type=postpaid&operator=airtel" className="hover:text-blue-600">
  Airtel Postpaid
</Link>
            </li>
            <li>
              <Link to="/simstore?type=postpaid&operator=airtel" className="hover:text-blue-600">
                Vi™ Postpaid
              </Link>
            </li>
            <li>
              <Link to="/simstore?type=postpaid&operator=bsnl" className="hover:text-blue-600">
                BSNL Postpaid
              </Link>
            </li>
          </ul>
        </div>

        {/* SURVEY */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3">You Are Important</h3>
          <p className="text-sm mb-4">
            We'd love to learn more about your shopping experience.
          </p>
          <button className="border border-gray-400 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition">
            Take Survey
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t mt-10 py-4 text-center text-sm">
        © 2020 - 2026 Rapport. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
