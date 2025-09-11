import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ResumeForm from "../Components/ResumeForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import SaveResumeModal from "../Components/SaveResumeModal";
import { useSavedResumeStore } from "../store/useSavedResumeStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";
import "../styles/pdf-styles.css";

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateFromUrl = searchParams.get("template") || "template1";
  const resumeIdFromUrl = searchParams.get("resumeId");

  const { createResume, updateResume, getResumeById, isSaving } =
    useSavedResumeStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      objective: "",
    },
    workExperience: [
      {
        id: 1,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        id: 1,
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
        additionalInfo: "",
      },
    ],
    projects: [{ id: 1, name: "", date: "", description: "" }],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templateFromUrl);
  const resumeRef = useRef();

  useEffect(() => {
    setSelectedTemplate(templateFromUrl);
  }, [templateFromUrl]);

  // Load existing resume if resumeId is provided
  useEffect(() => {
    const loadExistingResume = async () => {
      if (resumeIdFromUrl) {
        const result = await getResumeById(resumeIdFromUrl);
        if (result.success) {
          const resume = result.resume;
          setResumeData({
            personalInfo: resume.personalInfo || {
              fullName: "",
              jobTitle: "",
              email: "",
              phone: "",
              website: "",
              location: "",
              objective: "",
            },
            workExperience: resume.workExperience || [
              {
                id: 1,
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
            education: resume.education || [
              {
                id: 1,
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                gpa: "",
                additionalInfo: "",
              },
            ],
            projects: resume.projects || [
              { id: 1, name: "", date: "", description: "" },
            ],
            skills: resume.skills || [],
          });
          setSelectedTemplate(resume.templateName);
          setIsEditing(true);
          setCurrentResumeId(resumeIdFromUrl);
        }
      }
    };

    loadExistingResume();
  }, [resumeIdFromUrl, getResumeById]);

  const handleSaveResume = async (resumeName, templateName, resumeData) => {
    let result;
    if (isEditing && currentResumeId) {
      result = await updateResume(
        currentResumeId,
        resumeName,
        templateName,
        resumeData
      );
    } else {
      result = await createResume(resumeName, templateName, resumeData);
    }

    if (result.success) {
      setShowSaveModal(false);
      if (!isEditing) {
        setIsEditing(true);
        setCurrentResumeId(result.resume.id);
      }
    }
  };

  const handleInputChange = (section, field, value, id = null) => {
    setResumeData((prevData) => {
      if (id) {
        const updatedArray = prevData[section].map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        );
        return { ...prevData, [section]: updatedArray };
      } else {
        return {
          ...prevData,
          [section]: { ...prevData[section], [field]: value },
        };
      }
    });
  };

  const addItem = (section, template) => {
    setResumeData((prevData) => ({
      ...prevData,
      [section]: [...prevData[section], { id: Date.now(), ...template }],
    }));
  };

  const removeItem = (section, id) => {
    setResumeData((prevData) => ({
      ...prevData,
      [section]: prevData[section].filter((item) => item.id !== id),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index),
    }));
  };

  const downloadResume = async () => {
    if (!resumeRef.current) {
      toast.error("Resume preview not available");
      return;
    }

    try {
      toast.loading("Preparing your resume...", { id: "download" });

      // Find the actual resume content element (first child of the ref)
      const resumeElement =
        resumeRef.current.querySelector(".resume-preview") ||
        resumeRef.current.firstElementChild;

      if (!resumeElement) {
        toast.error("Resume content not found");
        return;
      }

      // Store original styles to restore later
      const originalStyles = new Map();

      // Function to safely replace gradients while preserving layout
      const replaceGradients = (element) => {
        const computedStyle = window.getComputedStyle(element);

        // Store original styles
        originalStyles.set(element, {
          background: element.style.background,
          backgroundImage: element.style.backgroundImage,
          color: element.style.color,
          webkitBackgroundClip: element.style.webkitBackgroundClip,
          backgroundClip: element.style.backgroundClip,
          webkitTextFillColor: element.style.webkitTextFillColor,
          className: element.className,
        });

        // Handle gradient text elements
        if (
          element.classList.contains("bg-clip-text") ||
          element.classList.contains("text-transparent")
        ) {
          element.style.color = "#1e293b";
          element.style.background = "none";
          element.style.backgroundImage = "none";
          element.style.webkitBackgroundClip = "unset";
          element.style.backgroundClip = "unset";
          element.style.webkitTextFillColor = "#1e293b";
          element.classList.remove("text-transparent");
        }

        // Handle gradient background elements
        if (
          computedStyle.backgroundImage &&
          computedStyle.backgroundImage.includes("gradient")
        ) {
          element.style.backgroundImage = "none";
          // Preserve gradient colors as solid backgrounds
          if (computedStyle.backgroundImage.includes("blue")) {
            element.style.background = "#3b82f6"; // blue-500
          } else if (computedStyle.backgroundImage.includes("purple")) {
            element.style.background = "#8b5cf6"; // purple-500
          } else if (computedStyle.backgroundImage.includes("pink")) {
            element.style.background = "#ec4899"; // pink-500
          } else {
            element.style.background = "#f8fafc"; // default light gray
          }
        }

        // Remove animation classes
        element.classList.remove("animate-pulse");

        // Process child elements
        Array.from(element.children).forEach((child) => {
          replaceGradients(child);
        });
      };

      // Apply gradient replacements
      replaceGradients(resumeElement);

      // Force a repaint
      resumeElement.offsetHeight;

      // Wait for DOM updates
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(resumeElement, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        logging: false,
        width: resumeElement.offsetWidth,
        height: resumeElement.offsetHeight,
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return (
            element.classList.contains("animate-pulse") ||
            element.tagName === "SCRIPT" ||
            element.tagName === "STYLE"
          );
        },
      });

      // Restore original styles
      originalStyles.forEach((styles, element) => {
        element.style.background = styles.background;
        element.style.backgroundImage = styles.backgroundImage;
        element.style.color = styles.color;
        element.style.webkitBackgroundClip = styles.webkitBackgroundClip;
        element.style.backgroundClip = styles.backgroundClip;
        element.style.webkitTextFillColor = styles.webkitTextFillColor;
        element.className = styles.className;
      });

      // Create PDF with better size handling
      const imgData = canvas.toDataURL("image/png", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      // Calculate proper scaling to fit content on one page when possible
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth, imgHeight;

      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider, fit to width
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / canvasAspectRatio;
      } else {
        // Canvas is taller, fit to height or allow multiple pages
        imgWidth = pdfHeight * canvasAspectRatio;
        imgHeight = pdfHeight;
      }

      // If content is too tall, allow multiple pages but optimize
      if (imgHeight > pdfHeight) {
        imgWidth = pdfWidth;
        imgHeight = (canvas.height * pdfWidth) / canvas.width;
      }

      let yPosition = 0;
      let remainingHeight = imgHeight;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
      remainingHeight -= pdfHeight;

      // Add additional pages if needed
      while (remainingHeight > 0) {
        pdf.addPage();
        yPosition = -pdfHeight + (imgHeight - remainingHeight);
        pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
        remainingHeight -= pdfHeight;
      }

      const fileName = `${resumeData.personalInfo.fullName || "resume"}.pdf`;
      pdf.save(fileName);

      toast.success("Resume downloaded successfully!", { id: "download" });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Failed to download resume: ${error.message}`, {
        id: "download",
      });
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Resume Builder
              </h1>
              <button
                onClick={() => navigate("/templates")}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Templates
              </button>
            </div>

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />

            <ResumeForm
              resumeData={resumeData}
              handleInputChange={handleInputChange}
              addItem={addItem}
              removeItem={removeItem}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              addSkill={addSkill}
              removeSkill={removeSkill}
            />
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/2 sticky top-8 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Live Preview
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        />
                      </svg>
                    )}
                    {isSaving
                      ? "Saving..."
                      : isEditing
                      ? "Update Resume"
                      : "Save Resume"}
                  </button>
                  <button
                    onClick={downloadResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 min-h-[600px]">
                <div ref={resumeRef}>
                  <ResumePreview
                    resumeData={resumeData}
                    template={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Resume Modal */}
        <SaveResumeModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveResume}
          isSaving={isSaving}
          resumeData={resumeData}
          selectedTemplate={selectedTemplate}
        />
      </main>
    </>
  );
}
