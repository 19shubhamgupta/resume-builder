import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ReportPage() {
  const location = useLocation();
  const report = location.state;

  if (!report) {
    return <div className="p-6">No report data found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Interview Report</h1>

      {/* Detailed results */}
      {report.results?.map((item, idx) => (
        <div key={idx} className="mb-4 border p-4 rounded shadow-sm">
          <p>
            <strong>Q:</strong> {item.question}
          </p>
          <p>
            <strong>Your Answer:</strong> {item.userAnswer}
          </p>
          <p>
            <strong>Correct Answer:</strong> {item.correctAnswer}
          </p>
          <p>
            <strong>Score:</strong> {item.score}/10
          </p>
          <p>
            <strong>Feedback:</strong> {item.feedback}
          </p>
        </div>
      ))}

      {/* Summary */}
      <div className="mt-8 p-6 border rounded bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <p>
          <strong>Total Score:</strong> {report.summary?.totalScore}
        </p>
        <p>
          <strong>Strengths:</strong> {report.summary?.strengths}
        </p>
        <p>
          <strong>Weaknesses:</strong> {report.summary?.weaknesses}
        </p>
        <p>
          <strong>Recommendation:</strong> {report.summary?.recommendation}
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}