// Debug utilities for monitoring third-party services and application health

interface ServiceStatus {
  name: string;
  status: "loading" | "loaded" | "failed" | "unavailable";
  loadTime?: number;
  error?: string;
  lastChecked: number;
}

class DebugMonitor {
  private services: Map<string, ServiceStatus> = new Map();
  private errorLog: Array<{ timestamp: number; error: any; source: string }> =
    [];
  private maxErrorLogSize = 50;

  constructor() {
    this.setupGlobalErrorHandling();
    this.monitorThirdPartyServices();
  }

  private setupGlobalErrorHandling() {
    // Monitor window errors
    window.addEventListener("error", (event) => {
      this.logError(event.error || event.message, "window.error", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(event.reason, "unhandledrejection");
    });

    // Monitor console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.logError(args, "console.error");
      originalConsoleError.apply(console, args);
    };
  }

  private monitorThirdPartyServices() {
    // Monitor Tawk.to
    this.monitorService("tawk.to", () => {
      return (
        window.Tawk_API &&
        typeof window.Tawk_API.toggle === "function" &&
        document.querySelector(
          '#tawkchat-container, iframe[src*="tawk.to"]',
        ) !== null
      );
    });

    // Monitor EmailJS (if configured)
    this.monitorService("emailjs", () => {
      return (window as any).emailjs !== undefined;
    });

    // Start monitoring
    this.startPeriodicCheck();
  }

  private monitorService(name: string, checkFunction: () => boolean) {
    const service: ServiceStatus = {
      name,
      status: "loading",
      lastChecked: Date.now(),
    };

    this.services.set(name, service);

    // Check immediately
    this.checkService(name, checkFunction);
  }

  private checkService(name: string, checkFunction: () => boolean) {
    const service = this.services.get(name);
    if (!service) return;

    const startTime = performance.now();

    try {
      const isAvailable = checkFunction();
      const loadTime = performance.now() - startTime;

      service.status = isAvailable ? "loaded" : "unavailable";
      service.loadTime = loadTime;
      service.lastChecked = Date.now();
      service.error = undefined;
    } catch (error) {
      service.status = "failed";
      service.error = error instanceof Error ? error.message : String(error);
      service.lastChecked = Date.now();

      this.logError(error, `service.${name}`);
    }
  }

  private startPeriodicCheck() {
    // Check services every 30 seconds
    setInterval(() => {
      this.services.forEach((service, name) => {
        // Only recheck failed or unavailable services
        if (service.status === "failed" || service.status === "unavailable") {
          const checkFunction = this.getCheckFunction(name);
          if (checkFunction) {
            this.checkService(name, checkFunction);
          }
        }
      });
    }, 30000);
  }

  private getCheckFunction(name: string): (() => boolean) | null {
    switch (name) {
      case "tawk.to":
        return () =>
          window.Tawk_API &&
          typeof window.Tawk_API.toggle === "function" &&
          document.querySelector(
            '#tawkchat-container, iframe[src*="tawk.to"]',
          ) !== null;
      case "emailjs":
        return () => (window as any).emailjs !== undefined;
      default:
        return null;
    }
  }

  private logError(error: any, source: string, metadata?: any) {
    const errorEntry = {
      timestamp: Date.now(),
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
      source,
      metadata,
    };

    this.errorLog.push(errorEntry);

    // Keep only the last N errors
    if (this.errorLog.length > this.maxErrorLogSize) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[DebugMonitor] Error from ${source}:`, error, metadata);
    }
  }

  // Public methods for accessing debug information
  public getServiceStatus(
    name?: string,
  ): ServiceStatus | ServiceStatus[] | undefined {
    if (name) {
      return this.services.get(name);
    }
    return Array.from(this.services.values());
  }

  public getErrorLog(): typeof this.errorLog {
    return [...this.errorLog];
  }

  public getHealthReport() {
    const services = Array.from(this.services.values());
    const recentErrors = this.errorLog.filter(
      (error) => Date.now() - error.timestamp < 5 * 60 * 1000, // Last 5 minutes
    );

    return {
      timestamp: Date.now(),
      services: services.map((service) => ({
        name: service.name,
        status: service.status,
        loadTime: service.loadTime,
        error: service.error,
        healthy: service.status === "loaded",
      })),
      recentErrors: recentErrors.length,
      totalErrors: this.errorLog.length,
      overallHealth: services.every((s) => s.status === "loaded")
        ? "good"
        : services.some((s) => s.status === "loaded")
          ? "partial"
          : "poor",
    };
  }

  public clearErrorLog() {
    this.errorLog = [];
  }

  // Method to manually report service issues
  public reportServiceIssue(serviceName: string, error: string) {
    const service = this.services.get(serviceName);
    if (service) {
      service.status = "failed";
      service.error = error;
      service.lastChecked = Date.now();
    }
    this.logError(error, `manual.${serviceName}`);
  }
}

// Create singleton instance
const debugMonitor = new DebugMonitor();

// Export functions for external use
export const getServiceStatus = (name?: string) =>
  debugMonitor.getServiceStatus(name);
export const getErrorLog = () => debugMonitor.getErrorLog();
export const getHealthReport = () => debugMonitor.getHealthReport();
export const clearErrorLog = () => debugMonitor.clearErrorLog();
export const reportServiceIssue = (serviceName: string, error: string) =>
  debugMonitor.reportServiceIssue(serviceName, error);

// Development-only global access
if (process.env.NODE_ENV === "development") {
  (window as any).debugMonitor = {
    getServiceStatus,
    getErrorLog,
    getHealthReport,
    clearErrorLog,
    reportServiceIssue,
  };
}

export default debugMonitor;
