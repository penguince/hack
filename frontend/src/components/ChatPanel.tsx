import { useState, useRef, useEffect } from "react";
import type { AnalyzeResponse } from "../lib/types";
import "../styles/ChatPanel.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  analysisResult: AnalyzeResponse | null;
  imageBase64: string | null;
}

export default function ChatPanel({ analysisResult, imageBase64 }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm here to answer your skin care questions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update welcome message when analysis is available
  useEffect(() => {
    if (analysisResult && imageBase64) {
      const contextMessage: Message = {
        id: "analysis-context",
        role: "assistant",
        content: `I can see you've taken an image! The analysis shows: ${analysisResult.summary}. Feel free to ask me any questions about this image or general skin care advice.`,
        timestamp: new Date(),
      };
      setMessages((prev) => {
        // Check if we already added the context message
        if (prev.some(msg => msg.id === "analysis-context")) {
          return prev;
        }
        return [...prev, contextMessage];
      });
    }
  }, [analysisResult, imageBase64]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input.trim(),
          imageBase64: imageBase64,
          analysisContext: analysisResult,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>💬 Skin Care Assistant</h2>
        <p className="chat-subtitle">
          {analysisResult && imageBase64 
            ? "Ask me about your analyzed image" 
            : "Ask me anything about skin care"}
        </p>
        {analysisResult && imageBase64 && (
          <div className="image-context-badge">
            📸 Image analyzed
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about skin care, treatments, or concerns..."
          rows={2}
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      <div className="chat-disclaimer">
        ⚠️ Not medical advice. Consult a dermatologist for concerns.
      </div>
    </div>
  );
}
