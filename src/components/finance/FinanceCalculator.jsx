import React from "react";
import { DollarSign, Percent, Calendar, TrendingDown, Wallet } from "lucide-react";

export default function FinanceCalculator({
  vehiclePrice,
  setVehiclePrice,
  downPayment,
  setDownPayment,
  apr,
  setApr,
  termMonths,
  setTermMonths,
  tradeInValue,
  setTradeInValue,
  monthlyIncome,
  setMonthlyIncome,
}) {
  const termOptions = [36, 48, 60, 72, 84];

  return (
    <div className="neumorphic p-8">
      <h2 className="text-2xl font-bold text-[#1C1C1C] mb-6">
        Configure Your Financing
      </h2>
      <div className="space-y-6">
        {/* Vehicle Price */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-[#EB0A1E]" />
            <label className="font-semibold text-[#1C1C1C]">Vehicle Price</label>
          </div>
          <input
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(parseFloat(e.target.value) || 0)}
            className="w-full px-6 py-4 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] bg-[#e0e0e0] text-[#1C1C1C] font-semibold text-lg outline-none focus:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[#EB0A1E]" />
              <label className="font-semibold text-[#1C1C1C]">Down Payment</label>
            </div>
            <span className="text-sm text-gray-600">
              {vehiclePrice > 0 ? ((downPayment / vehiclePrice) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={vehiclePrice * 0.5}
            step="500"
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #EB0A1E ${
                vehiclePrice > 0 ? (downPayment / (vehiclePrice * 0.5)) * 100 : 0
              }%, #c0c0c0 0%)`,
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">$0</span>
            <span className="text-lg font-bold text-[#1C1C1C]">
              ${downPayment.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              ${(vehiclePrice * 0.5).toLocaleString()}
            </span>
          </div>
        </div>

        {/* APR */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#EB0A1E]" />
              <label className="font-semibold text-[#1C1C1C]">APR (Annual %)</label>
            </div>
            <span className="text-lg font-bold text-[#1C1C1C]">{apr.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.1"
            value={apr}
            onChange={(e) => setApr(parseFloat(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #EB0A1E ${(apr / 15) * 100}%, #c0c0c0 0%)`,
            }}
          />
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#EB0A1E]" />
            <label className="font-semibold text-[#1C1C1C]">Loan Term</label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {termOptions.map((term) => (
              <button
                key={term}
                onClick={() => setTermMonths(term)}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  termMonths === term
                    ? "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-[#EB0A1E]"
                    : "neumorphic-button text-[#1C1C1C]"
                }`}
              >
                {term}mo
              </button>
            ))}
          </div>
        </div>

        {/* Trade-In Value */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-[#EB0A1E]" />
            <label className="font-semibold text-[#1C1C1C]">Trade-In Value</label>
          </div>
          <input
            type="number"
            value={tradeInValue}
            onChange={(e) => setTradeInValue(parseFloat(e.target.value) || 0)}
            placeholder="$0"
            className="w-full px-6 py-4 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] bg-[#e0e0e0] text-[#1C1C1C] font-semibold text-lg outline-none"
          />
        </div>

        {/* Monthly Income (optional) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-[#EB0A1E]" />
            <label className="font-semibold text-[#1C1C1C]">
              Monthly Income (Optional)
            </label>
          </div>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            placeholder="For budget guidance"
            className="w-full px-6 py-4 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] bg-[#e0e0e0] text-[#1C1C1C] font-semibold text-lg outline-none"
          />
        </div>
      </div>
    </div>
  );
}

