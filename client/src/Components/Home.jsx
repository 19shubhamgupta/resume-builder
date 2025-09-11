import React from "react";

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-spin-slow"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full animate-float delay-300"></div>
        <div className="absolute top-40 right-40 w-6 h-6 bg-purple-400 rounded-full animate-float delay-700"></div>
        <div className="absolute bottom-40 left-40 w-5 h-5 bg-pink-400 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-float delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight animate-gradient">
                Build Your
                <br />
                <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight animate-gradient">
                  Dream Resume
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-expand"></div>
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl animate-fade-in-up delay-300">
                Create professional, ATS-friendly resumes with our AI-powered
                builder. Stand out from the crowd and land your dream job.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-500">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-pulse-subtle">
                <span className="relative z-10">Start Building Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </button>

              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-purple-400 hover:text-purple-600 transform hover:-translate-y-1 transition-all duration-300">
                View Templates
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start animate-fade-in-up delay-700">
              <div className="text-center animate-count-up">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-500">Resumes Created</div>
              </div>
              <div className="text-center animate-count-up delay-200">
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="text-center animate-count-up delay-400">
                <div className="text-3xl font-bold text-pink-600">5★</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Resume Mockup */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center animate-fade-in-up delay-300">
            <div className="relative">
              {/* Main Resume Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 h-96 transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-float-resume">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-32 animate-shimmer"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-shimmer delay-200"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded animate-shimmer delay-300"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 animate-shimmer delay-400"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6 animate-shimmer delay-500"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-blue-200 rounded w-20 animate-shimmer delay-600"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-blue-100 rounded-full w-16 animate-shimmer delay-700"></div>
                      <div className="h-6 bg-purple-100 rounded-full w-20 animate-shimmer delay-800"></div>
                      <div className="h-6 bg-pink-100 rounded-full w-14 animate-shimmer delay-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 w-32 h-24 transform -rotate-12 animate-float delay-500">
                <div className="space-y-2">
                  <div className="h-2 bg-green-200 rounded animate-shimmer"></div>
                  <div className="h-2 bg-green-200 rounded w-3/4 animate-shimmer delay-100"></div>
                  <div className="h-2 bg-green-200 rounded w-1/2 animate-shimmer delay-200"></div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 w-36 h-28 transform rotate-12 animate-float delay-1000">
                <div className="space-y-2">
                  <div className="h-3 bg-orange-200 rounded animate-shimmer delay-300"></div>
                  <div className="h-2 bg-orange-100 rounded animate-shimmer delay-400"></div>
                  <div className="h-2 bg-orange-100 rounded w-4/5 animate-shimmer delay-500"></div>
                  <div className="h-2 bg-orange-100 rounded w-3/5 animate-shimmer delay-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="relative z-10 text-center py-16 animate-fade-in-up delay-1000">
        <p className="text-lg text-gray-600 mb-6">
          Join thousands of professionals who landed their dream jobs
        </p>
        <div className="flex justify-center space-x-8 opacity-60">
          <div className="text-2xl font-bold text-gray-400">Google</div>
          <div className="text-2xl font-bold text-gray-400">Microsoft</div>
          <div className="text-2xl font-bold text-gray-400">Apple</div>
          <div className="text-2xl font-bold text-gray-400">Amazon</div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-resume {
          0%,
          100% {
            transform: translateY(0px) rotate(3deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }

        @keyframes expand {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-resume {
          animation: float-resume 4s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-expand {
          animation: expand 2s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        .animate-count-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Hero;
