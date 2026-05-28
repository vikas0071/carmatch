"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, QuizAnswers, RecommendedCar } from "@/lib/types";

interface ChatPanelProps {
  quizAnswers: QuizAnswers;
  recommendedCars: RecommendedCar[];
}

export default function ChatPanel({ quizAnswers, recommendedCars }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context = JSON.stringify({
    quizAnswers,
    recommendedCars: recommendedCars.map((c) => ({
      name: `${c.make} ${c.model} ${c.variant}`,
      price: c.priceLakh,
      matchScore: c.matchScore,
      reason: c.reason,
      fuelType: c.fuelType,
      bodyType: c.bodyType,
      mileage: c.mileageKmpl,
      safety: c.safetyRating,
    })),
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-fab" onClick={() => setIsOpen(true)}>
        💬
        <span className="chat-fab-label">Ask AI</span>
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-title">
          <span className="chat-header-icon">🤖</span>
          <span>CarMatch AI Assistant</span>
        </div>
        <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <p>👋 Hi! I can help you compare cars, understand specs, or answer any questions about your recommendations.</p>
            <div className="chat-suggestions">
              <button onClick={() => setInput("Which car is best for long highway drives?")}>
                Which is best for highway drives?
              </button>
              <button onClick={() => setInput("Compare the safety features of my recommendations")}>
                Compare safety features
              </button>
              <button onClick={() => setInput("What are the running costs for each car?")}>
                Running costs comparison
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-message chat-message-${msg.role}`}>
            <div className="chat-message-content">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message chat-message-assistant">
            <div className="chat-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your recommendations..."
          disabled={isLoading}
        />
        <button
          className="chat-send"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
