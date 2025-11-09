/**
 * Finance Page - Redesigned to match screenshot
 * Left: Configure panel (vehicle, MSRP, down payment, trade-in, term, APR)
 * Right: Results (monthly payment, total cost, comparison table)
 */

import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function FinancePage({ vehicles = [], selectedVehicle = null }) {
  // Initialize with selected vehicle or first vehicle
  const getInitialVehicle = () => {
    if (selectedVehicle) return selectedVehicle;
    if (vehicles.length > 0) return vehicles[0];
    return null;
  };

  const initialVehicle = getInitialVehicle();
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle?.id || '');
  const [msrp, setMsrp] = useState(initialVehicle?.price || initialVehicle?.msrp || 34350);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [term, setTerm] = useState(60);
  const [apr, setApr] = useState(4.9);

  const [buyResult, setBuyResult] = useState(null);
  const [leaseResult, setLeaseResult] = useState(null);
  const [subscribeResult, setSubscribeResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update MSRP when vehicle changes
  useEffect(() => {
    if (selectedVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        setMsrp(vehicle.price || vehicle.msrp || msrp);
      }
    }
  }, [selectedVehicleId, vehicles]);

  // Calculate all scenarios
  useEffect(() => {
    calculateAllScenarios();
  }, [msrp, downPayment, tradeInValue, term, apr]);

  const calculateAllScenarios = async () => {
    setLoading(true);
    try {
      // Buy
      const buyRes = await fetch(`${API_BASE}/calculate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: msrp,
          downPayment,
          apr,
          termMonths: term,
          isLease: false,
          isSubscription: false,
          tradeInValue,
          taxRate: 0.08,
        }),
      });
      const buyData = await buyRes.json();
      setBuyResult(buyData);

      // Lease
      const leaseRes = await fetch(`${API_BASE}/calculate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: msrp,
          downPayment,
          apr: 3.9,
          termMonths: 36,
          isLease: true,
          isSubscription: false,
          residualValue: Math.round(msrp * 0.55),
          tradeInValue,
          taxRate: 0.08,
        }),
      });
      const leaseData = await leaseRes.json();
      setLeaseResult(leaseData);

      // Subscribe
      const subRes = await fetch(`${API_BASE}/calculate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: msrp,
          downPayment: 500,
          apr: 0,
          termMonths: 36,
          isLease: false,
          isSubscription: true,
          tradeInValue,
          taxRate: 0.08,
        }),
      });
      const subData = await subRes.json();
      setSubscribeResult(subData);
    } catch (error) {
      console.error('Error calculating payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId) || selectedVehicle;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Configure */}
        <div className="glass-card p-8" style={{ backgroundColor: 'var(--card-bg-light)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Configure</h2>
          
          <div className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Select Vehicle
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  const vehicle = vehicles.find(v => v.id === e.target.value);
                  if (vehicle) {
                    setMsrp(vehicle.price || vehicle.msrp || 34350);
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
              >
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year || '2024'} {vehicle.make} {vehicle.model} {vehicle.trim || ''} - ${(vehicle.price || vehicle.msrp || 0).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* MSRP */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                MSRP
              </label>
              <div className="px-4 py-3 rounded-lg border-2 font-bold text-xl"
                style={{
                  backgroundColor: 'var(--glass-bg-dark)',
                  borderColor: 'var(--toyota-red)',
                  color: 'var(--toyota-red)',
                }}
              >
                ${msrp.toLocaleString()}
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Down Payment
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="down-0"
                  name="downPayment"
                  checked={downPayment === 0}
                  onChange={() => setDownPayment(0)}
                  className="w-5 h-5"
                  style={{ accentColor: 'var(--toyota-red)' }}
                />
                <label htmlFor="down-0" style={{ color: 'var(--text-primary)' }}>$0</label>

                <input
                  type="radio"
                  id="down-5000"
                  name="downPayment"
                  checked={downPayment === 5000}
                  onChange={() => setDownPayment(5000)}
                  className="w-5 h-5"
                  style={{ accentColor: 'var(--toyota-red)' }}
                />
                <label htmlFor="down-5000" style={{ color: 'var(--text-primary)' }}>$5,000</label>

                <input
                  type="radio"
                  id="down-custom"
                  name="downPayment"
                  checked={downPayment !== 0 && downPayment !== 5000}
                  onChange={() => {}}
                  className="w-5 h-5"
                  style={{ accentColor: 'var(--toyota-red)' }}
                />
                <input
                  type="number"
                  value={downPayment !== 0 && downPayment !== 5000 ? downPayment : ''}
                  onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                  placeholder="Custom"
                  className="flex-1 px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Trade-in Value */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Trade-in Value
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="trade-0"
                  name="tradeIn"
                  checked={tradeInValue === 0}
                  onChange={() => setTradeInValue(0)}
                  className="w-5 h-5"
                  style={{ accentColor: 'var(--toyota-red)' }}
                />
                <label htmlFor="trade-0" style={{ color: 'var(--text-primary)' }}>$0</label>

                <input
                  type="number"
                  value={tradeInValue !== 0 ? tradeInValue : ''}
                  onChange={(e) => setTradeInValue(parseInt(e.target.value) || 0)}
                  placeholder="Enter trade-in value"
                  className="flex-1 px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                Term
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[24, 36, 48, 60, 72, 84].map(months => (
                  <label key={months} className="flex items-center justify-center cursor-pointer">
                    <input
                      type="radio"
                      name="term"
                      value={months}
                      checked={term === months}
                      onChange={(e) => setTerm(parseInt(e.target.value))}
                      className="sr-only"
                    />
                    <div
                      className={`w-full py-3 text-center rounded-lg border-2 transition-all ${
                        term === months
                          ? 'border-toyota-red bg-toyota-red text-white'
                          : 'border-gray-300 bg-transparent'
                      }`}
                      style={{
                        borderColor: term === months ? 'var(--toyota-red)' : 'var(--glass-border)',
                        backgroundColor: term === months ? 'var(--toyota-red)' : 'transparent',
                        color: term === months ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      {months}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* APR */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                APR (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={apr}
                onChange={(e) => setApr(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          {/* Own the vehicle outright */}
          {buyResult && (
            <div className="glass-card p-8" style={{ backgroundColor: 'var(--card-bg-light)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Own the vehicle outright
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#FEF2F2', border: '2px solid #EF4444' }}>
                  <div className="text-sm mb-2" style={{ color: '#991B1B' }}>Monthly Payment</div>
                  <div className="text-4xl font-bold" style={{ color: '#DC2626' }}>
                    ${buyResult.monthlyPayment?.toLocaleString()}/mo
                  </div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#EFF6FF', border: '2px solid #3B82F6' }}>
                  <div className="text-sm mb-2" style={{ color: '#1E40AF' }}>Total Cost</div>
                  <div className="text-4xl font-bold" style={{ color: '#2563EB' }}>
                    ${buyResult.totalCost?.toLocaleString()}
                  </div>
                </div>
              </div>

              {buyResult.totalInterest && (
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Total Interest</span>
                    <span className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${buyResult.totalInterest.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Comparison */}
          <div className="glass-card p-8" style={{ backgroundColor: 'var(--card-bg-light)' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Quick Comparison
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: 'var(--glass-border)' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}></th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Buy</th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Lease</th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Subscribe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
                    <td className="py-4 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Monthly Payment</td>
                    <td className="py-4 px-4 text-center font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${buyResult?.monthlyPayment?.toLocaleString() || '---'}/mo
                    </td>
                    <td className="py-4 px-4 text-center font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${leaseResult?.monthlyPayment?.toLocaleString() || '---'}/mo
                    </td>
                    <td className="py-4 px-4 text-center font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${subscribeResult?.monthlyPayment?.toLocaleString() || '---'}/mo
                    </td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
                    <td className="py-4 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Total Cost</td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-primary)' }}>
                      ${buyResult?.totalCost?.toLocaleString() || '---'}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-primary)' }}>
                      ${leaseResult?.totalCost?.toLocaleString() || '---'}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-primary)' }}>
                      ${subscribeResult?.totalCost?.toLocaleString() || '---'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Best For</td>
                    <td className="py-4 px-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Long-term ownership
                    </td>
                    <td className="py-4 px-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Lower payments, new car often
                    </td>
                    <td className="py-4 px-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Maximum flexibility
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Payment Visualization */}
          <div className="glass-card p-8" style={{ backgroundColor: 'var(--card-bg-light)' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Monthly Payment Visualization
            </h3>
            <div className="space-y-4">
              {buyResult && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Buy (${buyResult.monthlyPayment?.toLocaleString()}/mo)</span>
                    <span style={{ color: 'var(--text-primary)' }}>{Math.round((buyResult.monthlyPayment / (subscribeResult?.monthlyPayment || buyResult.monthlyPayment)) * 100)}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-bg-dark)' }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.round((buyResult.monthlyPayment / (subscribeResult?.monthlyPayment || buyResult.monthlyPayment)) * 100)}%`,
                        backgroundColor: 'var(--toyota-red)',
                      }}
                    />
                  </div>
                </div>
              )}
              {leaseResult && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Lease (${leaseResult.monthlyPayment?.toLocaleString()}/mo)</span>
                    <span style={{ color: 'var(--text-primary)' }}>{Math.round((leaseResult.monthlyPayment / (subscribeResult?.monthlyPayment || leaseResult.monthlyPayment)) * 100)}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-bg-dark)' }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.round((leaseResult.monthlyPayment / (subscribeResult?.monthlyPayment || leaseResult.monthlyPayment)) * 100)}%`,
                        backgroundColor: '#3B82F6',
                      }}
                    />
                  </div>
                </div>
              )}
              {subscribeResult && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Subscribe (${subscribeResult.monthlyPayment?.toLocaleString()}/mo)</span>
                    <span style={{ color: 'var(--text-primary)' }}>100%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-bg-dark)' }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: '100%',
                        backgroundColor: '#10B981',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancePage;
