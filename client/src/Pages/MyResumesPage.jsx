import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSavedResumeStore } from "../store/useSavedResumeStore";

export default function MyResumesPage() {
  const navigate = useNavigate();
  const { savedResumes, isLoading, getUserResumes, deleteResume } =
    useSavedResumeStore();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    getUserResumes();
  }, [getUserResumes]);

  const handleDelete = async (id) => {
    const result = await deleteResume(id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTemplateDisplayName = (templateName) => {
    const templateNames = {
      template1: "Classic Professional",
      template2: "Modern Clean",
      template3: "Creative Modern",
      template4: "Minimalist Black & White",
      template5: "Two Column Layout",
      template6: "Modern Tech",
      template7: "Corporate Executive",
    };
    return templateNames[templateName] || templateName;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-2">
              Manage and edit your saved resumes
            </p>
          </div>
          <Link
            to="/templates"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Create New Resume
          </Link>
        </div>

        {/* Resumes Grid */}
        {savedResumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No resumes yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first resume.
              </p>
              <div className="mt-6">
                <Link
                  to="/templates"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Resume
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {resume.resumeName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {resume.personalInfo?.fullName || "Unnamed"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {resume.personalInfo?.jobTitle || "No title specified"}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setDeleteConfirm(
                            deleteConfirm === resume._id ? null : resume._id
                          )
                        }
                        className="text-gray-400 hover:text-red-600"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5l1.5 1.5A1 1 0 0117 12H3a1 1 0 01-.707-1.707L4 8.5V5zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {deleteConfirm === resume._id && (
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10">
                          <p className="text-sm text-gray-600 mb-2">
                            Delete this resume?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(resume._id)}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Template:</span>
                      <span className="text-gray-700">
                        {getTemplateDisplayName(resume.templateName)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last modified:</span>
                      <span className="text-gray-700">
                        {formatDate(resume.lastModified || resume.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-700">
                        {formatDate(resume.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/resume-builder?template=${resume.templateName}&resumeId=${resume._id}`
                        )
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // Navigate to preview mode (you could create a separate preview page)
                        navigate(
                          `/resume-builder?template=${resume.templateName}&resumeId=${resume._id}&preview=true`
                        );
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
