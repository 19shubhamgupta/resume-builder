// controllers/predefinedInterviewController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Safe Gemini call with retry on 429
async function safeGenerate(model, prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    if (err.status === 429) {
      console.warn("⚠️ Rate limit hit. Retrying in 20s...");
      await new Promise((res) => setTimeout(res, 20000));
      return model.generateContent(prompt); // retry once
    }
    throw err;
  }
}

// Helper: Extract JSON safely
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Generate interview questions
 */
exports.generateQuestions = async (req, res) => {
  try {
    const { title, role, experience, time } = req.body;

    if (!title || !role || !experience || !time) {
      return res.status(400).json({
        message: "title, role, experience, and time are required",
      });
    }

    const prompt = `
You are an expert technical interviewer.  
Generate ${time} authentic and challenging interview questions for the role: ${title}.  
The role involves skills: ${role}.  
The candidate has ${experience} years of experience.  

Only return JSON in this format:
{
  "questions": [
    {"id": 1, "question": "..."},
    {"id": 2, "question": "..."}
  ]
}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🚀 Sending interview questions prompt to Gemini...");
    const result = await safeGenerate(model, prompt);

    const response = await result.response;
    const responseText = response.text();
    console.log("📩 Raw Gemini Response:", responseText);

    const questions = safeJsonParse(responseText) || { questions: [] };

    return res.status(200).json(questions);
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    return res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
    });
  }
};

/**
 * Evaluate interview answers
 */
exports.evaluateAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "answers array is required",
      });
    }

    const prompt = `
You are an expert interview evaluator.  

Here is the transcript of a mock interview:
${JSON.stringify(answers, null, 2)}

For each question:
1. Provide the correct answer  
2. Compare with candidate's answer  
3. Give score 0-10  
4. Feedback  

Provide final summary including totalScore, strengths, weaknesses, recommendation.  

Return JSON like this:
{
  "results": [
    {
      "questionId": 1,
      "correctAnswer": "...",
      "candidateAnswer": "...",
      "score": 7,
      "feedback": "..."
    }
  ],
  "summary": {
    "totalScore": 25,
    "strengths": ["..."],
    "weaknesses": ["..."],
    "recommendation": "..."
  }
}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🚀 Sending evaluation prompt to Gemini...");
    const result = await safeGenerate(model, prompt);

    const response = await result.response;
    const responseText = response.text();
    console.log("📩 Raw Gemini Response:", responseText);

    const evaluation =
      safeJsonParse(responseText) || {
        results: [],
        summary: {
          totalScore: 0,
          strengths: [],
          weaknesses: [],
          recommendation: "Could not evaluate due to parsing error",
        },
      };

    return res.status(200).json(evaluation);
  } catch (error) {
    console.error("❌ Error generating evaluation:", error);
    return res.status(500).json({
      message: "Failed to generate evaluation report",
      error: error.message,
    });
  }
};
