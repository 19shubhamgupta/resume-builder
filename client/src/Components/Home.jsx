import React from "react";
import AutoTypingResume from "./AutoTypingResume";

const Hero = () => {
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      {/* Left Spacer */}
      <div
        className="hidden lg:block"
        style={{ flexBasis: "75px", minWidth: 0 }}
      ></div>

      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 className="text-primary pb-2 text-4xl font-bold lg:text-5xl">
          Create a professional
          <br />
          resume easily
        </h1>
        <p className="mt-3 text-lg lg:mt-5 lg:text-xl">
          With this free, open-source, and powerful resume builder
        </p>
        <a href="/templates" className="btn-primary mt-6 lg:mt-14">
          Create Resume <span aria-hidden="true">→</span>
        </a>

        <p className="mt-3 text-sm text-gray-600 lg:mt-36">
          Already have a resume? Test its ATS readability with the{" "}
          <a href="/resume-parser" className="underline underline-offset-2">
            resume parser
          </a>
        </p>
      </div>

      {/* Right Spacer */}
      <div
        className="hidden lg:block"
        style={{ flexBasis: "100px", minWidth: "50px" }}
      ></div>

      {/* Placeholder instead of AutoTypingResume */}
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <div className="mt-10 mr-10 border rounded-lg p-4 text-gray-600">
          <AutoTypingResume />
        </div>
      </div>
    </section>
  );
};

export default Hero;
