import React, { useState } from 'react';
import { SecureField } from '../components/atoms/SecureField';
import { FileDropZone } from '../components/molecules/FileDropZone';

export function UploadView({ onParsingComplete }) {
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileAccepted = (file) => {
    if (!password) {
      setStatusMessage('Please define a master security key first.');
      return;
    }
    setStatusMessage(`Ingesting ${file.name}... Processing locally.`);
    onParsingComplete({ file, password });
  };

  return (
    <div className="max-w-md mx-auto my-16 px-6 py-8 bg-white border border-neutral-150 rounded-lg shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-medium tracking-tight text-neutral-900 mb-1">Welcome to ResiDue</h2>
        <p className="text-xs text-neutral-500">Local-first, completely sandboxed financial ledger intelligence.</p>
      </div>

      <div className="space-y-6">
        <SecureField 
          label="Set Dashboard Security Key" 
          value={password} 
          onChange={setPassword} 
          placeholder="Enter custom passphrase..." 
        />
        <p className="text-[11px] text-neutral-400 leading-normal -mt-4">
          This secret derives the AES-GCM key inside volatile memory. It is never stored on disk.
        </p>

        <FileDropZone onFileAccepted={handleFileAccepted} disabled={!password} />

        {statusMessage && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-center">
            <p className="text-xs font-mono text-neutral-600 tracking-tight">{statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
