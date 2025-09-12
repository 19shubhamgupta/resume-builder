import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { useSpeechSynthesis } from "react-speech-kit";
import { useSpeechRecognition } from "react-speech-kit";
import { Mic } from "lucide-react";

const InterviewRoom = () => {
  const { speak, voices } = useSpeechSynthesis();
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, interviewDetails } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    questions ? questions[0].timeLimit : 0
  );
  const [answers, setAnswers] = useState([]); // { question, answer }
  const [hasHeard, setHasHeard] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const timerRef = useRef(null);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = {
        question: questions[currentIndex].question,
        answer: result,
      };
      setAnswers(updatedAnswers);
    },
  });

  const handleSpeak = (text) => {
    speak({ text, rate: 1.2, voice: voices[4] });
    setHasHeard(true);
  };

  console.log("Questions:", questions);

  useEffect(() => {
    if (!questions) {
      navigate("/");
      return;
    }

    if (answers.length === 0) {
      setAnswers(questions.map((q) => ({ question: q.question, answer: "" })));
    }

    setHasHeard(false);
    setQuestionNumber(currentIndex + 1);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return questions[currentIndex + 1]?.timeLimit || 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(questions[currentIndex + 1].timeLimit);
      setQuestionNumber((prev) => prev + 1);
    } else {
      handleSubmitInterview();
    }
  };

  const handleSubmitInterview = async () => {
    try {
      
      const res = await axiosInstance.post("/interview/submit", {
        title: interviewDetails?.title || "Untitled Interview",
        role: interviewDetails?.role || "Not specified",
        experience: interviewDetails?.experience || "Not specified",
        skills: interviewDetails?.skills || [],
        difficulty: interviewDetails?.difficulty || "medium",
        questions, // 👈 only questions
        answers, // 👈 only answers
      });

      toast.success("Interview submitted successfully!");
      navigate(`/report/${res.data.reportId}`);
    } catch (error) {
      console.error("Error submitting interview:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit interview."
      );
    }
  };

  if (!questions) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">{interviewDetails.title}</h1>
      <h2 className="text-lg mb-6">
        {currentQuestion.category} | Question {questionNumber} of{" "}
        {questions.length}
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl flex flex-col items-center">
        <Mic size={48} className="text-indigo-600 mb-4" />

        <button
          onClick={() => handleSpeak(currentQuestion.question)}
          disabled={hasHeard}
          className={`px-4 py-2 rounded font-medium mb-6 ${
            hasHeard
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Hear Question
        </button>

        <button
          onClick={listening ? stop : listen}
          className={`px-4 py-2 rounded font-medium mb-4 ${
            listening
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {listening ? "Listening..." : "Click to Talk"}
        </button>

        <p className="text-gray-700 italic mb-4">
          {answers[currentIndex]?.answer || "Your answer will appear here..."}
        </p>

        <div className="flex justify-between items-center w-full">
          <span className="font-medium">Time Left: {timeLeft}s</span>
          <button
            onClick={handleNextQuestion}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {currentIndex === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
