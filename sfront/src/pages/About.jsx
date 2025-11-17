import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-6 flex flex-col items-center">
      <div className="max-w-6xl w-full text-center">
        {/* Title Section */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          About <span className="text-blue-700 dark:text-indigo-400">JobScraper</span>
        </h2>

        {/* Subtitle / Intro */}
        <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          JobScraper is your trusted platform for discovering verified government
          job openings across India. We combine automation with accuracy to
          deliver timely updates, all in one modern and simple interface.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-200 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-indigo-900 mx-auto flex items-center justify-center mb-4 text-2xl">
              🔎
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              Automated Scraping
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
              JobScraper automatically fetches listings from official sources to
              keep the database current without manual effort.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-200 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto flex items-center justify-center mb-4 text-2xl">
              🗄️
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              Centralized Access
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
              Explore all public-sector job openings in one place, categorized and
              searchable for your convenience.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-200 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center mb-4 text-2xl">
              🔔
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              Save & Track
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
              Bookmark jobs, revisit them anytime, and stay informed about your
              saved applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
