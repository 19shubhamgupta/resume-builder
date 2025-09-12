// interviewController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Start interview → generate questions on the fly
 */
exports.startInterview = async (req, res) => {
  try {
    const { title, role, experience, skills, difficulty } = req.body;
    console.log("Starting interview:", { title, role, experience, skills, difficulty });

    const prompt = `
You are an expert interview question generator. Create 15-20 interview questions for a ${experience} level ${role}.

Interview Details:
- Role: ${role}
- Title: ${title}
- Experience Level: ${experience}
- Skills: ${skills?.join(", ") || "Not specified"}
- Difficulty: ${difficulty || "medium"}

Generate:
1. 5-7 introduction/background questions
2. 10-13 technical/deep-dive questions

Format the response as a JSON array:
[
  {
    "question": "Question text",
    "type": "introduction" | "technical",
    "timeLimit": 120,
    "category": "JavaScript | React | System Design | etc."
  }
]

Return ONLY JSON array.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch (err) {
      console.warn("JSON.parse failed for questions, extracting array...");
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    return res.status(200).json({
      message: "Questions generated successfully",
      questions,
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

/**
 * Submit answers → generate report immediately
 */
exports.submitInterview = async (req, res) => {
  try {
    const { title, role, experience, skills, difficulty, questions, answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    // If frontend only sends answers, we need to handle that gracefully
    const qaPairs = questions
      ? questions.map((q, i) => ({
          question: q.question,
          type: q.type,
          category: q.category,
          answer: answers[i]?.answer || answers[i]?.transcript || "No answer provided",
        }))
      : answers.map((a, i) => ({
          question: a.question || `Q${i + 1}`,
          type: a.type || "unspecified",
          category: a.category || "general",
          answer: a.answer || "No answer provided",
        }));

    const prompt = `
You are an expert interview evaluator. Analyze the following interview performance.

Details:
- Role: ${role || "Not specified"}
- Title: ${title || "Interview"}
- Experience: ${experience || "Not specified"}
- Skills: ${skills?.join(", ") || "Not specified"}
- Difficulty: ${difficulty || "medium"}

Questions and Answers:
${qaPairs.map(
  (qa, i) => `
Q${i + 1} (${qa.type} - ${qa.category}):
${qa.question}

Answer:
${qa.answer}
`
)}

Now evaluate and return JSON in this format:
{
  "qaAnalysis": [
    ["question1", "transcript1", "suggestedAnswer1"],
    ["question2", "transcript2", "suggestedAnswer2"]
  ],
  "successPercentage": 76,
  "suggestedImprovements": [
    "Practice system design questions",
    "Improve SQL optimization"
  ],
  "strengths": ["Good fundamentals"],
  "weaknesses": ["Weak in TypeScript"],
  "skillAssessment": {
    "JavaScript": 80,
    "React": 85,
    "System Design": 60
  },
  "summary": "Overall good performance but needs improvement."
}

Return ONLY JSON object.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    let report;
    try {
      report = JSON.parse(responseText);
    } catch (err) {
      console.warn("JSON.parse failed for report, extracting object...");
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      report = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    }

    return res.status(200).json({
      message: "Interview report generated",
      report,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
};
