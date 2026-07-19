import React, { useState } from 'react';

export function FileDropZone({ onFileAccepted, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileAccepted(files[0]);
    }
  };

  return (
    <div 
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`w-full py-12 border-2 border-dashed rounded flex flex-col items-center justify-center p-4 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-200' :
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
        disabled={disabled}
        onChange={(e) => e.target.files[0] && onFileAccepted(e.target.files[0])} 
      />
      <label htmlFor={disabled ? '' : 'file-upload'}>
        <span className={`px-3 py-1.5 text-xs font-medium bg-white border border-neutral-200 rounded tracking-wide transition-all shadow-sm ${
          disabled ? 'cursor-not-allowed text-neutral-400' : 'cursor-pointer hover:bg-neutral-50'
        }`}>
          Browse Files
        </span>
      </label>
    </div>
  );
}
