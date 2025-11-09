import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TrendingDown, DollarSign, Calendar, Save } from "lucide-react";
import { motion } from "framer-motion";
import FinanceCalculator from "../components/finance/FinanceCalculator";
import BudgetFitOptions from "../components/finance/BudgetFitOptions";
import ResponsibleCoach from "../components/finance/ResponsibleCoach";

export default function FinancePage() {
  const [searchParams] = useSearchParams();
  const initialPrice = parseFloat(searchParams.get("price")) || 35000;
  const vehicleModel = searchParams.get("model") || "Toyota Vehicle";
  const vehicleId = searchParams.get("vehicleId");

  const [vehiclePrice, setVehiclePrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(5000);
  const [apr, setApr] = useState(4.9);
  const [termMonths, setTermMonths] = useState(60);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  useEffect(() => {
    if (initialPrice) {
      setVehiclePrice(initialPrice);
      setDownPayment(Math.min(5000, initialPrice * 0.1));
    }
  }, [initialPrice]);

  const calculateMonthlyPayment = () => {
    const principal = vehiclePrice - downPayment - tradeInValue;
    if (principal <= 0) return 0;
    const monthlyRate = apr / 100 / 12;
    if (monthlyRate === 0) {
      return principal / termMonths;
    }
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    return payment;
  };

  const calculateTotalCost = () => {
    const monthlyPayment = calculateMonthlyPayment();
    return monthlyPayment * termMonths + downPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalCost = calculateTotalCost();
  const totalInterest = totalCost - vehiclePrice + tradeInValue;

  const handleSaveConfiguration = () => {
    // Save to localStorage for now (can be expanded to API later)
    const configs = JSON.parse(localStorage.getItem("financeConfigs") || "[]");
    const newConfig = {
      id: Date.now(),
      vehicleId: vehicleId,
      vehicleModel: vehicleModel,
      vehiclePrice: vehiclePrice,
      downPayment: downPayment,
      apr: apr,
      termMonths: termMonths,
      monthlyPayment: monthlyPayment,
      totalCost: totalCost,
      tradeInValue: tradeInValue,
      configurationName: `${vehicleModel} - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
    };
    configs.push(newConfig);
    localStorage.setItem("financeConfigs", JSON.stringify(configs));
    alert("Configuration saved to My Garage!");
  };

  // Budget health check
  const paymentToIncomeRatio =
    monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;
  const isRisky = paymentToIncomeRatio > 15;

  return (
    <div className="min-h-screen py-12 px-6" style={{ paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1C1C1C] mb-4">
            Finance Your {vehicleModel}
          </h1>
          <p className="text-xl text-gray-600">
            Transparent tools • Real-time calculations • Smart guidance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-2 space-y-8">
            <FinanceCalculator
              vehiclePrice={vehiclePrice}
              setVehiclePrice={setVehiclePrice}
              downPayment={downPayment}
              setDownPayment={setDownPayment}
              apr={apr}
              setApr={setApr}
              termMonths={termMonths}
              setTermMonths={setTermMonths}
              tradeInValue={tradeInValue}
              setTradeInValue={setTradeInValue}
              monthlyIncome={monthlyIncome}
              setMonthlyIncome={setMonthlyIncome}
            />

            <BudgetFitOptions
              vehiclePrice={vehiclePrice}
              onSelectPlan={(plan) => {
                setDownPayment(plan.downPayment);
                setApr(plan.apr);
                setTermMonths(plan.termMonths);
              }}
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="neumorphic p-6"
            >
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-6">
                Payment Summary
              </h3>

              <div className="space-y-4">
                <div className="neumorphic-inset p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#EB0A1E]" />
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                  </div>
                  <p className="text-3xl font-bold text-[#1C1C1C]">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="neumorphic-inset p-3 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingDown className="w-3 h-3 text-[#EB0A1E]" />
                      <span className="text-xs text-gray-600">Total Cost</span>
                    </div>
                    <p className="text-lg font-bold text-[#1C1C1C]">
                      ${totalCost.toFixed(0)}
                    </p>
                  </div>

                  <div className="neumorphic-inset p-3 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-[#EB0A1E]" />
                      <span className="text-xs text-gray-600">Total Interest</span>
                    </div>
                    <p className="text-lg font-bold text-[#1C1C1C]">
                      ${totalInterest.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveConfiguration}
                className="toyota-red-button w-full py-3 text-white font-semibold mt-6 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save to My Garage
              </button>
            </motion.div>

            {/* Responsible AI Coach */}
            {monthlyIncome > 0 && (
              <ResponsibleCoach
                monthlyPayment={monthlyPayment}
                monthlyIncome={monthlyIncome}
                isRisky={isRisky}
                paymentToIncomeRatio={paymentToIncomeRatio}
              />
            )}

            {/* Quick Tips */}
            <div className="neumorphic p-6">
              <h4 className="font-bold text-[#1C1C1C] mb-4">💡 Smart Tips</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Aim for 20% down payment when possible</li>
                <li>• Keep monthly payment under 15% of income</li>
                <li>• Shorter terms = less interest paid</li>
                <li>• Consider trade-in value to reduce principal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
