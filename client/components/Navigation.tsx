import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Heart,
  Clock,
  FileText,
  Info,
  MessageCircle,
  Menu,
  X,
  Home,
  Bot,
} from "lucide-react";
import logo from "../../logo.png";
import { loadResources, type Resource } from "../utils/localStorage";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadResources();
      setResources(data);
    };
    loadData();
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/recent", label: "Recent", icon: Clock },
    { path: "/request", label: "Request", icon: FileText },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: MessageCircle },
    { path: "/assistant", label: "Assistant", icon: Bot },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query.toLowerCase()) ||
          resource.subject.toLowerCase().includes(query.toLowerCase()) ||
          resource.description.toLowerCase().includes(query.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );
      setSearchResults(filtered.slice(0, 6));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      // Navigate to resources page with search query
      window.location.href = `/resources?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary font-heading font-bold text-lg sm:text-xl"
            >
              <img src={logo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="hidden xs:block sm:block">Eduvault</span>
              <span className="block xs:hidden sm:hidden">Eduvault</span>
            </Link>
            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search resources, subjects, or topics..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSearchResults(false), 200)
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    aria-label="Search resources"
                  />
                </div>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((resource) => (
                          <Link
                            key={resource.id}
                            to={`/viewer/${resource.id}`}
                            className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="font-medium text-gray-900 text-sm">
                              {resource.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {resource.subject} • Grade {resource.grade} •{" "}
                              {resource.type}
                            </div>
                          </Link>
                        ))}
                        <Link
                          to={`/resources?search=${encodeURIComponent(searchQuery)}`}
                          className="block px-4 py-3 text-center text-primary hover:bg-primary/5 font-medium text-sm border-t border-gray-100"
                          onClick={() => setShowSearchResults(false)}
                        >
                          View All Results for "{searchQuery}"
                        </Link>
                      </>
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500 text-sm">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs xl:text-sm font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-3 sm:pb-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() =>
                  setTimeout(() => setShowSearchResults(false), 200)
                }
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </form>

            {/* Mobile Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((resource) => (
                        <Link
                          key={resource.id}
                          to={`/viewer/${resource.id}`}
                          className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                          onClick={() => setShowSearchResults(false)}
                        >
                          <div className="font-medium text-gray-900 text-sm">
                            {resource.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {resource.subject} • Grade {resource.grade} •{" "}
                            {resource.type}
                          </div>
                        </Link>
                      ))}
                      <Link
                        to={`/resources?search=${encodeURIComponent(searchQuery)}`}
                        className="block px-4 py-3 text-center text-primary hover:bg-primary/5 font-medium text-sm border-t border-gray-100"
                        onClick={() => setShowSearchResults(false)}
                      >
                        View All Results for "{searchQuery}"
                      </Link>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="space-y-1 sm:space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 sm:py-4 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm sm:text-base">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navigation;
