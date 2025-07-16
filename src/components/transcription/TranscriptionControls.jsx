// src/components/transcription/TranscriptionControls.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../context/SpeechContext';
import { useAppContextSettings } from '../../context/AppSettingsContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';
import LanguageSelector from '../ui/LanguageSelector';
import Modal from '../ui/Modal'; // For the new speaker prompt
import {
  FaPlay, FaStop, FaSave, FaTrash, FaUserEdit, FaCog, FaDownload, FaCopy
} from 'react-icons/fa'; // Control icons
import { IconContext } from 'react-icons';
import { exportTextFile, copyToClipboard } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

/**
 * Contains all control buttons for speech recognition and transcription management.
 */
const TranscriptionControls = () => {
  const {
    isListening,
    startListening,
    stopListening,
    saveCurrentTranscriptSegment,
    clearAllTranscripts,
    transcriptionSegments,
    updateSpeaker,
    speaker,
    SpeechRecognitionSupported,
  } = useSpeech();
  const { settings, updateSetting } = useAppContextSettings();
  const { currentEffectiveTheme } = useTheme();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [newSpeakerName, setNewSpeakerName] = useState(speaker);

  const handleToggleOfflineMode = () => {
    updateSetting('offlineMode', !settings.offlineMode);
    // Stop listening if offline mode is toggled, as it might change recognition behavior
    if (isListening) stopListening();
  };

  const handleToggleHighContrast = () => {
    updateSetting('highContrastMode', !settings.highContrastMode);
  };

  const handleToggleAutoPunctuation = () => {
    updateSetting('autoPunctuation', !settings.autoPunctuation);
    // Note: Actual auto-punctuation control depends on browser's Web Speech API implementation
  };

  const handleNewSpeakerClick = () => {
    setNewSpeakerName(speaker); // Pre-fill with current speaker
    setShowSpeakerModal(true);
  };

  const handleSpeakerNameSubmit = () => {
    if (newSpeakerName.trim()) {
      updateSpeaker(newSpeakerName.trim());
      setShowSpeakerModal(false);
    } else {
      // If empty, revert to default or previous speaker
      updateSpeaker(DEFAULT_APP_SETTINGS.speakerId);
      setShowSpeakerModal(false);
    }
  };

  const handleExportAll = () => {
    const fullTranscript = transcriptionSegments
      .map(segment => `${segment.timestamp} - ${segment.speaker}: ${segment.text}`)
      .join('\n\n');
    exportTextFile(fullTranscript, 'full_transcription.txt', currentEffectiveTheme);
  };

  const handleCopyAll = () => {
    const fullTranscript = transcriptionSegments
      .map(segment => `${segment.timestamp} - ${segment.speaker}: ${segment.text}`)
      .join('\n\n');
    copyToClipboard(fullTranscript, currentEffectiveTheme);
  };

  return (
    <Card className="p-6">
      <motion.h3
        className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-0 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Controls
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Start/Stop Buttons */}
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? 'danger' : 'primary'}
          disabled={!SpeechRecognitionSupported}
          className="py-3"
        >
          <IconContext.Provider value={{ className: "mr-2" }}>
            {isListening ? <FaStop size={18} /> : <FaPlay size={18} />}
          </IconContext.Provider>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Button>

        {/* Save Current Segment Button */}
        <Button
          onClick={() => saveCurrentTranscriptSegment()}
          variant="secondary"
          disabled={!isListening && !transcriptionSegments.length} // Disable if not listening and nothing to save
          className="py-3"
        >
          <IconContext.Provider value={{ className: "mr-2" }}>
            <FaSave size={18} />
          </IconContext.Provider>
          Save Segment
        </Button>

        {/* Clear All Transcripts Button */}
        <Button
          onClick={clearAllTranscripts}
          variant="outline"
          disabled={transcriptionSegments.length === 0}
          className="py-3"
        >
          <IconContext.Provider value={{ className: "mr-2" }}>
            <FaTrash size={18} />
          </IconContext.Provider>
          Clear All
        </Button>

        {/* Change Speaker Button */}
        <Button
          onClick={handleNewSpeakerClick}
          variant="outline"
          className="py-3"
        >
          <IconContext.Provider value={{ className: "mr-2" }}>
            <FaUserEdit size={18} />
          </IconContext.Provider>
          Change Speaker
        </Button>
      </div>

      {/* Export/Copy Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button
          onClick={handleCopyAll}
          variant="ghost"
          size="sm"
          disabled={transcriptionSegments.length === 0}
        >
          <IconContext.Provider value={{ className: "mr-1" }}>
            <FaCopy size={16} />
          </IconContext.Provider>
          Copy All
        </Button>
        <Button
          onClick={handleExportAll}
          variant="ghost"
          size="sm"
          disabled={transcriptionSegments.length === 0}
        >
          <IconContext.Provider value={{ className: "mr-1" }}>
            <FaDownload size={16} />
          </IconContext.Provider>
          Export All
        </Button>
      </div>


      {/* Settings Button */}
      <div className="flex justify-center mt-6 pt-6 border-t border-neutral-400/10 dark:border-neutral-700/50">
        <Button
          onClick={() => setShowSettingsModal(true)}
          variant="ghost"
          className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-secondary-500"
        >
          <IconContext.Provider value={{ className: "mr-2" }}>
            <FaCog size={20} />
          </IconContext.Provider>
          App Settings
        </Button>
      </div>

      {/* Settings Modal */}
      <Modal
        open={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="App Settings"
        actions={
          <Button onClick={() => setShowSettingsModal(false)} variant="primary">
            Done
          </Button>
        }
      >
        <div className="space-y-4">
          <LanguageSelector />
          <ToggleSwitch
            label="Offline Mode (Limited functionality)"
            checked={settings.offlineMode}
            onChange={handleToggleOfflineMode}
          />
          <ToggleSwitch
            label="High Contrast Mode"
            checked={settings.highContrastMode}
            onChange={handleToggleHighContrast}
          />
          <ToggleSwitch
            label="Auto Punctuation (Browser dependent)"
            checked={settings.autoPunctuation}
            onChange={handleToggleAutoPunctuation}
          />
        </div>
      </Modal>

      {/* Change Speaker Modal */}
      <Modal
        open={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
        title="Change Speaker"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowSpeakerModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSpeakerNameSubmit}>
              Set Speaker
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-800 dark:text-neutral-100 mb-4">
          Current Speaker: <span className="font-semibold">{speaker}</span>
        </p>
        <label htmlFor="new-speaker-name" className="block text-sm font-medium text-neutral-800 dark:text-neutral-100 mb-1">
          New Speaker Name
        </label>
        <input
          type="text"
          id="new-speaker-name"
          value={newSpeakerName}
          onChange={(e) => setNewSpeakerName(e.target.value)}
          className="w-full p-3 border border-neutral-400/30 rounded-md
                     bg-neutral-0 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-0
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          placeholder="e.g., Interviewer, John, Speaker 2"
        />
      </Modal>
    </Card>
  );
};

export default TranscriptionControls;
