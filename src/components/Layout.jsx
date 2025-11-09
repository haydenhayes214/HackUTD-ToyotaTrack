import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Car, Calculator, MessageCircle, FolderHeart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
    { name: "AI Chat", path: createPageUrl("AIChat"), icon: MessageCircle },
    { name: "My Garage", path: createPageUrl("MyGarage"), icon: FolderHeart },
  ];

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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

