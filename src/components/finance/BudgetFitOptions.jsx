import React from "react";
import { TrendingDown, DollarSign, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetFitOptions({ vehiclePrice, onSelectPlan }) {
  const plans = [
    {
      name: "Cheapest Monthly",
      icon: TrendingDown,
      downPayment: vehiclePrice * 0.1,
      apr: 5.9,
      termMonths: 84,
      description: "Lowest monthly payment, longer term",
      color: "bg-blue-500",
    },
    {
      name: "Lowest Total Cost",
      icon: DollarSign,
      downPayment: vehiclePrice * 0.25,
      apr: 3.9,
      termMonths: 48,
      description: "Save on interest, pay less overall",
      color: "bg-green-500",
    },
    {
      name: "Minimal Upfront",
      icon: Zap,
      downPayment: vehiclePrice * 0.05,
      apr: 6.9,
      termMonths: 60,
      description: "Low down payment, balanced approach",
      color: "bg-purple-500",
    },
  ];

  const calculateMonthly = (plan) => {
    const principal = vehiclePrice - plan.downPayment;
    const monthlyRate = plan.apr / 100 / 12;
    if (monthlyRate === 0) {
      return principal / plan.termMonths;
    }
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, plan.termMonths)) /
      (Math.pow(1 + monthlyRate, plan.termMonths) - 1);
    return payment;
  };

  return (
    <div className="neumorphic p-8">
      <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
        One-Click Budget Fit
      </h2>
      <p className="text-gray-600 mb-6">
        Choose a pre-configured plan that matches your priorities
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const monthlyPayment = calculateMonthly(plan);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => onSelectPlan(plan)}
                className="neumorphic-button w-full p-6 text-left hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] transition-all group"
              >
                <div className={`inline-block p-3 rounded-xl ${plan.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-semibold text-[#1C1C1C]">
                      ${plan.downPayment.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">APR:</span>
                    <span className="font-semibold text-[#1C1C1C]">
                      {plan.apr}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-semibold text-[#1C1C1C]">
                      {plan.termMonths} months
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-300">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly:</span>
                      <span className="text-xl font-bold text-[#EB0A1E]">
                        ${monthlyPayment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

