import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, TrendingUp, Shield, Zap, Calculator, BarChart3, Sliders, MessageSquare, Play } from "lucide-react";
import { motion } from "framer-motion";
import FeatureCard from "../components/home/FeatureCard";
import FintechTile from "../components/home/FintechTile";

export default function HomePage() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section with Hilux GR Sport Background Image */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full bg-[#1C1C1C]">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://www.toyotaofclermont.com/blogs/6088/wp-content/uploads/2024/10/Highlander_Nightshade_3_0B4F37EC988973992C09F1570A42A9FC39F274C9.jpg)',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />
          </div>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center" style={{ paddingTop: '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Main Tagline */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              Drive Smarter.<br />
              <span className="text-[#EB0A1E]">Live Better.</span>
            </h1>
            {/* Subtext */}
            <p className="text-xl md:text-2xl text-white/90 mb-16 font-light max-w-3xl mx-auto leading-relaxed">
              Your journey to the perfect Toyota — personalized, transparent, effortless.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Link to={createPageUrl("Finance")}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-[#EB0A1E] text-white font-semibold text-lg rounded-full w-full sm:w-auto hover:shadow-[0_0_30px_rgba(235,10,30,0.6)] transition-all duration-300"
                >
                  Explore Financing
                </motion.button>
              </Link>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
                className="px-12 py-5 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-full w-full sm:w-auto backdrop-blur-sm hover:text-[#1C1C1C] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Chat with Toyota AI
              </motion.button>
            </div>
            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/60 text-sm"
            >
              <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto mb-2 flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-white/60 rounded-full" />
              </div>
              <p>Scroll to explore</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative bg-gradient-to-b from-[#f5f5f5] to-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1C] mb-6">
              Finance Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent tools that work for you, not against you
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Calculator}
              title="Real-Time Payment Calculator"
              description="See your monthly payment update instantly as you adjust down payment, APR, and loan term."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Budget Protection"
              description="AI-powered guidance ensures your financing plan stays within healthy spending limits."
              delay={0.1}
            />
            <FeatureCard
              icon={Zap}
              title="Instant Comparisons"
              description="Compare vehicles, trims, and financing options side-by-side with transparent data."
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* AI Chat Experience Section */}
      <div className="relative bg-[#1C1C1C] py-32 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-[#EB0A1E]/20 border border-[#EB0A1E]/30 rounded-full mb-6">
                <span className="text-[#EB0A1E] font-semibold text-sm">POWERED BY AI</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Meet Toyota AI
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Your personal automotive finance specialist. Ask questions, compare vehicles, 
                calculate payments — all through natural conversation. Professional guidance 
                that understands both cars and budgets.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
                className="px-8 py-4 bg-white text-[#1C1C1C] font-semibold rounded-full hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                Try the Demo
                <Play className="w-5 h-5" />
              </motion.button>
            </motion.div>
            {/* Right: Chat Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                  <div className="w-12 h-12 bg-[#EB0A1E] rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C]">Toyota AI</h4>
                    <p className="text-sm text-gray-500">Finance Specialist</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[#EB0A1E] text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-xs">
                      <p className="text-sm">Show me hybrid SUVs under $400/month</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-[#1C1C1C] rounded-2xl rounded-tl-sm px-5 py-3 max-w-sm">
                      <p className="text-sm mb-2">
                        <strong>Great choice!</strong> The RAV4 Hybrid fits perfectly:
                      </p>
                      <div className="bg-white rounded-xl p-3 mb-2">
                        <p className="text-xs text-gray-600 mb-1">Estimated Payment</p>
                        <p className="text-2xl font-bold text-[#EB0A1E]">$385/mo</p>
                        <p className="text-xs text-gray-500">0% APR • 36 months • $3,000 down</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        • 41 MPG city • Seats 5 • AWD
                      </p>
                      <p className="text-sm mt-2">
                        Would you like to see the full breakdown or compare with the Highlander Hybrid?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating indicator */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-[#EB0A1E] rounded-full p-4 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fintech Innovation Grid */}
      <div className="relative bg-gradient-to-b from-white to-[#f5f5f5] py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#1C1C1C] mb-6">
              Smart Financial Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Innovation meets transparency in every calculation
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            <FintechTile
              icon={BarChart3}
              title="Payment Breakdown"
              description="Visual pie charts showing principal vs interest"
              delay={0}
            />
            <FintechTile
              icon={Sliders}
              title="Budget Optimizer"
              description="Interactive sliders to find your perfect plan"
              delay={0.1}
            />
            <FintechTile
              icon={Calculator}
              title="Toyota Wallet"
              description="Track all configurations in one place"
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative bg-[#EB0A1E] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to find your perfect Toyota?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Start with a conversation or explore our tools
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openChat'))}
                className="px-10 py-4 bg-white text-[#EB0A1E] font-semibold rounded-full hover:bg-gray-100 transition-all w-full sm:w-auto"
              >
                Start Chatting
              </motion.button>
              <Link to={createPageUrl("Vehicles")}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-10 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#EB0A1E] transition-all w-full sm:w-auto"
                >
                  Browse Vehicles
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
