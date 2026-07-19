// src/views/DashboardView.jsx
import React from 'react';
import { Button } from '../components/atoms/Button';

export function DashboardView({ data, onClearSession }) {
  
  // Basic programmatic aggregate checks before building robust analytics modules
  const calculateTotals = () => {
    let deposits = 0;
    let withdrawals = 0;
    
    data.forEach(row => {
      const dep = parseFloat(row.depositAmount?.replace(/,/g, '')) || 0;
      const wit = parseFloat(row.withdrawalAmount?.replace(/,/g, '')) || 0;
      deposits += dep;
      withdrawals += wit;
    });

    return { 
      deposits: deposits.toLocaleString(undefined, { minimumFractionDigits: 2 }), 
      withdrawals: withdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 }) 
    };
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Dynamic Shell Control Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">ResiDue Ledger</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Active Sandbox Runtime • Verified Data Integration</p>
        </div>
        <Button label="Lock Workspace" variant="secondary" onClick={onClearSession} />
      </div>

      {/* Structural Metric Cards Organism */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-neutral-200 bg-white rounded-md shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Account Inflow</p>
          <p className="text-xl font-mono font-medium text-neutral-900 mt-2">+{totals.deposits}</p>
        </div>
        <div className="p-5 border border-neutral-200 bg-white rounded-md shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Account Outflow</p>
          <p className="text-xl font-mono font-medium text-neutral-900 mt-2">-{totals.withdrawals}</p>
        </div>
      </div>

      {/* Primary Transaction Table Organism */}
      <div className="border border-neutral-200 bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 w-1/3">Narration</th>
                <th className="px-4 py-3">Chq / Ref No.</th>
                <th className="px-4 py-3">Value Date</th>
                <th className="px-4 py-3 text-right">Withdrawal</th>
                <th className="px-4 py-3 text-right">Deposit</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150 text-xs font-mono text-neutral-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 font-sans text-neutral-800 break-words">{row.narration}</td>
                  <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">{row.refNo || '-'}</td>
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{row.valueDate}</td>
                  <td className="px-4 py-3 text-right text-neutral-800">{row.withdrawalAmount || '-'}</td>
                  <td className="px-4 py-3 text-right text-neutral-900 font-medium">{row.depositAmount || '-'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-900">{row.closingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
