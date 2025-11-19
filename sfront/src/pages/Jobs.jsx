import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSitesStore } from "../stores/sitesStore";
import { useNoticesStore } from "../stores/noticesStore";
import { useBookmarksStore } from "../stores/bookmarksStore";
import { sitesAPI, noticesAPI } from "../services/api";
import { Bookmark, ExternalLink, Loader } from "lucide-react";

export default function Jobs() {
  const { sites, setSites, setLoading: setSitesLoading, error: sitesError } = useSitesStore();
  const { notices, setNotices, setSiteNotices, setLoading: setNoticesLoading } = useNoticesStore();
  const { bookmarkedSites } = useBookmarksStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sites on mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        setSitesLoading(true);
        const response = await sitesAPI.getAllSites();
        if (response.success && response.data) {
          setSites(response.data);
          // Set first site as default
          if (response.data.length > 0) {
            setSelectedSite(response.data[0]._id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setSitesLoading(false);
        setLoading(false);
      }
    };
    fetchSites();
  }, [setSites, setSitesLoading]);

  // Fetch notices for selected site
  useEffect(() => {
    console.log('🔵 useEffect triggered - selectedSite:', selectedSite);
    console.log('🔵 Sites array:', sites);
    
    if (!selectedSite) {
   
      return;
    }
  
    const fetchNotices = async () => {
      try {
        setNoticesLoading(true);
        
        // Get the site object to access its name
        const site = sites.find(s => s._id === selectedSite);
        console.log('🟢 Found site:', site);
        
        if (!site) {
          return;
        }
  
        
        // Use site name instead of ID
        const response = await noticesAPI.getNoticesBySite(site.name);
      
        
        if (response.success && response.data) {
        
          
          // Store by site name
          setSiteNotices(site.name, response.data);
          // Also set as current notices for display
          setNotices(response.data);}
       
        
      } catch (err) {
    
        setError(err.message);
      } finally {
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, [selectedSite, sites, setNotices, setSiteNotices, setNoticesLoading]);

  // Filter notices by search term
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.externalId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Add this to monitor the notices state
  

  // Check if a notice is bookmarked
  const isBookmarked = (noticeId) => {
    return bookmarkedSites.some((b) => b._id === noticeId);
  };

  

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
        Job Listings
      </h2>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sites Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organizations
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sites.map((site) => (
                <button
                  key={site._id}
                  onClick={() => setSelectedSite(site._id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedSite === site._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="font-medium text-sm">{site.name}</div>
                  <div className="text-xs opacity-75 mt-1">{site.baseUrl}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notices Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by job title, location, or ref number..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Site Info */}
          {selectedSite && sites.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {filteredNotices.length} job(s) found from{" "}
                <span className="font-semibold">
                  {sites.find((s) => s._id === selectedSite)?.name}
                </span>
              </p>
            </div>
          )}

          {/* Job Notices Cards */}
          {filteredNotices.length > 0 ? (
            <div className="grid gap-6">
              {filteredNotices.map((notice) => (
                <motion.div
                  key={notice._id}
                  whileHover={{ y: -4 }}
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
                    <Bookmark
                      size={20}
                      className={`cursor-pointer transition ${
                        isBookmarked(notice._id)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-400 hover:text-yellow-500"
                      }`}
                    />
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
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(notice.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Select an organization to view job listings"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
