import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlogData } from "../data/BlogData";

const BlogPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = BlogData.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-10">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-4">
          {blog.title}
        </h1>

        <p className="text-gray-500 mb-6">
          {blog.description}
        </p>

        <hr className="mb-6" />

        <p className="text-lg text-gray-700 leading-relaxed">
          {blog.content}
        </p>

      </div>
    </div>
  );
};

export default BlogPage;