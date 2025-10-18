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
  const lastImageRef = useRef<string | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send automatic message when new image is analyzed
  useEffect(() => {
    if (analysisResult && imageBase64 && imageBase64 !== lastImageRef.current) {
      lastImageRef.current = imageBase64;
      
      // Skip automatic message if image quality is poor
      const isPoorQuality = analysisResult.likely_categories.includes("poor_image_quality");
      if (isPoorQuality) {
        console.log("Skipping chat notification - poor image quality");
        return;
      }
      
      const contextMessage: Message = {
        id: `analysis-context-${Date.now()}`,
        role: "assistant",
        content: `📸 I can see your image and have analyzed it. Feel free to ask me any questions about what you see in the results!`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, contextMessage]);
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
      // Prepare images to send
      const imagesToSend = uploadedImages.length > 0 ? uploadedImages : (imageBase64 ? [imageBase64] : []);

      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input.trim(),
          imageBase64: imageBase64,
          analysisContext: analysisResult,
          additionalImages: imagesToSend,
          conversationHistory: conversationHistory,
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

  function handleChatFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Please upload an image file (JPEG, PNG, etc.)",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1];
      
      setUploadedImages((prev) => [...prev, base64Data]);
      
      const confirmMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "📎 Image uploaded! I can now reference this additional image in our conversation.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    };
    reader.onerror = () => {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Failed to read the image file. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (event.target) {
      event.target.value = '';
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
        <button
          className="chat-attach-btn"
          onClick={() => chatFileInputRef.current?.click()}
          disabled={loading}
          title="Upload additional image"
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input
          ref={chatFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChatFileUpload}
          style={{ display: 'none' }}
        />
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

      {uploadedImages.length > 0 && (
        <div className="uploaded-images-indicator">
          📷 {uploadedImages.length} additional image{uploadedImages.length > 1 ? 's' : ''} attached
          <button 
            className="clear-images-btn"
            onClick={() => setUploadedImages([])}
          >
            ✕
          </button>
        </div>
      )}

      <div className="chat-disclaimer">
        ⚠️ Not medical advice. Consult a dermatologist for concerns.
      </div>
    </div>
  );
}
