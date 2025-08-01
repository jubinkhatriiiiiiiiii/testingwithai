import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";
import ErrorBoundary from "./components/ErrorBoundary";
import FallbackChat from "./components/FallbackChat";
import { initPWA } from "./utils/pwaUtils";
import debugMonitor from "./utils/debugUtils";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import Viewer from "./pages/Viewer";
import Favorites from "./pages/Favorites";
import Recent from "./pages/Recent";
import RequestResource from "./pages/RequestResource";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Assistant from "./pages/Assistant";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize PWA features
    initPWA();

    // Initialize debug monitoring (development only)
    if (process.env.NODE_ENV === "development") {
      console.log("Debug monitor initialized");
      console.log("Use window.debugMonitor to access debug information");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <OfflineIndicator />
      <main className="pb-8">{children}</main>
      <PWAInstallPrompt />
      <FallbackChat />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/viewer/:id" element={<Viewer />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/request" element={<RequestResource />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
