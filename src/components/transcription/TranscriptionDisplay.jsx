// src/components/transcription/TranscriptionDisplay.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../context/SpeechContext';
import Card from '../ui/Card';
import { FaMicrophoneAlt } from 'react-icons/fa'; // Microphone icon
import { IconContext } from 'react-icons';

/**
 * Displays the current live transcription (final and interim results).
 */
const TranscriptionDisplay = () => {
  const { currentTranscript, interimTranscript, isListening, error } = useSpeech();

  return (
    <Card className="p-6 flex flex-col h-full min-h-88"> {/* Ensure it takes up vertical space */}
      <motion.h3
        className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-0 mb-4 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconContext.Provider value={{ className: "text-primary-500 dark:text-secondary-500" }}>
          <FaMicrophoneAlt size={20} />
        </IconContext.Provider>
        Live Transcription
        {isListening && (
          <motion.span
            className="ml-2 text-sm text-success-500 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
            </span>
            <span className="ml-1">Listening...</span>
          </motion.span>
        )}
      </motion.h3>

      <div className="flex-grow bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md border border-neutral-400/20 dark:border-neutral-700 overflow-y-auto font-body text-neutral-900 dark:text-neutral-0 relative">
        {error && (
          <p className="text-error-500 text-sm mb-2">{error}</p>
        )}
        {currentTranscript ? (
          <p className="text-base text-neutral-900 dark:text-neutral-0 font-medium mb-1">
            {currentTranscript}
          </p>
        ) : (
          <p className="text-base text-neutral-600 dark:text-neutral-400 italic">
            {isListening ? 'Say something...' : 'Click "Start Listening" to begin.'}
          </p>
        )}
        {interimTranscript && (
          <p className="text-sm text-neutral-500 dark:text-neutral-600 italic">
            {interimTranscript}
          </p>
        )}
      </div>
    </Card>
  );
};

export default TranscriptionDisplay;
