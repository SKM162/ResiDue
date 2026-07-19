/**
 * Dispatches a raw PDF File object to the background Web Worker for execution.
 * @param {File} file - The uploaded statement file object.
 * @returns {Promise<Array<Object>>} Resolved parsed structural rows.
 */
export function parseStatementPDF(file) {
  return new Promise((resolve, reject) => {
    // Instantiate background thread module configuration
    const worker = new Worker(new URL('../../public/workers/pdf.worker.js', import.meta.url), {
      type: 'module'
    });

    worker.postMessage({ file });

    worker.onmessage = (event) => {
      const { success, data, error } = event.data;
      worker.terminate(); // Terminate worker thread instantly upon payload delivery
      if (success) resolve(data);
      else reject(new Error(error));
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };
  });
}
