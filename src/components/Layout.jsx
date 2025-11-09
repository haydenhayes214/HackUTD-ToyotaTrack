import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Car, Calculator, MessageCircle, FolderHeart, BookOpen, X, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./chat/MessageBubble";

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
  
  if (/hello|hi|hey|greetings/i.test(msg)) {
    return "Hello! I'm Toyota Sensei, your AI assistant. I can help you find vehicles, compare models, and answer questions about financing. What would you like to know?";
  }
  
  if (/help|what can you do|what do you do/i.test(msg)) {
    return "I can help you with:\n\n• Finding vehicles (e.g., 'show me hybrid SUVs')\n• Comparing vehicles (e.g., 'compare Camry vs RAV4')\n• Financing questions (e.g., 'tell me about financing options')\n• Vehicle specifications and features\n\nWhat would you like to know?";
  }
  
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
  
  if (/compare|vs|versus/i.test(msg)) {
    return "I can help you compare vehicles! Here are some options:\n\n• **Camry LE Hybrid** vs **Camry XSE** - Hybrid efficiency vs V6 power\n• **RAV4 XLE Hybrid** vs **RAV4 Prime** - Standard hybrid vs plug-in hybrid\n• **Corolla SE Hybrid** vs **Camry LE Hybrid** - Compact vs midsize\n\nWhich comparison interests you?";
  }
  
  if (/finance|financing|payment|apr|interest|lease|loan/i.test(msg)) {
    return "**Toyota Financing Options:**\n\n• **APR Range**: 2.9% to 7.9% (depending on credit score)\n• **Lease Terms**: 24-48 months with lower monthly payments\n• **Loan Terms**: 36-72 months available\n• **Down Payment**: Flexible options starting from $0\n\nWould you like to calculate payments for a specific vehicle?";
  }
  
  const vehicleMatches = vehicles.filter(v => 
    msg.includes(v.model.toLowerCase().split(' ')[0]) || 
    msg.includes(v.model.toLowerCase())
  );
  
  if (vehicleMatches.length > 0) {
    const vehicle = vehicleMatches[0];
    return `**${vehicle.model}**\n\n• **Price**: $${vehicle.price.toLocaleString()}\n• **MPG**: ${vehicle.mpg} combined\n• **Type**: ${vehicle.type}\n• **Fuel Type**: ${vehicle.fuelType}\n• **Horsepower**: ${vehicle.horsepower} HP\n\nWould you like to know about financing options for this vehicle?`;
  }
  
  return "I'm here to help! You can ask me about:\n\n• Finding vehicles (e.g., 'show me hybrid SUVs')\n• Comparing models (e.g., 'compare Camry vs RAV4')\n• Financing information (e.g., 'tell me about financing')\n• Vehicle specifications\n\nWhat would you like to know?";
}

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Vehicles", path: createPageUrl("Vehicles"), icon: Car },
    { name: "Finance", path: createPageUrl("Finance"), icon: Calculator },
    { name: "Learn", path: createPageUrl("FinancialLiteracy"), icon: BookOpen },
    { name: "My Garage", path: createPageUrl("MyGarage"), icon: FolderHeart },
  ];

  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Listen for custom event to open chat from other components
  useEffect(() => {
    const handleOpenChat = () => {
      setShowChat(true);
    };
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    const newUserMessage = {
      role: "user",
      content: userMessage,
    };

    // Update messages and clear input immediately
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentMessages = [...chatMessages, newUserMessage];
    setChatInput("");
    setChatLoading(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Build conversation history from current messages (excluding the one we just added)
      const conversationHistory = chatMessages.map(msg => ({
        from: msg.role === "user" ? "user" : "bot",
        text: msg.content,
      }));

      // Try server with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: conversationHistory,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          if (!data.error) {
            const assistantMessage = {
              role: "assistant",
              content: data.response || "I'm sorry, I couldn't process that request.",
            };
            setChatMessages(prev => [...prev, assistantMessage]);
            setChatLoading(false);
            return;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.log("Request timeout, using client-side chatbot");
        } else {
          console.log("Server not available, using client-side chatbot");
        }
      }

      // Client-side fallback
      const response = generateClientResponse(userMessage);
      const assistantMessage = {
        role: "assistant",
        content: response,
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!chatLoading && chatInput.trim()) {
        handleChatSend();
      }
      return false;
    }
  };

  const isHomePage = location.pathname === createPageUrl("Home");

  return (
    <div className="min-h-screen bg-[#e0e0e0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        }
        
        .neumorphic {
          background: #e0e0e0;
          box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
          border-radius: 20px;
        }
        
        .neumorphic-inset {
          background: #e0e0e0;
          box-shadow: inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff;
          border-radius: 20px;
        }
        
        .neumorphic-button {
          background: #e0e0e0;
          box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .neumorphic-button:hover {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
        }
        
        .neumorphic-button:active {
          box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
        }
        
        .toyota-red-button {
          background: linear-gradient(145deg, #ff1127, #d60916);
          box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .toyota-red-button:hover {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff, 0 0 20px rgba(235, 10, 30, 0.3);
          transform: translateY(-1px);
        }
        
        .toyota-red-button:active {
          box-shadow: inset 4px 4px 8px #c00812, inset -4px -4px 8px #ff1c2e;
          transform: translateY(0);
        }
        .glassmorphic {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glassmorphic:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(235, 10, 30, 0.5); }
          50% { box-shadow: 0 0 40px rgba(235, 10, 30, 0.8); }
        }
      `}</style>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHomePage
            ? 'bg-[#e0e0e0] shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691014dbc031a1b0c767643d/c9b339dbc_image.png"
                alt="Toyota Logo"
                className="h-10 w-auto"
              />
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${scrolled || !isHomePage ? 'text-[#1C1C1C]' : 'text-white'}`}>TOYOTA</span>
                <span className="text-lg font-bold text-[#EB0A1E]">AI</span>
              </div>
            </Link>

            {/* Nav Items - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                      isActive && (scrolled || !isHomePage)
                        ? "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-[#EB0A1E]"
                        : isActive && isHomePage && !scrolled
                        ? "bg-white/20 backdrop-blur-md text-white"
                        : scrolled || !isHomePage
                        ? "neumorphic-button text-[#1C1C1C] hover:text-[#EB0A1E]"
                        : "text-white/90 hover:bg-white/10 backdrop-blur-md"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
              {/* AI Chat Button */}
              <button
                onClick={() => setShowChat(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                  scrolled || !isHomePage
                    ? "neumorphic-button text-[#1C1C1C] hover:text-[#EB0A1E]"
                    : "text-white/90 hover:bg-white/10 backdrop-blur-md"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">AI Chat</span>
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden mt-4 gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                    isActive && (scrolled || !isHomePage)
                      ? "shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff] text-[#EB0A1E]"
                      : isActive && isHomePage && !scrolled
                      ? "bg-white/20 backdrop-blur-md text-white"
                      : scrolled || !isHomePage
                      ? "neumorphic-button text-[#1C1C1C]"
                      : "text-white/90 bg-white/10 backdrop-blur-md"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
            {/* AI Chat Button - Mobile */}
            <button
              onClick={() => setShowChat(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                scrolled || !isHomePage
                  ? "neumorphic-button text-[#1C1C1C]"
                  : "text-white/90 bg-white/10 backdrop-blur-md"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">AI Chat</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-6 right-6 w-full max-w-md h-[600px] neumorphic z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EB0A1E] rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1C1C]">Toyota Sensei</h3>
                    <p className="text-xs text-gray-600">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-[#1C1C1C]" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {chatMessages.length === 0 ? (
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
                        <p className="text-gray-600 text-sm">
                          Ask me anything about vehicles, financing, or comparisons
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <MessageBubble key={index} message={message} />
                    ))
                  )}
                </AnimatePresence>
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="neumorphic-inset p-3 rounded-2xl">
                      <Loader2 className="w-5 h-5 text-[#EB0A1E] animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="neumorphic-inset p-4 border-t border-gray-300">
                <div className="flex items-end gap-3">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyPress}
                    placeholder="Ask about vehicles, financing, or comparisons..."
                    className="flex-1 bg-transparent resize-none outline-none text-[#1C1C1C] placeholder-gray-500 max-h-32 text-sm"
                    rows={1}
                    disabled={chatLoading}
                  />
                  <button
                    type="button"
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || chatLoading}
                    className={`p-3 rounded-xl transition-all ${
                      chatInput.trim() && !chatLoading
                        ? "toyota-red-button text-white"
                        : "neumorphic-button text-gray-400"
                    }`}
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

