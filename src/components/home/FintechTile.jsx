import React from "react";
import { motion } from "framer-motion";

export default function FintechTile({ icon: Icon, title, description, delay = 0, animated = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className={`w-14 h-14 bg-gradient-to-br from-[#EB0A1E]/10 to-[#EB0A1E]/5 rounded-xl flex items-center justify-center mb-4 ${
        animated ? 'animate-pulse' : ''
      }`}>
        <Icon className="w-7 h-7 text-[#EB0A1E]" />
      </div>
      <h4 className="text-lg font-bold text-[#1C1C1C] mb-2">
        {title}
      </h4>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </motion.div>
  );
}

