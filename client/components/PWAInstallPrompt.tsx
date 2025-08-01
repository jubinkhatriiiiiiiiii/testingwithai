import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import {
  isInstallPromptAvailable,
  showInstallPrompt,
  isPWAInstalled,
  isMobileDevice,
} from "../utils/pwaUtils";

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if we should show the install prompt
    const checkInstallPrompt = () => {
      const shouldShow =
        !isPWAInstalled() &&
        isInstallPromptAvailable() &&
        isMobileDevice() &&
        !localStorage.getItem("pwa-install-dismissed");

      setShowPrompt(shouldShow);
    };

    // Check immediately
    checkInstallPrompt();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setTimeout(checkInstallPrompt, 100); // Small delay to ensure deferredPrompt is set
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const installed = await showInstallPrompt();

      if (installed) {
        setShowPrompt(false);
        localStorage.setItem("pwa-installed", "true");
      }
    } catch (error) {
      console.error("Install failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Install AdrosNotesHub
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Get quick access to study resources and use offline features
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className={`flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isInstalling
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary/90"
                  }`}
                >
                  {isInstalling ? (
                    <>
                      <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                      <span>Installing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3" />
                      <span>Install</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
