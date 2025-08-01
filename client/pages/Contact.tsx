import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import {
  sendContactMessage,
  type ContactFormData,
} from "../utils/emailService";

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const success = await sendContactMessage(formData);

      if (success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setError(
          "Failed to send message. Please try using the WhatsApp option below or the live chat widget.",
        );
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        "An error occurred. Please try using the WhatsApp option below or the live chat widget.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello! I need help with Eduvault. I'm looking for study materials and would appreciate your assistance.",
  );

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our chat widget",
      action: "Available on all pages",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      description: "Message us directly on WhatsApp",
      action: "Start Conversation",
      color: "bg-green-50 text-green-600 border-green-200",
      link: `https://wa.me/9842562565?text=${whatsappMessage}`,
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email using the form below",
      action: "Fill out the form",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
  ];

  const faqs = [
    {
      question: "How do I request a specific resource?",
      answer:
        "Use our Request Resource page to submit details about what you need. We typically respond within 24-48 hours.",
    },
    {
      question: "Are all resources really free?",
      answer:
        "Yes! All educational resources on Eduvault are completely free and will always remain so.",
    },
    {
      question: "How can I contribute resources?",
      answer:
        "You can share resources through our contact form or use the resource request form to submit materials you want to share.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Absolutely. We prioritize your privacy and only use your information to provide educational support. We never share personal data with third parties.",
    },
  ];

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
            Message Sent!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary w-full"
            >
              Send Another Message
            </button>

            <a
              href="/resources"
              className="block w-full text-center py-3 px-4 border border-gray-200 rounded-lg text-gray-600 hover:text-primary hover:border-primary transition-colors"
            >
              Browse Resources
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>

            <p className="text-xl text-gray-600">
              Have questions, feedback, or need help? We're here to support your
              academic journey. Reach out to us through any of the methods
              below.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Contact Methods
              </h2>

              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`border ${method.color} rounded-lg p-6 hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start space-x-4">
                        <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{method.title}</h3>
                          <p className="text-sm mb-3 opacity-80">
                            {method.description}
                          </p>
                          {method.link ? (
                            <a
                              href={method.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm font-medium hover:underline"
                            >
                              <span>{method.action}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-sm font-medium">
                              {method.action}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gray-100 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Response Times</span>
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Live Chat:</span>
                    <span className="font-medium">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp:</span>
                    <span className="font-medium">Within 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name *
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

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

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
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about Eduvault
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary/20 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white text-center"
        >
          <MessageSquare className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-bold mb-4">
            Need Immediate Help?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            For urgent questions or immediate assistance with finding study
            materials, message us on WhatsApp and get a response within an hour.
          </p>
          <a
            href={`https://wa.me/9842562565?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Message on WhatsApp</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
