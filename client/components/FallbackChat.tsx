import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ExternalLink, Phone, Mail } from "lucide-react";

const FallbackChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let checkTawkTimeout: NodeJS.Timeout;
    let checkInterval: NodeJS.Timeout;

    const checkTawkAvailability = () => {
      // Check if Tawk_API exists and has the essential functions
      const tawkAvailable =
        window.Tawk_API &&
        typeof window.Tawk_API.toggle === "function" &&
        document.querySelector('#tawkchat-container, iframe[src*="tawk.to"]');

      if (tawkAvailable) {
        console.log("Tawk.to is available");
        setShowFallback(false);
        clearTimeout(checkTawkTimeout);
        clearInterval(checkInterval);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkTawkAvailability()) {
      return;
    }

    // Check every 2 seconds for the first 10 seconds
    checkInterval = setInterval(() => {
      checkTawkAvailability();
    }, 2000);

    // Final check after 12 seconds - if still not available, show fallback
    checkTawkTimeout = setTimeout(() => {
      if (!checkTawkAvailability()) {
        console.log(
          "Tawk.to not available after 12 seconds, showing fallback chat",
        );
        setShowFallback(true);
      }
      clearInterval(checkInterval);
    }, 12000);

    // Set up Tawk.to event listeners if the API becomes available
    const originalTawkOnLoad = window.Tawk_API?.onLoad;
    if (window.Tawk_API) {
      window.Tawk_API.onLoad = function () {
        console.log("Tawk.to loaded successfully");
        setShowFallback(false);
        clearTimeout(checkTawkTimeout);
        clearInterval(checkInterval);
        if (originalTawkOnLoad) originalTawkOnLoad();
      };
    }

    return () => {
      clearTimeout(checkTawkTimeout);
      clearInterval(checkInterval);
    };
  }, []);

  if (!showFallback) {
    return null;
  }

  const whatsappMessage = encodeURIComponent(
    "Hello! I need help with Eduvault. I'm looking for study materials and would appreciate your assistance.",
  );

  return (
    <>
      {/* Fallback Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border z-50"
          >
            <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
              <h3 className="font-medium">Contact Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Our live chat is temporarily unavailable. Please contact us
                through one of these methods:
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/9842562565?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800">WhatsApp</div>
                  <div className="text-sm text-green-600">Get instant help</div>
                </div>
                <ExternalLink className="h-4 w-4 text-green-600 group-hover:text-green-700" />
              </a>

              {/* Email */}
              <a
                href="/contact"
                className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-800">Email Support</div>
                  <div className="text-sm text-blue-600">Send us a message</div>
                </div>
                <ExternalLink className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
              </a>

              {/* Contact Page */}
              <a
                href="/contact"
                className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Contact Page</div>
                  <div className="text-sm text-gray-600">
                    More contact options
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Contact Support"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>
    </>
  );
};

export default FallbackChat;
