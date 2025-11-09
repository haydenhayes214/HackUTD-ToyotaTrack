import React from "react";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

export default function ResponsibleCoach({
  monthlyPayment,
  monthlyIncome,
  isRisky,
  paymentToIncomeRatio,
}) {
  return (
    <div className={`neumorphic p-6 ${isRisky ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
      <div className="flex items-center gap-3 mb-4">
        {isRisky ? (
          <AlertCircle className="w-6 h-6 text-red-500" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        )}
        <h4 className="font-bold text-[#1C1C1C]">Budget Health Check</h4>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Payment to Income Ratio</span>
            <span className={`text-sm font-bold ${isRisky ? 'text-red-500' : 'text-green-500'}`}>
              {paymentToIncomeRatio.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${isRisky ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(paymentToIncomeRatio, 30)}%` }}
            />
          </div>
        </div>

        {isRisky ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ High Risk</p>
            <p className="text-sm text-red-700">
              Your monthly payment represents {paymentToIncomeRatio.toFixed(1)}% of your income, 
              which exceeds the recommended 15% threshold. Consider:
            </p>
            <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
              <li>Increasing your down payment</li>
              <li>Extending the loan term</li>
              <li>Exploring a more affordable vehicle</li>
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800 font-semibold mb-2">✓ Healthy Budget</p>
            <p className="text-sm text-green-700">
              Your payment is {paymentToIncomeRatio.toFixed(1)}% of your income, which is within 
              the recommended range. This is a manageable payment.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
          <TrendingUp className="w-4 h-4" />
          <span>Recommended: Keep monthly payment under 15% of income</span>
        </div>
      </div>
    </div>
  );
}

