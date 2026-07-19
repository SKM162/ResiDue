// Import standard production-ready minified build of PDFJS directly into the worker environment
importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

// Point the global worker source back to the distribution file matching the library version
self.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

self.onmessage = async function (e) {
  cconst { file, pdfPassword } = e.data;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = self.pdfjsLib.getDocument({
      data: arrayBuffer,
      password: pdfPassword
    });
    const pdf = await loadingTask.promise;
    
    let allExtractedRows = [];

    // Loop through every single page sequentially
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageRows = processTextItems(textContent.items);
      allExtractedRows = allExtractedRows.concat(pageRows);
    }

    // Return the cleanly mapped structures back to the UI shell window thread
    self.postMessage({ success: true, data: allExtractedRows });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};

/**
 * Transforms raw unordered spatial text pieces into ordered row data structural arrays.
 */
function processTextItems(items) {
  if (items.length === 0) return [];

  // 1. Group individual tokens by their vertical line heights (Y position)
  // We round to the nearest whole integer to accommodate slight layout printing variances
  const textByLine = {};
  
  items.forEach(item => {
    if (!item.str.trim()) return; // Discard empty space blocks
    
    const yKey = Math.round(item.transform[5]); // Index 5 holds the absolute vertical Y coordinate offset
    
    if (!textByLine[yKey]) {
      textByLine[yKey] = [];
    }
    textByLine[yKey].push(item);
  });

  // 2. Sort lines from top to bottom (Descending order based on standard document flow coordinates)
  const sortedYLines = Object.keys(textByLine).sort((a, b) => b - a);
  const parsedRows = [];

  sortedYLines.forEach(y => {
    const lineTokens = textByLine[y];
    
    // Sort items horizontally inside the specific line from left to right (X coordinate)
    lineTokens.sort((a, b) => a.transform[4] - b.transform[4]);

    // Construct raw textual tokens mapping layout offsets
    const structuralLine = mapTokensToColumns(lineTokens);
    
    if (structuralLine) {
      parsedRows.push(structuralLine);
    }
  });

  return parsedRows;
}

/**
 * Inspects a spatial line array and determines structural validity against statement columns.
 */
function mapTokensToColumns(tokens) {
  // Extract clean string values from the horizontal fragments
  const rawTextLine = tokens.map(t => t.str.trim()).join(' ');

  // Look for your target date format rule at the beginning of the line to identify transactional lines.
  // Matches typical standard statement patterns like: DD/MM/YYYY or DD-MM-YYYY
  const dateRegex = /^\d{2}[-/]\d{2}[-/]\d{4}/;
  if (!dateRegex.test(rawTextLine)) {
    return null; // Ignore header blocks, summaries, or metadata footers automatically
  }

  // Fallback programmatic parser: token distribution alignment
  // For standard statements, text fragments map sequentially left-to-right to your 7 column headers.
  // When columns are left blank (e.g. no cheque number or no deposit value), we look for token array gaps.
  const date = tokens[0]?.str.trim() || '';
  
  // Basic flexible extraction mapping based on column count thresholds
  let narration = '';
  let refNo = '';
  let valueDate = '';
  let withdrawalAmount = '';
  let depositAmount = '';
  let closingBalance = '';

  // Minimalist positional grouping block logic
  if (tokens.length >= 5) {
    // Standard row layout strategy fallback
    closingBalance = tokens[tokens.length - 1]?.str.trim() || '';
    
    // Work backward to check currency field positions
    const penUltimate = tokens[tokens.length - 2]?.str.trim() || '';
    const antiPenUltimate = tokens[tokens.length - 3]?.str.trim() || '';

    // Simple number validation formatting matching clean currency indicators
    const isCurrency = (str) => /^[+-]?([0-9,]+\.[0-9]{2})$/.test(str);

    if (isCurrency(penUltimate) && isCurrency(antiPenUltimate)) {
      depositAmount = penUltimate;
      withdrawalAmount = antiPenUltimate;
      valueDate = tokens[tokens.length - 4]?.str.trim() || '';
    } else if (isCurrency(penUltimate)) {
      // Determine if it matches single direction deposit or withdrawal layout structures
      depositAmount = penUltimate; 
      valueDate = tokens[tokens.length - 3]?.str.trim() || '';
    }

    // Remainder items aggregate directly into narrative summary fields
    narration = tokens.slice(1, tokens.length - 4).map(t => t.str.trim()).join(' ');
  }

  return {
    date,
    narration: narration || rawTextLine.slice(10, 40), // Safe structural length defaults
    refNo,
    valueDate,
    withdrawalAmount,
    depositAmount,
    closingBalance
  };
}
