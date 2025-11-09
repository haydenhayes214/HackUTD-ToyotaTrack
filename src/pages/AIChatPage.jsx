import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "../components/chat/MessageBubble";

const API_BASE = 'http://localhost:3001/api';

// Hardcoded vehicles for client-side chatbot
const HARDCODED_VEHICLES = [
  { make: "Toyota", model: "Camry LE Hybrid", price: 30000, mpg: 52, type: "Sedan", fuelType: "Hybrid", horsepower: 208 },
  { make: "Toyota", model: "Camry XSE", price: 35000, mpg: 32, type: "Sedan", fuelType: "Gasoline", horsepower: 301 },
  { make: "Toyota", model: "RAV4 XLE Hybrid", price: 36000, mpg: 40, type: "SUV", fuelType: "Hybrid", horsepower: 219 },
  { make: "Toyota", model: "RAV4 Prime XSE", price: 45000, mpg: 94, type: "SUV", fuelType: "Plug-in Hybrid", horsepower: 302 },
  { make: "Toyota", model: "Corolla SE Hybrid", price: 24000, mpg: 53, type: "Sedan", fuelType: "Hybrid", horsepower: 121 },
  { make: "Toyota", model: "Tundra SR5", price: 42000, mpg: 20, type: "Truck", fuelType: "Gasoline", horsepower: 389 },
];

// Simple client-side chatbot logic
function generateClientResponse(message, vehicles = HARDCODED_VEHICLES) {
  const msg = message.toLowerCase();
  
  // Greetings
  if (/hello|hi|hey|greetings/i.test(msg)) {
    return "Hello! I'm Toyota Sensei, your AI assistant. I can help you find vehicles, compare models, and answer questions about financing. What would you like to know?";
  }
  
  // Help
  if (/help|what can you do|what do you do/i.test(msg)) {
    return "I can help you with:\n\n• Finding vehicles (e.g., 'show me hybrid SUVs')\n• Comparing vehicles (e.g., 'compare Camry vs RAV4')\n• Financing questions (e.g., 'tell me about financing options')\n• Vehicle specifications and features\n\nWhat would you like to know?";
  }
  
  // Search for vehicles
  if (/show|find|search|look for|hybrid|suv|sedan|truck|under|\$/i.test(msg)) {
    let filtered = [...vehicles];
    
    if (/hybrid/i.test(msg)) {
      filtered = filtered.filter(v => v.fuelType.toLowerCase().includes('hybrid'));
    }
    if (/suv/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'SUV');
    }
    if (/sedan/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'Sedan');
    }
    if (/truck/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'Truck');
    }
    if (/under.*\$?(\d+)/i.test(msg)) {
      const match = msg.match(/under.*\$?(\d+)/i);
      const maxPrice = parseInt(match[1]) * 1000;
      filtered = filtered.filter(v => v.price <= maxPrice);
    }
    
    if (filtered.length === 0) {
      return "I couldn't find any vehicles matching your criteria. Try asking for 'hybrid SUVs', 'sedans under $30,000', or 'all vehicles'.";
    }
    
    const vehicleList = filtered.map(v => 
      `**${v.model}** - $${v.price.toLocaleString()} (${v.mpg} MPG, ${v.fuelType}, ${v.horsepower} HP)`
    ).join('\n');
    
    return `I found ${filtered.length} vehicle(s) matching your search:\n\n${vehicleList}\n\nWould you like more details about any of these?`;
  }
  
  // Comparisons
  if (/compare|vs|versus/i.test(msg)) {
    return "I can help you compare vehicles! Here are some options:\n\n• **Camry LE Hybrid** vs **Camry XSE** - Hybrid efficiency vs V6 power\n• **RAV4 XLE Hybrid** vs **RAV4 Prime** - Standard hybrid vs plug-in hybrid\n• **Corolla SE Hybrid** vs **Camry LE Hybrid** - Compact vs midsize\n\nWhich comparison interests you?";
  }
  
  // Financing
  if (/finance|financing|payment|apr|interest|lease|loan/i.test(msg)) {
    return "**Toyota Financing Options:**\n\n• **APR Range**: 2.9% to 7.9% (depending on credit score)\n• **Lease Terms**: 24-48 months with lower monthly payments\n• **Loan Terms**: 36-72 months available\n• **Down Payment**: Flexible options starting from $0\n\nWould you like to calculate payments for a specific vehicle?";
  }
  
  // Specific vehicle questions
  const vehicleMatches = vehicles.filter(v => 
    msg.includes(v.model.toLowerCase().split(' ')[0]) || 
    msg.includes(v.model.toLowerCase())
  );
  
  if (vehicleMatches.length > 0) {
    const vehicle = vehicleMatches[0];
    return `**${vehicle.model}**\n\n• **Price**: $${vehicle.price.toLocaleString()}\n• **MPG**: ${vehicle.mpg} combined\n• **Type**: ${vehicle.type}\n• **Fuel Type**: ${vehicle.fuelType}\n• **Horsepower**: ${vehicle.horsepower} HP\n\nWould you like to know about financing options for this vehicle?`;
  }
  
  // Default response
  return "I'm here to help! You can ask me about:\n\n• Finding vehicles (e.g., 'show me hybrid SUVs')\n• Comparing models (e.g., 'compare Camry vs RAV4')\n• Financing information (e.g., 'tell me about financing')\n• Vehicle specifications\n\nWhat would you like to know?";
}

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

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Try to use server first, fallback to client-side if it fails
      try {
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
        });

        if (response.ok) {
          const data = await response.json();
          
          if (!data.error) {
            const assistantMessage = {
              role: "assistant",
              content: data.response || "I'm sorry, I couldn't process that request.",
              tool_calls: data.tool_calls || [],
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
            return;
          }
        }
      } catch (serverError) {
        // Server not available, use client-side fallback
        console.log("Server not available, using client-side chatbot");
      }

      // Client-side fallback
      const response = generateClientResponse(userMessage);
      const assistantMessage = {
        role: "assistant",
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
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

