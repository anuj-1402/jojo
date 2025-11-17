import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBookmarksStore } from "../stores/bookmarksStore";
import { useAuthStore } from "../stores/authStore";
import { sitesAPI, noticesAPI } from "../services/api";
import { Loader, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Bookmarks() {
  const { isAuthenticated } = useAuthStore();
  const { bookmarkedSites, bookmarkedNotices, setBookmarkedSites, setBookmarkedNotices, removeBookmarkedSite, setLoading } = useBookmarksStore();
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("sites"); // 'sites' or 'notices'

  useEffect(() => {
    if (!isAuthenticated) {
      setLocalLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setLocalLoading(true);
        setLoading(true);

        // Fetch bookmarked sites
        const sitesRes = await sitesAPI.getBookmarkedSites();
        if (sitesRes.success) {
          setBookmarkedSites(sitesRes.data || []);
        }

        // Fetch bookmarked notices
        const noticesRes = await noticesAPI.getBookmarkedNotices();
        if (noticesRes.success) {
          setBookmarkedNotices(noticesRes.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, setBookmarkedSites, setBookmarkedNotices, setLoading]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">🔐</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Login Required
          </h3>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Please login to view your bookmarked jobs and sites.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const hasBookmarks = bookmarkedSites.length > 0 || bookmarkedNotices.length > 0;

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        My Bookmarks
      </h2>

      {!hasBookmarks ? (
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl text-gray-400 dark:text-gray-500 mb-4">🔖</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Bookmarks Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Save interesting job postings and organizations to view them here later.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("sites")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "sites"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Bookmarked Sites ({bookmarkedSites.length})
            </button>
            <button
              onClick={() => setActiveTab("notices")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "notices"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Bookmarked Jobs ({bookmarkedNotices.length})
            </button>
          </div>

          {/* Bookmarked Sites Tab */}
          {activeTab === "sites" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {bookmarkedSites.length > 0 ? (
                bookmarkedSites.map((bookmark) => (
                  <motion.div
                    key={bookmark._id}
                    whileHover={{ y: -4 }}
                    className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {bookmark.siteId?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {bookmark.siteId?.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 break-all mb-2">
                        {bookmark.siteId?.baseUrl}
                      </p>
                      <div className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                        {bookmark.notificationsEnabled ? "🔔 Notifications ON" : "🔕 Notifications OFF"}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={bookmark.siteId?.baseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                      >
                        Visit Site
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => removeBookmarkedSite(bookmark.siteId?._id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No bookmarked sites yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Bookmarked Jobs Tab */}
          {activeTab === "notices" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {bookmarkedNotices.length > 0 ? (
                bookmarkedNotices.map((notice) => (
                  <motion.div
                    key={notice._id}
                    whileHover={{ x: 4 }}
                    className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {notice.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {notice.site?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Ref: {notice.externalId}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notice.location || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Deadline</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notice.endDate
                            ? new Date(notice.endDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Posted</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notice.openDate
                            ? new Date(notice.openDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Updated</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notice.updatedAt
                            ? new Date(notice.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <a
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        View Details
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No bookmarked jobs yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
