import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="relative group"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
        {/* Gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EB0A1E]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className="relative z-10 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#EB0A1E] to-[#d60916] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_rgba(235,10,30,0.4)] transition-all duration-500">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-3 group-hover:text-[#EB0A1E] transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        {/* Arrow indicator on hover */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <svg className="w-6 h-6 text-[#EB0A1E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

