// PWA utilities for installation and offline detection

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Listen for the beforeinstallprompt event
export const initPWAInstallPrompt = (): void => {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log("PWA: Install prompt available");
  });
};

// Show the install prompt
export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log("PWA: Install prompt not available");
    return false;
  }

  try {
    // Show the prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`PWA: User ${outcome} the install prompt`);

    // Clear the deferredPrompt
    deferredPrompt = null;

    return outcome === "accepted";
  } catch (error) {
    console.error("PWA: Error showing install prompt:", error);
    return false;
  }
};

// Check if PWA install prompt is available
export const isInstallPromptAvailable = (): boolean => {
  return deferredPrompt !== null;
};

// Check if app is installed (running in standalone mode)
export const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS Safari
    (window.navigator as any).standalone === true
  );
};

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

// Online/offline detection
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Listen for online/offline events
export const addNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void,
): (() => void) => {
  const handleOnline = () => {
    console.log("PWA: Back online");
    onOnline();
  };

  const handleOffline = () => {
    console.log("PWA: Gone offline");
    onOffline();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
};

// Get device info
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    serviceWorkerSupported: "serviceWorker" in navigator,
    pushSupported: "PushManager" in window,
    notificationSupported: "Notification" in window,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
};

// Storage utilities
export const getStorageInfo = () => {
  return {
    localStorage: {
      supported: typeof Storage !== "undefined",
      usage: localStorage.length,
    },
    sessionStorage: {
      supported: typeof sessionStorage !== "undefined",
      usage: sessionStorage.length,
    },
  };
};

// Performance utilities
export const logPerformance = () => {
  if ("performance" in window) {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType("paint");

    console.log("PWA Performance:", {
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find((p) => p.name === "first-paint")?.startTime,
      firstContentfulPaint: paint.find(
        (p) => p.name === "first-contentful-paint",
      )?.startTime,
    });
  }
};

// Initialize PWA features
export const initPWA = () => {
  console.log("PWA: Initializing...");

  // Initialize install prompt
  initPWAInstallPrompt();

  // Log device and performance info
  console.log("PWA Device Info:", getDeviceInfo());
  console.log("PWA Storage Info:", getStorageInfo());

  // Log performance after load
  if (document.readyState === "complete") {
    logPerformance();
  } else {
    window.addEventListener("load", logPerformance);
  }

  console.log("PWA: Initialized successfully");
};
