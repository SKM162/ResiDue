import React from 'react';

export function TransactionTable({ data }) {
  return (
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
  );
}
