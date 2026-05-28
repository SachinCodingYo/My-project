import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How can I activate my SIM card?",
    answer:
      "Insert your SIM card into your phone and follow the on-screen instructions. You may need to complete KYC verification.",
  },
  {
    question: "How to track my SIM delivery?",
    answer:
      "Go to the Track Request page and enter your request ID to check delivery status.",
  },
  {
    question: "How can I port my number?",
    answer:
      "Visit the Port Number page, choose your operator, and complete the MNP process.",
  },
  {
    question: "How to raise a complaint?",
    answer:
      "You can raise a complaint from the Raise Complaint page or contact our customer support team.",
  },
];

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="opacity-90 mb-8">
          How can we help you today?
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">

        {filteredFAQs.length === 0 && (
          <p className="text-center text-gray-500">
            No results found.
          </p>
        )}

        {filteredFAQs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 transition hover:shadow-lg"
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="font-semibold text-lg">
                {faq.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>

            {openIndex === index && (
              <p className="text-gray-600 mt-4">
                {faq.answer}
              </p>
            )}
          </div>
        ))}

      </div>

      {/* Contact CTA */}
      <div className="bg-blue-50 py-16 text-center">
        <MessageCircle className="mx-auto text-blue-600 mb-4" size={36} />
        <h2 className="text-2xl font-bold mb-4">
          Still need help?
        </h2>
        <p className="text-gray-600 mb-6">
          Our support team is available 24/7 to assist you.
        </p>
        <Link
          to="/contactus"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Contact Support
        </Link>
      </div>

    </div>
  );
};

export default HelpCenter;