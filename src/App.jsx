import React, { useState, useEffect } from 'react';
import { UploadView } from './views/UploadView';
import { DashboardView } from './views/DashboardView';
import { encryptPayload, decryptPayload } from './core/crypto';
import { saveTransactionHistory, loadTransactionHistory } from './core/storage';

export default function App() {
  const [sessionData, setSessionData] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  // Auto-check if encrypted data blocks exist inside local databases upon launching
  useEffect(() => {
    async function checkExistingStorage() {
      const savedData = await loadTransactionHistory();
      if (savedData) {
        console.log("Encrypted ledger discovered in storage layers. Awaiting master password unlock.");
      }
      setIsBooting(false);
    }
    checkExistingStorage();
  }, []);

  const handleParsingPipeline = async ({ file, password }) => {
    try {
      // Mock Data payload imitating parsing engine output for the 7 standard columns
      const mockParsedRows = [
        { date: '01/07/2026', narration: 'INTERNET BANKING TRANSFER / SALARY', refNo: 'TXN991204', valueDate: '01/07/2026', withdrawalAmount: '', depositAmount: '1,20,000.00', closingBalance: '1,45,000.00' },
        { date: '03/07/2026', narration: 'LOCAL POWER AND UTILITIES CORP', refNo: 'CHQ00412', valueDate: '04/07/2026', withdrawalAmount: '4,500.00', depositAmount: '', closingBalance: '1,40,500.00' }
      ];

      const serializedCSV = JSON.stringify(mockParsedRows);

      // Perform cryptographic serialization right before database staging
      const { encryptedData, salt, iv } = await encryptPayload(serializedCSV, password);
      await saveTransactionHistory(encryptedData, salt, iv);

      // Save raw states exclusively to application volatile memory
      setSessionData(mockParsedRows);
    } catch (err) {
      console.error("Cryptographic processing execution failure:", err);
    }
  };

  const handleClearSession = () => {
    setSessionData(null); // Purges internal unencrypted structures cleanly from RAM
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-mono text-xs text-neutral-400">
        Initializing Secure Architecture Sandbox...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {!sessionData ? (
        <UploadView onParsingComplete={handleParsingPipeline} />
      ) : (
        <DashboardView data={sessionData} onClearSession={handleClearSession} />
      )}
    </div>
  );
}
