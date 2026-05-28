import React, { useState, useEffect } from "react";

const slides = [
  { title: "Stay Home and Stay Safe", highlight: "Stay Home", subtitle: "While we deliver your SIM connection at home.", image: "/delivery.jpg" },
  { title: "Get SIM Delivered in 2 Hours", highlight: "2 Hours", subtitle: "Fastest doorstep SIM delivery service.", image: "/delivery2.jpg" },
];

const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-blue-50 py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10">
          Travel with the best prepaid <span className="text-blue-600">Rap</span>port plans.
        </h1>
        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow">
            <span className="bg-blue-600 text-white p-2 rounded-full">📶</span>
            <span className="font-medium text-gray-700">Instant 4G/5G DATA Activation</span>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow">
            <span className="bg-blue-600 text-white p-2 rounded-full">🔒</span>
            <span className="font-medium text-gray-700">100% Internet Connectivity</span>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow">
            <span className="bg-blue-600 text-white p-2 rounded-full">⏰</span>
            <span className="font-medium text-gray-700">24/7 Support</span>
          </div>
        </div>
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center bg-white border-2 border-blue-500 rounded-xl px-5 py-4 shadow-lg">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-4.3-4.3"></path>
              <circle cx="11" cy="11" r="8"></circle>
            </svg>
            <input type="text" placeholder="Where do you need mobile data" className="w-full outline-none text-gray-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;