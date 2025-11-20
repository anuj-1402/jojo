import React, { useEffect, useState } from "react";
import { sitesAPI } from "../services/api";
import { Link } from "react-router-dom";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sitesAPI.getAllSites().then((res) => {
      if (res.data) setSites(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg text-gray-600">Loading sites...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">All Sites</h2>
      <div className="grid gap-4">
        {sites.map((site) => (
          <div
            key={site._id}
            className="p-4 bg-white dark:bg-gray-900 rounded shadow flex items-center gap-4"
          >
            <img src={site.logoUrl} alt={site.name} className="w-12 h-12 object-contain" />
            <div>
              <Link
                to={`/sites/${site._id}`}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {site.name}
              </Link>
              <div className="text-sm text-gray-500">{site.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}