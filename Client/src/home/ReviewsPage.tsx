import React from "react";

const reviews = [
  {
    name: "Rahul Sharma",
    review: "Very easy recharge process. SIM delivered quickly!",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    name: "Priya Verma",
    review: "Best platform to compare recharge plans.",
    rating: "⭐⭐⭐⭐"
  },
  {
    name: "Aman Gupta",
    review: "Customer support is very helpful.",
    rating: "⭐⭐⭐⭐⭐"
  }
];

const ReviewsPage = () => {
  return (
    <section className="py-16 bg-gray-50">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Customer Reviews
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow"
            >
              <p className="text-gray-600 mb-4">
                "{item.review}"
              </p>

              <h4 className="font-semibold">{item.name}</h4>

              <p className="text-yellow-500">
                {item.rating}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default ReviewsPage;