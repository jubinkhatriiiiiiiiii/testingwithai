import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage, type ChatData } from "../utils/emailService";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [chatData, setChatData] = useState<Partial<ChatData>>({
    message: "",
    urgent: false,
    helpType: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    "greeting",
    "message",
    "urgency",
    "details",
    "helpType",
    "submit",
  ];

  const handleStart = () => {
    setStep(1);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (
      !chatData.name ||
      !chatData.email ||
      !chatData.phone ||
      !chatData.message
    ) {
      return;
    }

    setIsSubmitting(true);
    const success = await sendChatMessage(chatData as ChatData);

    if (success) {
      // Reset and show success
      setChatData({
        message: "",
        urgent: false,
        helpType: "",
        name: "",
        email: "",
        phone: "",
      });
      setStep(0);
      alert("Message sent successfully! We'll get back to you soon.");
      setIsOpen(false);
    } else {
      alert("Failed to send message. Please try again.");
    }
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (steps[step]) {
      case "greeting":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">
                Hi! Need help finding study material? 👋
              </p>
            </div>
            <button
              onClick={handleStart}
              className="w-full btn-primary text-sm py-2"
            >
              Yes, I need help
            </button>
          </div>
        );

      case "message":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">What can I help you with today?</p>
            </div>
            <textarea
              value={chatData.message}
              onChange={(e) =>
                setChatData({ ...chatData, message: e.target.value })
              }
              placeholder="Describe what you're looking for..."
              className="w-full p-2 border rounded-lg text-sm resize-none"
              rows={3}
            />
            <button
              onClick={handleNext}
              disabled={!chatData.message?.trim()}
              className="w-full btn-primary text-sm py-2 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        );

      case "urgency":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">Is this urgent?</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setChatData({ ...chatData, urgent: true });
                  handleNext();
                }}
                className="btn-primary text-sm py-2"
              >
                Yes, urgent
              </button>
              <button
                onClick={() => {
                  setChatData({ ...chatData, urgent: false });
                  handleNext();
                }}
                className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/5"
              >
                No, not urgent
              </button>
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">Please provide your contact details:</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={chatData.name}
                onChange={(e) =>
                  setChatData({ ...chatData, name: e.target.value })
                }
                placeholder="Your name"
                className="w-full p-2 border rounded-lg text-sm"
              />
              <input
                type="email"
                value={chatData.email}
                onChange={(e) =>
                  setChatData({ ...chatData, email: e.target.value })
                }
                placeholder="Your email"
                className="w-full p-2 border rounded-lg text-sm"
              />
              <input
                type="tel"
                value={chatData.phone}
                onChange={(e) =>
                  setChatData({ ...chatData, phone: e.target.value })
                }
                placeholder="Your phone number"
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <button
              onClick={handleNext}
              disabled={!chatData.name || !chatData.email || !chatData.phone}
              className="w-full btn-primary text-sm py-2 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        );

      case "helpType":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">What type of help do you need?</p>
            </div>
            <div className="space-y-2">
              {[
                "Finding specific study materials",
                "Technical support",
                "Request new resources",
                "General inquiry",
                "Other",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setChatData({ ...chatData, helpType: type });
                    handleNext();
                  }}
                  className="w-full text-left p-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );

      case "submit":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-sm">Ready to send your message?</p>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Message:</strong> {chatData.message}
              </p>
              <p>
                <strong>Urgent:</strong> {chatData.urgent ? "Yes" : "No"}
              </p>
              <p>
                <strong>Help Type:</strong> {chatData.helpType}
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full btn-primary text-sm py-2 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-16 sm:bottom-20 right-2 sm:right-4 w-80 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border z-50"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium text-primary">AdrosNotes Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
              {renderStep()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-2 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </motion.button>
    </>
  );
};

export default ChatBot;
