const { GoogleGenerativeAI } = require("@google/generative-ai");
const user = require("../models/user");

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY"
);

exports.generateRoadmap = async (req, res) => {
  try {
    const courseData = req.body;
    console.log("Received course data:", courseData);

    // Extract relevant course information
    const { title, description, skills, level } = courseData;

    // Create a prompt for Gemini API
    const prompt = `
    Generate a detailed course roadmap for a ${level} level course titled "${title}".
    
    Course description: ${description}
    
    Skills covered: ${skills.join(", ")}
    
    Format the response as a JSON array of steps, where each step has:
    - an id (numerical)
    - a title (string, maximum 3 words)
    - chapters (an array of sub-topics)
      - each chapter has an id (can be decimal like 1.1) and a title
      
    The number of steps and chapters should be decided by you based on the course content.
    The content should be educational, well-structured, and specifically tailored to the ${level} level.
    
    Example format:
    [
      {
        "id": 1,
        "title": "Course Overview",
        "chapters": [
          {
            "id": 1.1,
            "title": "Introduction to Course"
          },
          {
            "id": 1.2,
            "title": "Getting Started with Development"
          }
        ]
      },
      ...
    ]
    
    Only respond with the JSON array, no additional text.
    `;

    // Call Gemini API to generate roadmap
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Parse the response as JSON
    let roadmapSteps;
    try {
      // Try to parse the full response
      roadmapSteps = JSON.parse(responseText);
    } catch (error) {
      // If parsing fails, try to extract JSON using regex
      const jsonMatch = responseText.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        roadmapSteps = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini API response");
      }
    }

    // Return the generated roadmap
    const idGenrator = () => {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };
    let roadmap = {
      id: idGenrator(),
      title: title,
      steps: roadmapSteps,
    };
    
    const currUser = await user.findById(req.user.id);
    currUser.roadmapsCreated.push(roadmap);
    await currUser.save();

    console.log("Generated roadmap :", roadmap);

    return res.status(200).json({
      message: "Roadmap generated successfully",
      roadmap: roadmap,
      courseData,
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return res.status(500).json({
      message: "Failed to generate roadmap",
      error: error.message,
    });
  }
};

exports.getUserroadmaps = async (req, res) => {
  try {
    const currUser = await user.findById(req.user.id);
    if (!currUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      roadmaps: currUser.roadmapsCreated,
    });
  } catch (error) {
    console.error("Error fetching user roadmaps:", error);
    return res.status(500).json({
      message: "Failed to fetch user roadmaps",
      error: error.message,
    });
  }
};
