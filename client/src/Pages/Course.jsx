import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourseStore } from "../store/useCourseStore";

const Course = () => {
  const { id } = useParams();
  const { userRoadmaps } = useCourseStore();
  // Roadmap steps array - simplified with title and chapters only
  const currRoadmap = userRoadmaps.find((rm) => rm.id === id);
  const roadmapSteps = currRoadmap ? currRoadmap.steps : [];

  const roadmaptitle = currRoadmap ? currRoadmap.title : "Course Roadmap";

  const initialStepState = roadmapSteps.map(() => false);
  const [openStepArr, setopenStepArr] = useState(initialStepState);

  const handleToggle = (index) => {
    let val = !openStepArr[index];
    setopenStepArr((prev) => {
      let newPrev = [...prev];
      newPrev[index] = val;
      return newPrev;
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-full mx-auto flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold mb-5 text-center text-blue-950">
          {roadmaptitle}
        </h1>

        {/* Main container for vertical connection */}
        <div className="relative flex flex-col items-center w-[80%]">
          {roadmapSteps.map((step, index) => (
            <div
              className="relative w-full flex flex-col items-center"
              key={step.id}
            >
              {/* title */}
              <div
                className={`w-full md:w-[90%] h-15 bg-blue-400 border-blue-950 rounded-3xl flex items-center relative py-3 z-10 ${
                  index > 0 ? "mt-10" : ""
                } cursor-pointer`}
                onClick={() => handleToggle(index)}
              >
                <div className="w-10 h-10 bg-black rounded-full text-white flex items-center justify-center ml-4">
                  {step.id}
                </div>
                <div className="text-black text-3xl ml-2 font-medium absolute left-1/2 transform -translate-x-1/2 max-w-[70%] truncate text-center">
                  {step.title}
                </div>
              </div>

              {/* Vertical dotted line - for all steps */}
              <div
                className={`absolute top-[40px] ${
                  index === roadmapSteps.length - 1
                    ? "h-[calc(100%+20px)]"
                    : "h-[calc(100%+120px)]"
                } w-0 border-l-2 border-dashed border-black left-1/2 transform -translate-x-1/2 z-0`}
              ></div>

              {/* Chapters container - only show if this step is open */}
              {openStepArr[index] && (
                <div className="flex flex-col items-center w-full mt-8 relative">
                  {step.chapters.map((chapter, chapterIndex) => (
                    <div
                      key={chapter.id}
                      className={`md:w-[45%] ${
                        chapterIndex === 0 ? "mt-2" : "mt-6"
                      } bg-blue-400 border-blue-950 rounded-lg shadow-lg flex items-center py-4 px-6 relative z-10 ${
                        index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                      }`}
                    >
                      {/* Horizontal dotted line */}
                      <div
                        className={`hidden md:block absolute top-1/2 ${
                          index % 2 === 0
                            ? "right-[-60px] w-[60px]"
                            : "left-[-60px] w-[60px]"
                        } border-t-2 border-dashed border-black`}
                      ></div>

                      <div className="text-black text-lg md:text-xl font-medium flex items-center w-full">
                        <div
                          className={`min-w-[36px] h-9 bg-black rounded-full text-white flex items-center justify-center mr-4 text-sm font-bold ${
                            index % 2 !== 0 ? "md:order-2 md:ml-4 md:mr-0" : ""
                          }`}
                        >
                          {chapter.id}
                        </div>
                        <span
                          className={`line-clamp-2 ${
                            index % 2 !== 0 ? "md:text-right md:order-1" : ""
                          }`}
                        >
                          {chapter.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* END div */}
        <div className="text-2xl font-bold mb-10 flex items-center justify-center text-white bg-blue-950 mt-15 w-40 rounded-3xl h-15">
          END
        </div>
      </div>
    </div>
  );
};

export default Course;
