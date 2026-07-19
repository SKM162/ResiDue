import React, { useState } from 'react';
import { SecureField } from '../components/atoms/SecureField';
import { Button } from '../components/atoms/Button';

export function UploadView({ onParsingComplete }) {
  const [password, setPassword] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (!password) {
      setStatusMessage('Please define a master security key first.');
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      processFile(files[0]);
    } else {
      setStatusMessage('Invalid file format. Please drop a valid statement PDF.');
    }
  };

  const handleFileSelect = (e) => {
    if (!password) {
      setStatusMessage('Please define a master security key first.');
      return;
    }
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    setStatusMessage(`Ingesting ${file.name}... Preparing sandbox worker thread.`);
    
    // We pass the raw file and master password upward to the orchestrator 
    // which handles the Web Worker invocation and encryption layers
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
          This secret derives the AES-GCM key inside volatile memory. It is never stored on disk. If you lose this, your local database cannot be recovered.
        </p>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full py-12 border-2 border-dashed rounded flex flex-col items-center justify-center p-4 transition-colors ${
            isDragging ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 bg-neutral-50/50'
          }`}
        >
          <span className="text-xs font-medium text-neutral-700 mb-2">Drag and drop bank statement PDF</span>
          <span className="text-[11px] text-neutral-400 mb-4">or select via device explorer</span>
          
          <input 
            type="file" 
            id="file-upload" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileSelect} 
          />
          <label htmlFor="file-upload">
            <span className="px-3 py-1.5 text-xs font-medium bg-white border border-neutral-200 rounded cursor-pointer hover:bg-neutral-50 tracking-wide transition-all shadow-sm">
              Browse Files
            </span>
          </label>
        </div>

        {statusMessage && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-center">
            <p className="text-xs font-mono text-neutral-600 tracking-tight">{statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
