import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "../components/chat/MessageBubble";

const API_BASE = 'http://localhost:3001/api';

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error("AIChatPage error:", error);
      setError(error.message);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    const newUserMessage = {
      role: "user",
      content: userMessage,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the server
      const conversationHistory = messages.map(msg => ({
        from: msg.role === "user" ? "user" : "bot",
        text: msg.content,
      }));

      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      }).catch((fetchError) => {
        // Network error - server not reachable
        throw new Error(`Cannot connect to server. Make sure the backend server is running on http://localhost:3001. Error: ${fetchError.message}`);
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const assistantMessage = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
        tool_calls: data.tool_calls || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "";
      
      if (error.message.includes("fetch")) {
        errorMessage = "❌ Cannot connect to the server. Please ensure:\n\n" +
          "1. The backend server is running on http://localhost:3001\n" +
          "2. You can access it by opening http://localhost:3001/health in your browser\n" +
          "3. There are no firewall or CORS issues\n\n" +
          `Error details: ${error.message}`;
      } else {
        errorMessage = `❌ Error: ${error.message}`;
      }
      
      const errorResponse = {
        role: "assistant",
        content: errorMessage,
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show error state if there's a critical error
  if (error) {
    return (
      <div className="min-h-screen py-8 px-6" style={{ paddingTop: '100px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="neumorphic p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Chat</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-[#EB0A1E] text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 bg-[#e0e0e0]" style={{ paddingTop: '100px' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="neumorphic p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="neumorphic p-4 bg-[#EB0A1E] rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1C]">Toyota Sensei</h1>
              <p className="text-gray-600">
                Your AI financial advisor • Ask about payments, vehicles, or comparisons
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="neumorphic p-6 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <div className="neumorphic p-6 inline-block mb-4">
                      <Sparkles className="w-12 h-12 text-[#EB0A1E]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                      Welcome! I'm Toyota Sensei
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Ask me anything about financing, vehicle comparisons, or payment
                      scenarios
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setInputMessage(
                            "What if I put $4,000 down instead of $2,000?"
                          )
                        }
                        className="neumorphic-button px-4 py-2 text-sm text-[#1C1C1C] block w-full"
                      >
                        "What if I put $4,000 down instead of $2,000?"
                      </button>
                      <button
                        onClick={() =>
                          setInputMessage("Compare the Camry XLE and RAV4")
                        }
                        className="neumorphic-button px-4 py-2 text-sm text-[#1C1C1C] block w-full"
                      >
                        "Compare the Camry XLE and RAV4"
                      </button>
                      <button
                        onClick={() =>
                          setInputMessage("Show me all hybrid models")
                        }
                        className="neumorphic-button px-4 py-2 text-sm text-[#1C1C1C] block w-full"
                      >
                        "Show me all hybrid models"
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-end gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about financing, vehicles, or payment scenarios..."
                className="flex-1 bg-transparent resize-none outline-none text-[#1C1C1C] placeholder-gray-500 max-h-32"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${
                  inputMessage.trim() && !isLoading
                    ? "toyota-red-button text-white"
                    : "neumorphic-button text-gray-400"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 neumorphic p-6">
          <h3 className="font-bold text-[#1C1C1C] mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setInputMessage("Calculate my monthly payment")}
              className="neumorphic-button p-4 text-left text-sm text-[#1C1C1C]"
            >
              💰 Calculate Payment
            </button>
            <button
              onClick={() => setInputMessage("What's my best financing option?")}
              className="neumorphic-button p-4 text-left text-sm text-[#1C1C1C]"
            >
              🎯 Best Financing
            </button>
            <button
              onClick={() => setInputMessage("Compare SUV models")}
              className="neumorphic-button p-4 text-left text-sm text-[#1C1C1C]"
            >
              🔄 Compare Vehicles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

