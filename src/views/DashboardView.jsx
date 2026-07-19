import React from 'react';
import { Button } from '../components/atoms/Button';
import { MetricsPanel } from '../components/organisms/MetricsPanel';
import { TransactionTable } from '../components/organisms/TransactionTable';

export function DashboardView({ data, onClearSession }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">ResiDue Ledger</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Active Sandbox Runtime • Verified Data Integration</p>
        </div>
        <Button label="Lock Workspace" variant="secondary" onClick={onClearSession} />
      </div>

      <MetricsPanel ledgerData={data} />
      
      <TransactionTable data={data} />
    </div>
  );
}
