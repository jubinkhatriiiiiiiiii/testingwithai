import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { isOnline, addNetworkListeners } from "../utils/pwaUtils";

const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        setOnline(true);
        setShowBackOnline(true);
        // Hide "back online" message after 3 seconds
        setTimeout(() => setShowBackOnline(false), 3000);
      },
      () => {
        setOnline(false);
        setShowBackOnline(false);
      },
    );

    return cleanup;
  }, []);

  return (
    <AnimatePresence>
      {(!online || showBackOnline) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg ${
            online ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            {online ? (
              <>
                <Wifi className="h-4 w-4" />
                <span>Back online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span>You're offline</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
