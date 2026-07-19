import React, { useState } from 'react';
import { SecureField } from '../atoms/SecureField';
import { Button } from '../atoms/Button';

export function PasswordPrompt({ onUnlock, errorMessage }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onUnlock(password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 border border-neutral-200 bg-white rounded-md shadow-sm">
      <SecureField 
        label="Unlock Financial Workspace" 
        value={password} 
        onChange={setPassword} 
        placeholder="Enter your master key..." 
      />
      {errorMessage && (
        <p className="text-xs font-mono text-red-600 bg-red-50 p-2 rounded border border-red-100">{errorMessage}</p>
      )}
      <Button label="Decrypt Data" variant="primary" disabled={!password} />
    </form>
  );
}
