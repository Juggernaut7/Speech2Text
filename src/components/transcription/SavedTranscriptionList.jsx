// src/components/transcription/SavedTranscriptionsList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../context/SpeechContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FaTrash } from 'react-icons/fa'; // Trash icon
import { IconContext } from 'react-icons';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

/**
 * Displays a list of saved transcription segments.
 * Allows users to view and delete individual segments.
 */
const SavedTranscriptionsList = () => {
  // DEBUG FIX: Destructure `deleteTranscriptionSegment` instead of `setTranscriptionSegments`
  const { transcriptionSegments, deleteTranscriptionSegment } = useSpeech();
  const { currentEffectiveTheme } = useTheme();

  const handleDeleteSegment = (id) => {
    // DEBUG FIX: Call the exposed `deleteTranscriptionSegment` function
    deleteTranscriptionSegment(id);
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <motion.h3
        className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-0 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Saved Transcriptions
      </motion.h3>

      {transcriptionSegments.length === 0 ? (
        <motion.p
          className="text-sm text-neutral-600 dark:text-neutral-400 italic text-center py-4 flex-grow flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No saved transcriptions yet.
        </motion.p>
      ) : (
        <div className="flex-grow overflow-y-auto pr-2 -mr-2"> {/* Added negative margin to account for scrollbar */}
          <AnimatePresence>
            {transcriptionSegments.map((segment) => (
              <motion.div
                key={segment.id}
                className="p-3 mb-3 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-400/20 dark:border-neutral-700 flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-grow">
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    {segment.timestamp} - <span className="font-semibold">{segment.speaker}</span>
                  </p>
                  <p className="font-body text-sm text-neutral-900 dark:text-neutral-0 whitespace-pre-wrap break-words">
                    {segment.text}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSegment(segment.id)}
                  className="flex-shrink-0 p-1 rounded-full"
                  title="Delete segment"
                >
                  <IconContext.Provider value={{ className: "text-error-500" }}>
                    <FaTrash size={16} />
                  </IconContext.Provider>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
};

export default SavedTranscriptionsList;
