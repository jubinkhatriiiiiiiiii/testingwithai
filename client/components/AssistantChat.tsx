import React, { useState, useEffect, useRef } from "react";

const AssistantChat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    // Always update the UI with the user's message immediately
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Use absolute URL for Netlify deployment
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/assistant' 
        : '/api/assistant';
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Even if there's an error, we still want to show the user's message
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="flex flex-col h-full min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-body p-6">
      <header className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-bold text-xl select-none">
          EV
        </div>
        <div>
          <h1 className="text-2xl font-heading font-semibold">EduVault AI Assistant</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Created by Jubin Khatri • eduvaults.xyz</p>
        </div>
      </header>
      <section className="flex-1 overflow-y-auto p-4 bg-[hsl(var(--card))] rounded-lg shadow-md space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-4 rounded-lg leading-relaxed text-base whitespace-pre-wrap ${
              msg.role === "user"
                ? "self-end bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm shadow-md"
                : "self-start bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-bl-sm shadow"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>
      <footer className="mt-6">
        <textarea
          className="w-full resize-none rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] px-4 py-3 text-base leading-relaxed"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          disabled={isLoading}
        />
        <button
          className="mt-3 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary-dark))] transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={isLoading}
          aria-label="Send message"
        >
          Send
        </button>
      </footer>
    </main>
  );
};

export default AssistantChat;
