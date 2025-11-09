import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Trash2, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function MyGaragePage() {
  const [configurations, setConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = () => {
    try {
      const configs = JSON.parse(localStorage.getItem("financeConfigs") || "[]");
      // Sort by created date (newest first)
      configs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setConfigurations(configs);
    } catch (error) {
      console.error("Error loading configurations:", error);
      setConfigurations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConfiguration = (id) => {
    try {
      const configs = JSON.parse(localStorage.getItem("financeConfigs") || "[]");
      const filtered = configs.filter((config) => config.id !== id);
      localStorage.setItem("financeConfigs", JSON.stringify(filtered));
      setConfigurations(filtered);
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6" style={{ paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1C1C1C] mb-4">
            My Garage
          </h1>
          <p className="text-xl text-gray-600">
            Your saved vehicle configurations and finance plans
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block neumorphic p-8">
              <div className="animate-spin w-12 h-12 border-4 border-[#EB0A1E] border-t-transparent rounded-full" />
            </div>
          </div>
        ) : configurations.length === 0 ? (
          <div className="text-center py-20">
            <div className="neumorphic p-12 inline-block">
              <p className="text-xl text-gray-600 mb-6">
                No saved configurations yet
              </p>
              <Link to={createPageUrl("Vehicles")}>
                <button className="toyota-red-button px-8 py-4 text-white font-semibold">
                  Browse Vehicles
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {configurations.map((config, index) => (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="neumorphic p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                      {config.configurationName || config.vehicleModel || "My Configuration"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(config.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="neumorphic-inset p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-[#EB0A1E]" />
                        <span className="text-xs text-gray-600">
                          Monthly Payment
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#1C1C1C]">
                        ${config.monthlyPayment?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Vehicle Price:</span>
                        <p className="font-semibold text-[#1C1C1C]">
                          ${config.vehiclePrice?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Down Payment:</span>
                        <p className="font-semibold text-[#1C1C1C]">
                          ${config.downPayment?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">APR:</span>
                        <p className="font-semibold text-[#1C1C1C]">
                          {config.apr || "0"}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Term:</span>
                        <p className="font-semibold text-[#1C1C1C]">
                          {config.termMonths || "0"} months
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`${createPageUrl("Finance")}?price=${
                        config.vehiclePrice
                      }&model=${encodeURIComponent(config.vehicleModel || "Toyota Vehicle")}&vehicleId=${config.vehicleId || ""}`}
                      className="flex-1"
                    >
                      <button className="neumorphic-button w-full py-3 text-[#1C1C1C] font-semibold flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteConfiguration(config.id)}
                      className="neumorphic-button px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
