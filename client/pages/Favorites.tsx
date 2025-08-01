import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  BookOpen,
  ExternalLink,
  Trash2,
  SortAsc,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import {
  loadResources,
  getFavorites,
  removeFromFavorites,
  type Resource,
} from "../utils/localStorage";

const Favorites = () => {
  const [favoriteResources, setFavoriteResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterSubject, setFilterSubject] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const favoriteIds = getFavorites();
      const allResources = await loadResources();

      const favorites = allResources.filter((resource) =>
        favoriteIds.includes(resource.id),
      );

      setFavoriteResources(favorites);
      setLoading(false);
    };

    loadFavorites();

    // Listen for localStorage changes
    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleRemoveFavorite = (resourceId: string) => {
    removeFromFavorites(resourceId);
    setFavoriteResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const subjects = [...new Set(favoriteResources.map((r) => r.subject))].sort();

  const filteredAndSortedResources = favoriteResources
    .filter(
      (resource) => filterSubject === "" || resource.subject === filterSubject,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        case "oldest":
          return (
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "subject":
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              Your Favorites
            </h1>
            <p className="text-gray-600">
              {favoriteResources.length} bookmarked resource
              {favoriteResources.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {favoriteResources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            No favorites yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start exploring our resources and bookmark the ones you find useful.
            They'll appear here for easy access later.
          </p>
          <Link to="/resources" className="btn-primary">
            Browse Resources
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Subject Filter */}
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="subject">Subject A-Z</option>
                </select>
              </div>

              {/* View Mode */}
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
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredAndSortedResources.length} favorite
              {filteredAndSortedResources.length !== 1 ? "s" : ""}
              {filterSubject && ` in ${filterSubject}`}
            </p>
          </div>

          {/* Resources */}
          <AnimatePresence>
            {filteredAndSortedResources.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  No favorites match your filter
                </h3>
                <p className="text-gray-600">
                  Try selecting a different subject or clearing the filter.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredAndSortedResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className={
                      viewMode === "grid"
                        ? "bg-white border border-gray-200 rounded-lg p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-200 group"
                        : "bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/20 hover:shadow-md transition-all duration-200 group flex items-center space-x-4"
                    }
                  >
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
                          <button
                            onClick={() => handleRemoveFavorite(resource.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from favorites"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <h3 className="font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
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

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Added{" "}
                            {new Date(resource.dateAdded).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/viewer/${resource.id}`}
                            className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-heading font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-1">
                                {resource.subject} • Grade {resource.grade}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {resource.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() =>
                                  handleRemoveFavorite(resource.id)
                                }
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove from favorites"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <Link
                                to={`/viewer/${resource.id}`}
                                className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>View</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Favorites;
