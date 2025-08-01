import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Filter,
  Search,
  Heart,
  ExternalLink,
  Grid3X3,
  List,
  SortAsc,
  X,
} from "lucide-react";
import {
  loadResources,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  type Resource,
} from "../utils/localStorage";

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedSubject, setSelectedSubject] = useState(
    searchParams.get("subject") || "",
  );
  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get("grade") || "",
  );
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadResources();
      setResources(data);
      setLoading(false);
    };
    loadData();

    // Load favorites
    const loadFavorites = () => {
      const favs = JSON.parse(localStorage.getItem("adros-favorites") || "[]");
      setFavorites(favs);
    };
    loadFavorites();

    // Listen for localStorage changes
    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update search query when URL params change
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    setSearchQuery(searchParam);
  }, [searchParams]);

  const subjects = [...new Set(resources.map((r) => r.subject))].sort();
  const grades = [...new Set(resources.map((r) => r.grade))].sort();
  const types = [...new Set(resources.map((r) => r.type))].sort();

  const filteredAndSortedResources = useMemo(() => {
    let filtered = resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesSubject =
        selectedSubject === "" || resource.subject === selectedSubject;
      const matchesGrade =
        selectedGrade === "" || resource.grade === selectedGrade;
      const matchesType = selectedType === "" || resource.type === selectedType;

      return matchesSearch && matchesSubject && matchesGrade && matchesType;
    });

    // Sort resources
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "subject":
        filtered.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
    }

    return filtered;
  }, [
    resources,
    searchQuery,
    selectedSubject,
    selectedGrade,
    selectedType,
    sortBy,
  ]);

  const handleToggleFavorite = (resourceId: string) => {
    if (isFavorite(resourceId)) {
      removeFromFavorites(resourceId);
      setFavorites((prev) => prev.filter((id) => id !== resourceId));
    } else {
      addToFavorites(resourceId);
      setFavorites((prev) => [...prev, resourceId]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("");
    setSelectedGrade("");
    setSelectedType("");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedSubject || selectedGrade || selectedType;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
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
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Study Resources"}
        </h1>
        <p className="text-gray-600">
          {searchQuery
            ? `Found ${filteredAndSortedResources.length} results`
            : `Browse our collection of ${resources.length} educational resources`}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        {/* Filter Toggle for Mobile */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 text-gray-600 hover:text-primary"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
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

            {/* Sort Dropdown */}
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
        </div>

        {/* Filters */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? "block" : "hidden md:grid"}`}
        >
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-2"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredAndSortedResources.length} resource
          {filteredAndSortedResources.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Resources Grid/List */}
      <AnimatePresence>
        {filteredAndSortedResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-primary">
                Clear all filters
              </button>
            )}
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
                        onClick={() => handleToggleFavorite(resource.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(resource.id)
                            ? "text-red-500 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.includes(resource.id) ? "fill-current" : ""}`}
                        />
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
                            onClick={() => handleToggleFavorite(resource.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              favorites.includes(resource.id)
                                ? "text-red-500 bg-red-50"
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.includes(resource.id) ? "fill-current" : ""}`}
                            />
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
    </div>
  );
};

export default Resources;
