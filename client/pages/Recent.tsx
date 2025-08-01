import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BookOpen,
  ExternalLink,
  Trash2,
  RefreshCw,
  Grid3X3,
  List,
} from "lucide-react";
import {
  loadResources,
  getRecentlyViewed,
  clearRecentlyViewed,
  type Resource,
} from "../utils/localStorage";

const Recent = () => {
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const loadRecent = async () => {
      setLoading(true);
      const recentIds = getRecentlyViewed();
      const allResources = await loadResources();

      const recent = recentIds
        .map((id) => allResources.find((resource) => resource.id === id))
        .filter((resource): resource is Resource => resource !== undefined);

      setRecentResources(recent);
      setLoading(false);
    };

    loadRecent();

    const handleStorageChange = () => loadRecent();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your viewing history?")) {
      clearRecentlyViewed();
      setRecentResources([]);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recent activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Recently Viewed
              </h1>
              <p className="text-gray-600">
                {recentResources.length} recently viewed resource
                {recentResources.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {recentResources.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:text-primary"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:text-primary"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {recentResources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            No recent activity
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start exploring our resources and they'll appear here for quick
            access. We keep track of your last 10 viewed resources.
          </p>
          <Link to="/resources" className="btn-primary">
            Browse Resources
          </Link>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {recentResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className={
                    viewMode === "grid"
                      ? "bg-white border border-gray-200 rounded-lg p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-200 group relative flex flex-col h-full"
                      : "bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/20 hover:shadow-md transition-all duration-200 group flex items-center space-x-4 relative"
                  }
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Latest
                    </div>
                  )}

                  {viewMode === "grid" ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-primary">
                              {resource.subject}
                            </span>
                            <p className="text-xs text-gray-500">
                              Grade {resource.grade}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(resource.dateAdded)}</span>
                        </div>
                      </div>

                      <h3 className="font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors truncate">
                        {resource.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {resource.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-gray-500">
                          #{index + 1} most recent
                        </span>
                        <Link
                          to={`/viewer/${resource.id}`}
                          className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View Again</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-heading font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                              {index === 0 && (
                                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {resource.subject} • Grade {resource.grade}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1 mb-1">
                              {resource.description}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                #{index + 1} most recent •{" "}
                                {getTimeAgo(resource.dateAdded)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link
                              to={`/viewer/${resource.id}`}
                              className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View Again</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  How Recent History Works
                </h3>
                <p className="text-sm text-blue-700">
                  We automatically track your last 10 viewed resources to help
                  you quickly return to materials you've been studying. Your
                  viewing history is stored locally on your device and never
                  shared.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Recent;

