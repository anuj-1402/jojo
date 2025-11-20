import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sitesAPI, noticesAPI } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { useBookmarksStore } from "../stores/bookmarksStore";
import { Loader, ExternalLink, Bell, BellOff, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function Site() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const { bookmarkedSites, setBookmarkedSites } = useBookmarksStore();

  const [site, setSite] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const siteRes = await sitesAPI.getSiteById(id);
        if (siteRes.success && siteRes.data) {
          setSite(siteRes.data);
          const noticesRes = await noticesAPI.getNoticesBySite(siteRes.data.name);
          if (noticesRes.success && noticesRes.data) setNotices(noticesRes.data);
        } else {
          setError(siteRes.message || "Site not found");
        }
      } catch (err) {
        setError("Site not found or server error.");
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const bookmarkObj = bookmarkedSites.find((b) =>
    (typeof b.siteId === "object" ? b.siteId._id : b.siteId) === id
  );
  const isBookmarked = !!bookmarkObj;
  const notificationsEnabled = bookmarkObj?.notificationsEnabled;

  const refetchBookmarks = async () => {
    try {
      const res = await sitesAPI.getBookmarkedSites();
      if (res.success) setBookmarkedSites(res.data);
    } catch {}
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return;
    setBookmarkLoading(true);
    try {
      await sitesAPI.toggleBookmark(id);
      await refetchBookmarks();
    } catch (err) {
      setError(err.message);
    }
    setBookmarkLoading(false);
  };

  const handleNotificationToggle = async () => {
    if (!isAuthenticated || !isBookmarked) return;
    setNotificationLoading(true);
    try {
      await sitesAPI.toggleNotification(id);
      await refetchBookmarks();
    } catch (err) {
      setError(err.message);
    }
    setNotificationLoading(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="max-w-lg mx-auto mt-20 text-center text-red-600">
        {error}
      </div>
    );

  if (!site) return null;

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Site Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mb-10 p-8 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col md:flex-row items-center gap-8"
      >
        <img
          src={site.logoUrl}
          alt={site.name}
          className="w-28 h-28 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {site.name}
          </h1>
          <a
            href={site.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {site.baseUrl}
          </a>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{site.description}</p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading || !isAuthenticated}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition ${
                isBookmarked
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Bookmark size={18} />
              {bookmarkLoading
                ? "Processing..."
                : isBookmarked
                ? "Bookmarked"
                : "Bookmark"}
            </button>
            <button
              onClick={handleNotificationToggle}
              disabled={
                notificationLoading || !isAuthenticated || !isBookmarked
              }
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition ${
                notificationsEnabled
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              } ${!isBookmarked ? "opacity-60 cursor-not-allowed" : ""}`}
              title={!isBookmarked ? "Bookmark this site to enable notifications" : ""}
            >
              {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              {notificationLoading
                ? "Processing..."
                : notificationsEnabled
                ? "Notifications ON"
                : "Enable Notifications"}
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Scrape Frequency: {site.scrapeFrequency || "24h"}
          </div>
        </div>
      </motion.div>

      {/* Notices Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Job Notices from {site.name}
        </h2>
        {notices.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              No jobs found for this site yet.
            </h3>
            <p>Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <motion.div
                key={notice._id}
                whileHover={{ y: -2 }}
                className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ref: {notice.externalId}
                    </p>
                  </div>
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
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notice.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Application Deadline</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notice.endDate
                        ? new Date(notice.endDate).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Posted Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notice.openDate
                        ? new Date(notice.openDate).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    Last updated:{" "}
                    {notice.updatedAt
                      ? new Date(notice.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}