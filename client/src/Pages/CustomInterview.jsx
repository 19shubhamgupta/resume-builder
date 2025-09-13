import React, { useState } from "react";
import { Upload, Briefcase, FileText } from "lucide-react";

const CustomInterview = () => {
  const [jdInputType, setJdInputType] = useState("manual"); // "manual" | "pdf"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            Custom Interview Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your resume and job description to generate a tailored
            interview
          </p>
        </div>

        <form className="bg-white border-4 border-blue-900 rounded-lg shadow-md p-6 space-y-10">
          {/* Resume Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume (PDF)</h2>
            <div className="flex flex-col items-center justify-center gap-4">
              <label className="w-full flex flex-col items-center px-4 py-8 border-2 border-blue-900 rounded-lg cursor-pointer bg-white hover:bg-blue-50">
                <Upload size={32} className="mb-2 text-blue-600" />
                <span className="text-gray-700">Click to upload PDF</span>
                <input type="file" accept="application/pdf" className="hidden" />
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>

            {/* Toggle between PDF / Manual */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setJdInputType("manual")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition ${
                  jdInputType === "manual"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-blue-900 border-blue-900 hover:bg-blue-50"
                }`}
              >
                <Briefcase size={20} /> Manual Input
              </button>
              <button
                type="button"
                onClick={() => setJdInputType("pdf")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition ${
                  jdInputType === "pdf"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-blue-900 border-blue-900 hover:bg-blue-50"
                }`}
              >
                <FileText size={20} /> Upload JD PDF
              </button>
            </div>

            {/* Conditional Input */}
            {jdInputType === "manual" ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="role"
                    placeholder="Job Role (e.g. Frontend Developer) *"
                    className="px-4 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Job Title (e.g. Senior Developer) *"
                    className="px-4 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name (optional)"
                  className="px-4 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
                <textarea
                  name="description"
                  placeholder="Job Description (requirements, responsibilities, etc.) *"
                  className="px-4 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none h-32"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <label className="w-full flex flex-col items-center px-4 py-8 border-2 border-blue-900 rounded-lg cursor-pointer bg-white hover:bg-blue-50">
                  <Upload size={32} className="mb-2 text-blue-600" />
                  <span className="text-gray-700">Click to upload Job Description PDF</span>
                  <input type="file" accept="application/pdf" className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium transition"
            >
              Generate Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomInterview;
