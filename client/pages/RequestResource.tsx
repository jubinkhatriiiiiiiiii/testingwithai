import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  BookOpen,
  Link as LinkIcon,
  MessageSquare,
  X,
} from "lucide-react";
import {
  sendResourceRequest,
  type ResourceRequestData,
} from "../utils/emailService";

const RequestResource = () => {
  const [formData, setFormData] = useState<ResourceRequestData>({
    name: "",
    phone: "",
    email: "",
    resourceTitle: "",
    description: "",
    driveLink: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = [];
    if (!formData.name?.trim()) missingFields.push("Name");
    if (!formData.phone?.trim()) missingFields.push("Phone");
    if (!formData.email?.trim()) missingFields.push("Email");
    if (!formData.resourceTitle?.trim()) missingFields.push("Resource Title");
    if (!formData.description?.trim()) missingFields.push("Description");

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await sendResourceRequest(formData);

      if (success) {
        setSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          resourceTitle: "",
          description: "",
          driveLink: "",
        });
      } else {
        // Show fallback modal with the request details
        setShowFallback(true);
        setError("");
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      setError(
        "An unexpected error occurred. Please try again or contact us through the chat widget.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Request Submitted!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your resource request. Our team will review it and get
            back to you within 24-48 hours.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary w-full"
            >
              Submit Another Request
            </button>

            <a
              href="/resources"
              className="block w-full text-center py-3 px-4 border border-gray-200 rounded-lg text-gray-600 hover:text-primary hover:border-primary transition-colors"
            >
              Browse Existing Resources
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-8 w-8 text-accent" />
        </div>

        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
          Request a Resource
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Can't find what you're looking for? Let us know what study materials
          you need and we'll do our best to add them to our collection.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  What We Accept
                </h3>
                <p className="text-sm text-blue-700">
                  Study notes, past papers, textbook solutions, practice tests,
                  project guides, and any educational content.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Response Time
                </h3>
                <p className="text-sm text-green-700">
                  We typically process requests within 24-48 hours and will
                  notify you via email once processed.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-8"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Resource Request Form
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Your Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Resource Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Resource Details</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="resourceTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    id="resourceTitle"
                    name="resourceTitle"
                    value={formData.resourceTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g., Grade 12 Physics Past Papers 2023"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Please provide details about the resource you need including subject, grade level, specific topics, exam board, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="driveLink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Google Drive Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="driveLink"
                    name="driveLink"
                    value={formData.driveLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="If you have the resource, share the Google Drive link here"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If you have the resource and want to share it with others,
                    include the link here.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                } transition-all duration-200`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you have questions about the request process or need
                immediate assistance, you can also reach out through our contact
                page or use the chat widget.
              </p>
              <a
                href="/contact"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Fallback Modal */}
        {showFallback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-heading font-semibold text-gray-900">
                  Request Details
                </h3>
                <button
                  onClick={() => setShowFallback(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Email service is currently unavailable.</strong>{" "}
                  Please copy the details below and send them manually to our
                  support team.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Name:</label>
                  <p className="text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email:</label>
                  <p className="text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Phone:</label>
                  <p className="text-gray-900">{formData.phone}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Resource Title:
                  </label>
                  <p className="text-gray-900">{formData.resourceTitle}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Description:
                  </label>
                  <p className="text-gray-900">{formData.description}</p>
                </div>
                {formData.driveLink && (
                  <div>
                    <label className="font-medium text-gray-700">
                      Drive Link:
                    </label>
                    <p className="text-gray-900">{formData.driveLink}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    const text = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nResource Title: ${formData.resourceTitle}\nDescription: ${formData.description}${formData.driveLink ? `\nDrive Link: ${formData.driveLink}` : ""}`;
                    navigator.clipboard.writeText(text);
                    alert("Request details copied to clipboard!");
                  }}
                  className="w-full btn-primary text-sm py-2"
                >
                  Copy Details to Clipboard
                </button>

                <a
                  href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hi! I have a resource request:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nResource Title: ${formData.resourceTitle}\nDescription: ${formData.description}${formData.driveLink ? `\nDrive Link: ${formData.driveLink}` : ""}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium text-center block hover:bg-green-700 transition-colors"
                >
                  Send via WhatsApp
                </a>

                <button
                  onClick={() => {
                    setShowFallback(false);
                    setSubmitted(true);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      resourceTitle: "",
                      description: "",
                      driveLink: "",
                    });
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Mark as Submitted
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestResource;
