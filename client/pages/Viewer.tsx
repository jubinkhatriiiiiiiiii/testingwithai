import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Heart,
  Edit3,
  Save,
  ExternalLink,
  ArrowLeft,
  Clock,
  Tag,
  User,
} from "lucide-react";
import {
  loadResources,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyViewed,
  getUserNotes,
  saveUserNotes,
  type Resource,
} from "../utils/localStorage";

const Viewer = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      setLoading(true);
      const resources = await loadResources();
      const currentResource = resources.find((r) => r.id === id);

      if (currentResource) {
        setResource(currentResource);
        setIsFav(isFavorite(id));
        setNotes(getUserNotes(id));

        // Add to recently viewed
        addToRecentlyViewed(id);

        // Find related resources (same subject or similar tags)
        const related = resources
          .filter(
            (r) =>
              r.id !== id &&
              (r.subject === currentResource.subject ||
                r.tags.some((tag) => currentResource.tags.includes(tag))),
          )
          .slice(0, 6);
        setRelatedResources(related);
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!id) return;

    if (isFav) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
    setIsFav(!isFav);
  };

  const handleSaveNotes = () => {
    if (!id) return;

    saveUserNotes(id, notes);
    setIsEditingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Resource Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The requested resource could not be found.
          </p>
          <Link to="/resources" className="btn-primary">
            Browse Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3 sm:gap-0">
            <Link
              to="/resources"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Resources</span>
            </Link>

            <button
              onClick={handleToggleFavorite}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${
                isFav
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">
                {isFav ? "Remove from Favorites" : "Add to Favorites"}
              </span>
              <span className="sm:hidden">
                {isFav ? "Unfavorite" : "Favorite"}
              </span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2">
                {resource.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{resource.subject}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Grade {resource.grade}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(resource.dateAdded).toLocaleDateString()}
                  </span>
                </span>
              </div>

              <p className="text-gray-700 mb-4">{resource.description}</p>

              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-medium text-gray-900">Document Viewer</h2>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in New Tab</span>
                </a>
              </div>

              <div className="aspect-[4/5] bg-gray-100 min-h-[60vh] sm:min-h-[70vh]">
                <iframe
                  src={resource.url}
                  className="w-full h-full border-0"
                  title={resource.title}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-gray-900">
                  My Notes
                </h3>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center space-x-1 btn-primary text-sm py-1 px-3"
                    >
                      <Save className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes about this resource..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              ) : (
                <div className="min-h-[8rem]">
                  {notes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No notes yet. Click Edit to add your thoughts about this
                      resource.
                    </p>
                  )}
                </div>
              )}

              {notesSaved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-green-600"
                >
                  Notes saved successfully!
                </motion.div>
              )}
            </div>

            {/* Resource Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-gray-900 mb-4">
                Resource Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Subject:</span>
                  <span className="ml-2 text-gray-600">{resource.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Grade Level:
                  </span>
                  <span className="ml-2 text-gray-600">
                    Grade {resource.grade}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">{resource.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Added:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(resource.dateAdded).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              Related Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedResources.map((relatedResource) => (
                <motion.div
                  key={relatedResource.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-primary">
                        {relatedResource.subject}
                      </span>
                      <p className="text-xs text-gray-500">
                        Grade {relatedResource.grade}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedResource.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {relatedResource.description}
                  </p>

                  <Link
                    to={`/viewer/${relatedResource.id}`}
                    className="btn-primary text-sm py-2 px-4 w-full text-center"
                  >
                    View Resource
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer;
