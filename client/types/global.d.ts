// Global type declarations

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      onError?: () => void;
      toggle?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      setAttributes?: (
        attributes: Record<string, any>,
        callback?: () => void,
      ) => void;
      addEvent?: (
        event: string,
        metadata?: Record<string, any>,
        callback?: () => void,
      ) => void;
      removeEvent?: (event: string) => void;
      addTags?: (tags: string[], callback?: () => void) => void;
      removeTags?: (tags: string[], callback?: () => void) => void;
      setOnlineStatus?: (status: boolean) => void;
      endChat?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

// Extend ErrorEvent for better error handling
interface ExtendedErrorEvent extends ErrorEvent {
  filename?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
}

// Service Worker types
interface ServiceWorkerRegistration {
  update(): Promise<void>;
}

// PWA related types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export {};
