import React from "react";
import { Link } from "react-router-dom";

export default function InterviewHomePage() {
  // Example predefined interviews
  const predefinedInterviews = [
    {
      id: 1,
      title: "Frontend Developer",
      role: "React, JavaScript, CSS",
      experience: 2,
      time: 15,
    },
    {
      id: 2,
      title: "Backend Developer",
      role: "Node.js, Express, Databases",
      experience: 3,
      time: 20,
    },
    {
      id: 3,
      title: "Data Scientist",
      role: "Python, ML, Statistics",
      experience: 4,
      time: 25,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Mock Interview Home
      </h1>

      {/* Predefined Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predefinedInterviews.map((interview) => (
          <div
            key={interview.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{interview.title}</h2>
            <p className="text-gray-600">Role: {interview.role}</p>
            <p className="text-gray-600">Experience: {interview.experience}</p>
            <p className="text-gray-600">Time: {interview.time}</p>
            <Link
              to={`/interview/predefined/${interview.title}`}
              className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Start Interview
            </Link>
          </div>
        ))}
      </div>

      {/* Custom Interview Button */}
      <div className="mt-10 text-center">
        <Link
          to="/interview/custom"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Generate Custom Interview
        </Link>
      </div>
    </div>
  );
}
