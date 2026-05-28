import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your message has been sent successfully ");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 text-center relative overflow-hidden">
        <div className="backdrop-blur-md bg-white/10 w-full h-full absolute top-0 left-0"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg opacity-90">
            We're here to help you 24/7. Reach out anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <div className="space-y-8">

          {/* Card */}
          <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <Phone className="text-blue-600" size={30} />
            <div>
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-sm text-gray-400">Mon - Sat (9 AM - 6 PM)</p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <Mail className="text-blue-600" size={30} />
            <div>
              <h3 className="font-semibold text-lg">Email Support</h3>
              <p className="text-gray-600">support@Rapport.com</p>
              <p className="text-sm text-gray-400">Response within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <MapPin className="text-blue-600" size={30} />
            <div>
              <h3 className="font-semibold text-lg">Head Office</h3>
              <p className="text-gray-600">Gurugram, Haryana, India</p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
            <Clock className="text-blue-600" size={30} />
            <div>
              <h3 className="font-semibold text-lg">Support Hours</h3>
              <p className="text-gray-600">24/7 Customer Assistance</p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-8">Send a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition duration-300"
            >
              <Send size={18} />
              Send Message
            </button>

          </form>

        </div>
      </div>

      {/* Bottom FAQ CTA */}
      <div className="bg-blue-50 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Looking for quick answers?
        </h2>
        <p className="text-gray-600 mb-6">
          Visit our Help Center for instant solutions.
        </p>
        <a
          href="/helpcenter"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Go to Help Center
        </a>
      </div>

    </div>
  );
};

export default ContactUs;