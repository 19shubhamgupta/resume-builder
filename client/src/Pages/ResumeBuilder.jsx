import React, { useState, useRef } from "react";
import ResumeForm from "../Components/ResumeForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ResumeBuilder() {
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
    workExperience: [{ id: 1, company: "", position: "", startDate: "", endDate: "", description: "" }],
    education: [{ id: 1, institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", additionalInfo: "" }],
    projects: [{ id: 1, name: "", date: "", description: "" }],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("template1"); // default template
  const resumeRef = useRef();

  const handleInputChange = (section, field, value, id = null) => {
    setResumeData(prevData => {
      if (id) {
        const updatedArray = prevData[section].map(item => item.id === id ? { ...item, [field]: value } : item);
        return { ...prevData, [section]: updatedArray };
      } else {
        return { ...prevData, [section]: { ...prevData[section], [field]: value } };
      }
    });
  };

  const addItem = (section, template) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], { id: Date.now(), ...template }]
    }));
  };

  const removeItem = (section, id) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter(item => item.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setResumeData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index)
    }));
  };

  const downloadResume = async () => {
    if (!resumeRef.current) return;
    const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`${resumeData.personalInfo.fullName || "resume"}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-screen">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Resume Builder</h1>

          <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />

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
              <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
              <button
                onClick={downloadResume}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Download PDF
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 min-h-[600px]">
              <div ref={resumeRef}>
                <ResumePreview resumeData={resumeData} template={selectedTemplate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
