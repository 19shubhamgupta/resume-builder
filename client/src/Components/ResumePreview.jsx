import React from "react";

export default function ResumePreview({ resumeData, template }) {
  return (
    <div className={`resume-preview p-8 bg-white ${template === "template2" ? "font-serif text-gray-700" : ""}`}>
      {/* Personal Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <p className="text-lg text-gray-600">{resumeData.personalInfo.jobTitle || "Professional Title"}</p>
        <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm text-gray-500">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>

      {/* Objective */}
      {resumeData.personalInfo.objective && <div className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Objective</h2>
        <p>{resumeData.personalInfo.objective}</p>
      </div>}

      {/* Work Experience */}
      {resumeData.workExperience.some(job => job.company || job.position) && <div className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Work Experience</h2>
        {resumeData.workExperience.map((job, idx) => (job.company || job.position) && (
          <div key={idx} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{job.company}</h3>
              <p className="text-sm">{job.startDate} {job.startDate && job.endDate ? " - " : ""} {job.endDate}</p>
            </div>
            <p className="italic">{job.position}</p>
            <p>{job.description}</p>
          </div>
        ))}
      </div>}

      {/* Education */}
      {resumeData.education.some(edu => edu.institution || edu.degree) && <div className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Education</h2>
        {resumeData.education.map((edu, idx) => (edu.institution || edu.degree) && (
          <div key={idx} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{edu.institution}</h3>
              <p className="text-sm">{edu.startDate} {edu.startDate && edu.endDate ? " - " : ""} {edu.endDate}</p>
            </div>
            <p>{edu.degree} {edu.field && `in ${edu.field}`}</p>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
            {edu.additionalInfo && <p>{edu.additionalInfo}</p>}
          </div>
        ))}
      </div>}

      {/* Projects */}
      {resumeData.projects.some(proj => proj.name) && <div className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Projects</h2>
        {resumeData.projects.map((proj, idx) => proj.name && (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold">{proj.name} {proj.date && `(${proj.date})`}</h3>
            <p>{proj.description}</p>
          </div>
        ))}
      </div>}

      {/* Skills */}
      {resumeData.skills.length > 0 && <div className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, idx) => (
            <span key={idx} className="bg-gray-200 px-2 py-1 rounded-md text-sm">{skill}</span>
          ))}
        </div>
      </div>}
    </div>
  );
}
