import React, { useState, useEffect } from "react";
import ResumeCustomizer from "../Components/ResumeCustomizer";
import ResumePreview from "../Components/ResumePreview";
import { useStoreAuth } from "../store/useResumeStore";

const TailoringResumePage = () => {
  const { tailorData } = useStoreAuth();

  // Initialize with default resume structure
  const [tailoredResumeData, setTailoredResumeData] = useState({
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      objective: "",
    },
    workExperience: [],
    education: [],
    projects: [],
    skills: [],
  });

  // Update resume data when tailorData changes (from Gemini response)
  useEffect(() => {
    if (tailorData?.tailoredResume) {
      setTailoredResumeData(tailorData.tailoredResume);
    }
  }, [tailorData]);

  // Handler to update resume data from left panel changes
  const updateResumeData = (section, field, value, id = null) => {
    setTailoredResumeData((prevData) => {
      if (section === "personalInfo") {
        return {
          ...prevData,
          personalInfo: {
            ...prevData.personalInfo,
            [field]: value,
          },
        };
      } else if (section === "skills") {
        return {
          ...prevData,
          skills: value,
        };
      } else {
        // For arrays (workExperience, education, projects)
        return {
          ...prevData,
          [section]: prevData[section].map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        };
      }
    });
  };

  const addArrayItem = (section, template) => {
    setTailoredResumeData((prevData) => ({
      ...prevData,
      [section]: [...prevData[section], { id: Date.now(), ...template }],
    }));
  };

  const removeArrayItem = (section, id) => {
    setTailoredResumeData((prevData) => ({
      ...prevData,
      [section]: prevData[section].filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-6">
      {/* Left Panel - Resume Analysis */}
      <div className="lg:w-1/2">
        <ResumeCustomizer
          tailoredResumeData={tailoredResumeData}
          updateResumeData={updateResumeData}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      </div>

      {/* Right Panel - Live Resume Preview */}
      <div className="lg:w-1/2">
        <div className="bg-white rounded-xl shadow-lg p-5 h-full">
          <h2 className="text-2xl text-slate-800 mb-5 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Live Preview - Template 2
          </h2>
          <div className="h-[700px] overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="scale-75 transform-origin-top">
              <ResumePreview
                resumeData={tailoredResumeData}
                template="template3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailoringResumePage;
