import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PredefinedInterview() {
  const { title } = useParams(); // interview title from URL
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  // Predefined interview details
  const predefinedInterviews = [
    {
      id: 1,
      title: "Frontend Developer",
      role: "React, JavaScript, CSS",
      experience: 2,
      time: 15,
    },
    {
      id: 2,
      title: "Backend Developer",
      role: "Node.js, Express, Databases",
      experience: 3,
      time: 20,
    },
    {
      id: 3,
      title: "Data Scientist",
      role: "Python, ML, Statistics",
      experience: 4,
      time: 25,
    },
  ];

  const interview = predefinedInterviews.find((item) => item.title === title);

  // Fetch questions from backend (only once)
  useEffect(() => {
    if (!interview) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5001/api/interview/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: interview.title,
            role: interview.role,
            experience: interview.experience,
            time: interview.time,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Error fetching questions from backend:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [interview]);

  // Speak a question using Web Speech API
  const speakQuestion = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  // Start listening to user's answer
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Start the interview
  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentIndex(0);
    setUserAnswer("");
    if (questions.length > 0) {
      speakQuestion(questions[0].question);
      startListening();
    }
  };

  // Go to next question
  const nextQuestion = () => {
    const updatedAnswers = [
      ...userAnswers,
      { question: questions[currentIndex].question, answer: userAnswer },
    ];
    setUserAnswers(updatedAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setUserAnswer("");
      speakQuestion(questions[nextIndex].question);
      startListening();
    } else {
      generateReport(updatedAnswers);
    }
  };

  // Send answers to backend for Gemini evaluation
  const generateReport = async (answers) => {
    try {
      const res = await fetch("http://localhost:5001/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const report = await res.json();
      navigate("/interview/report", { state: report });
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report. Please try again.");
    }
  };

  if (!interview) {
    return <div className="p-6 text-red-500">Interview not found!</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {interview.title.toUpperCase()} Interview ({interview.time} mins)
      </h1>

      {loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !interviewStarted ? (
        <button
          onClick={startInterview}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Start Interview
        </button>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Question {currentIndex + 1} of {questions.length}:
          </h2>
          <p className="mb-4">{questions[currentIndex]?.question}</p>

          <div className="mb-4">
            <strong>Your Answer (transcribed):</strong>
            <p className="bg-gray-100 p-3 rounded">{userAnswer || "..."}</p>
          </div>

          <button
            onClick={nextQuestion}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            {currentIndex + 1 === questions.length
              ? "Finish Interview"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
