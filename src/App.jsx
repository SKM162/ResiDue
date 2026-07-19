import React, { useState, useEffect } from 'react';
import { UploadView } from './views/UploadView';
import { DashboardView } from './views/DashboardView';
import { encryptPayload, decryptPayload } from './core/crypto';
import { saveTransactionHistory, loadTransactionHistory } from './core/storage';
import { parseStatementPDF } from './core/parser';

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
    // Invokes background engine task execution without locking up standard render nodes
    const finalStructuredRows = await parseStatementPDF(file);

    if (finalStructuredRows.length === 0) {
      console.warn("Parsing process completed, but zero valid transaction rows matched statement schema criteria.");
      return;
    }

    const serializedCSV = JSON.stringify(finalStructuredRows);

    // Cryptographic serialization and backup layer execution
    const { encryptedData, salt, iv } = await encryptPayload(serializedCSV, password);
    await saveTransactionHistory(encryptedData, salt, iv);

    // Statically commit readable structures to local active session memory context
    setSessionData(finalStructuredRows);
  } catch (err) {
    console.error("Critical execution pipeline breakdown:", err);
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
