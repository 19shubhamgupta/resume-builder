// resumeController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const user = require("../models/user");

// Initialize Google Generative AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResume = async (req, res) => {
  try {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    let resumeText = "";
    let jobDescriptionText = "";

    // Extract resume text if uploaded
    if (req.files?.resume && req.files.resume[0]) {
      const resumeBuffer = req.files.resume[0].buffer;
      const parsedResume = await pdfParse(resumeBuffer);
      resumeText = parsedResume.text.trim();
    }

    // Extract job description text if uploaded
    if (req.files?.job && req.files.job[0]) {
      const jobBuffer = req.files.job[0].buffer;
      const parsedJob = await pdfParse(jobBuffer);
      jobDescriptionText = parsedJob.text.trim();
    } else {
      // Fallback to body fields
      const { role, title, description } = req.body;
      jobDescriptionText = `Role: ${role || ""}\nTitle: ${title || ""}\nDescription: ${description || ""}`;
    }

    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({
        message: "Resume and job description are required (file or text).",
      });
    }

    // Gemini prompt
    const prompt = `
You are an expert resume and job description analyzer.  
Your task is to compare a candidate’s resume with a given job description and provide a detailed analysis report.  

### Inputs:
1. Resume (text extracted from PDF):
"""
${resumeText}
"""

2. Job Description (text or extracted from PDF):
"""
${jobDescriptionText}
"""

### Instructions:
- Analyze the resume against the job description.  
- Identify **Matched Skills** (present in both resume & JD).  
- Identify **Missing Skills** (required in JD but not found in resume). Only return the **skill names** (e.g., "AWS", "Docker") — no sentences.  
- Suggest **Improvements** (sections or keywords to add, rewrite summary if needed).  
- Highlight **Project Mismatches** (projects irrelevant or not aligned with JD).  
- Check **Professional Summary** relevance (is it aligned with the JD role?).  
- Check **Academic/CGPA requirement** (if CGPA is mentioned in JD and compare with resume).  
- Be objective and structured — no extra commentary.  

### Output Format (strict JSON):
{
  "analysisResults": {
    "matchedSkills": [
      "Java", 
      "Spring Boot", 
      "Hibernate", 
      "REST APIs"
    ],
    "missingSkills": [
      "AWS", 
      "Docker", 
      "Kubernetes", 
      "Microservices"
    ],
    "suggestedImprovements": [
      "Add a 'Projects' section highlighting cloud-based applications.",
      "Include keywords: 'containerization', 'CI/CD', 'cloud-native'."
    ],
    "projectMismatches": [
      "Resume project: 'Sports Event Website' is not aligned with backend developer JD.",
      "Resume project: 'Game Info Fetcher' lacks enterprise relevance."
    ],
    "summaryAlignment": {
      "isRelevant": false,
      "feedback": "The summary focuses on front-end development but JD is backend-heavy."
    },
    "academicCheck": {
      "resumeCgpa": "7.2",
      "requiredCgpa": "7.5",
      "meetsRequirement": false
    }
  }
}
    `;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);

    console.log("Received response from Gemini");
    const response = await result.response;
    const responseText = response.text();

    console.log("Raw Gemini Response:", responseText);

    // Improved JSON parsing with error handling
    let analysisData;
    try {
      // First, try to parse the direct response
      analysisData = JSON.parse(responseText);
    } catch (err) {
      console.log("Initial JSON parse failed, trying to extract JSON from text");
      try {
        // Look for JSON pattern in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, create a structured error response
          throw new Error("No valid JSON found in response");
        }
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError);
        // Create a fallback response structure
        analysisData = {
          analysisResults: {
            error: "Failed to parse model response",
            rawResponse: responseText,
          },
        };
      }
    }

    console.log("Parsed Analysis Data:", analysisData);

    // Save to user profile if user exists
    if (req.user && req.user.id) {
      const currUser = await user.findById(req.user.id);
      if (currUser) {
        currUser.resumeAnalyses = currUser.resumeAnalyses || [];
        currUser.resumeAnalyses.push({
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          analysis: analysisData,
          createdAt: new Date(),
        });
        await currUser.save();
        console.log("Analysis saved to user profile");
      }
    }

    return res.status(200).json({
      message: "Resume analyzed successfully",
      analysis: analysisData,
    });
  } catch (error) {
    console.error("Error in resume analysis:", error);
    return res.status(500).json({
      message: "Failed to analyze resume",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

exports.getUserResumeAnalyses = async (req, res) => {
  try {
    const currUser = await user.findById(req.user.id);
    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ analyses: currUser.resumeAnalyses || [] });
  } catch (error) {
    console.error("Error fetching resume analyses:", error);
    return res.status(500).json({
      message: "Failed to fetch analyses",
      error: error.message,
    });
  }
};
