import React from "react";

const JobImage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-10 bg-white rounded-2xl shadow-lg">
      {/* Left side - Newspaper */}
      <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center w-60 h-60 shadow">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">JOBS</h2>
        <div className="space-y-2 w-full">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
          <div className="h-3 bg-gray-300 rounded w-3/6"></div>
        </div>
      </div>

      {/* Right side - Tablet illustration */}
      <div className="relative flex flex-col items-center">
        <div className="bg-gray-50 rounded-xl p-6 w-72 h-60 border border-gray-200 shadow-md relative">
          {/* Tablet Screen */}
          <div className="bg-white w-full h-full rounded-lg p-4 flex flex-col gap-3">
            <div className="bg-purple-300 h-20 rounded-md"></div>
            <div className="bg-purple-300 h-20 rounded-md"></div>
          </div>
        </div>

        {/* Floating icons */}
        <div className="absolute -right-10 top-6 flex flex-col gap-3">
          <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow">
            $
          </div>
          <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow">
            👥
          </div>
          <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow">
            💼
          </div>
        </div>

        {/* Magnifying glass */}
        <div className="absolute -left-20 bottom-0 flex items-center justify-center">
          <div className="w-20 h-20 border-8 border-purple-400 rounded-full"></div>
          <div className="w-10 h-3 bg-purple-400 rotate-45 transform origin-left"></div>
        </div>

        {/* Character */}
        <div className="absolute -bottom-4 right-10">
          <div className="w-10 h-20 bg-gray-700 rounded-md"></div>
          <div className="w-8 h-8 bg-purple-400 rounded-full -mt-10 ml-1"></div>
        </div>
      </div>
    </div>
  );
};

export default JobImage;
