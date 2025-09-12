import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import RoadmapPage from "./Pages/RoadmapPage.jsx";
import CourseGeneratorPage from "./Pages/CourseGeneratorPage.jsx";
import Course from "./Pages/Course.jsx";
import ResumeBuilder from "./Pages/ResumeBuilder.jsx";
import TemplateGallery from "./Pages/TemplateGallery.jsx";
import TailorInput from "./Pages/TailorInput.jsx";
import TailoringResumePage from "./Pages/TailoringResumePage.jsx";
import MyResumesPage from "./Pages/MyResumesPage.jsx";
import CoursePage from "./Pages/CoursePage.jsx";

// 👉 Import our new pages
import InterviewHomePage from "./Pages/InterviewHomePage.jsx";
import PredefinedInterview from "./Pages/PredefinedInterview.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/roadmap", element: <RoadmapPage /> },
      { path: "/course-generator", element: <CourseGeneratorPage /> },
      { path: "/roadmap/customize-roadmap/course/:id", element: <Course /> },
      { path: "/course/:id", element: <CoursePage /> },
      { path: "/templates", element: <TemplateGallery /> },
      { path: "/resume-builder", element: <ResumeBuilder /> },
      { path: "/my-resumes", element: <MyResumesPage /> },
      { path: "/tailorinput", element: <TailorInput /> },
      { path: "/tailoring-resume", element: <TailoringResumePage /> },

      // 👉 New Interview Routes
      { path: "/interview", element: <InterviewHomePage /> },
      { path: "/interview/predefined/:title", element: <PredefinedInterview /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
