import React from 'react';
import { MetricCard } from '../molecules/MetricCard';

export function MetricsPanel({ ledgerData }) {
  const calculateTotals = () => {
    let deposits = 0;
    let withdrawals = 0;
    
    ledgerData.forEach(row => {
      const dep = parseFloat(row.depositAmount?.replace(/,/g, '')) || 0;
      const wit = parseFloat(row.withdrawalAmount?.replace(/,/g, '')) || 0;
      deposits += dep;
      withdrawals += wit;
    });

    const netResidue = deposits - withdrawals;

    return { 
      deposits: deposits.toLocaleString(undefined, { minimumFractionDigits: 2 }), 
      withdrawals: withdrawals.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      residue: netResidue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      isResiduePositive: netResidue >= 0
    };
  };

  const totals = calculateTotals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard title="Total Account Inflow" amount={totals.deposits} type="inflow" />
      <MetricCard title="Total Account Outflow" amount={totals.withdrawals} type="outflow" />
      <MetricCard title="Calculated Net Residue" amount={totals.residue} type="neutral" />
    </div>
  );
}
