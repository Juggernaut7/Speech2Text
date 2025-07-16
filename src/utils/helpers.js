// src/utils/helpers.js
import { toast } from 'react-toastify';

/**
 * Copies text to the clipboard and shows a toast notification.
 * @param {string} text - The text to copy.
 * @param {string} theme - The current theme ('light' or 'dark') for toast styling.
 */
export const copyToClipboard = (text, theme = 'dark') => {
  // Use document.execCommand('copy') as navigator.clipboard.writeText() might not work in some iframe environments
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    toast.success('Copied to clipboard!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  } catch (err) {
    console.error('Failed to copy text: ', err);
    toast.error('Failed to copy. Please try again.', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  } finally {
    document.body.removeChild(textarea);
  }
};

/**
 * Exports text content as a .txt file.
 * @param {string} content - The text content to export.
 * @param {string} filename - The name of the file (e.g., "transcription.txt").
 * @param {string} theme - The current theme ('light' or 'dark') for toast styling.
 */
export const exportTextFile = (content, filename, theme = 'dark') => {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(link.href); // Free up memory

    toast.success(`Exported '${filename}' successfully!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  } catch (error) {
    console.error("Error exporting file:", error);
    toast.error("Failed to export file. Please try again.", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  }
};

/**
 * Formats a raw transcript for display: capitalizes first letter, adds period if missing.
 * @param {string} transcript - The raw transcript string.
 * @returns {string} The formatted transcript string.
 */
export const formatTranscript = (transcript) => {
  if (!transcript) return '';
  let formatted = transcript.trim();
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  if (!formatted.endsWith('.') && !formatted.endsWith('?') && !formatted.endsWith('!')) {
    formatted += '.';
  }
  return formatted;
};

/**
 * Generates a simple timestamp string.
 * @returns {string} Current time in HH:MM:SS format.
 */
export const generateTimestamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
