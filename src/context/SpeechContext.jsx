// src/context/SpeechContext.jsx
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAppContextSettings } from './AppSettingsContext';
import { useTheme } from './ThemeContext';
import { LOCAL_STORAGE_KEYS, DEFAULT_APP_SETTINGS } from '../utils/constants';
import { formatTranscript, generateTimestamp } from '../utils/helpers';

export const SpeechContext = createContext();

/**
 * Provides speech recognition and synthesis context to its children.
 * Manages recognition state, transcriptions, speaker info, and saved sessions.
 */
export const SpeechProvider = ({ children }) => {
  const { settings, updateSetting } = useAppContextSettings();
  const { currentEffectiveTheme } = useTheme();

  // Speech Recognition API setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
  const recognitionRef = useRef(null);

  // State for recognition status
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  // State for transcription segments and speaker
  const [speaker, setSpeaker] = useState(settings.speakerId || DEFAULT_APP_SETTINGS.speakerId);
  const [transcriptionSegments, setTranscriptionSegments] = useLocalStorage(LOCAL_STORAGE_KEYS.SAVED_TRANSCRIPTIONS, []);

  // Initialize recognition object
  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Web Speech API is not supported by this browser.');
      toast.error('Speech recognition not supported in this browser.', { theme: currentEffectiveTheme });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true; // Keep listening
    recognitionRef.current.interimResults = true; // Get interim results
    recognitionRef.current.lang = settings.language; // Set language from settings

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setCurrentTranscript('Listening...');
      setInterimTranscript('');
      setError(null);
      toast.info('Listening started...', { theme: currentEffectiveTheme, autoClose: 1500 });
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentTranscript(formatTranscript(finalTranscript));
      setInterimTranscript(interimTranscript);

      // Automatically save final transcript segments
      if (finalTranscript) {
        saveCurrentTranscriptSegment(formatTranscript(finalTranscript));
        setCurrentTranscript(''); // Clear current after saving final
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`, { theme: currentEffectiveTheme });
      // If error is 'not-allowed', prompt user to enable microphone
      if (event.error === 'not-allowed') {
        toast.warn('Microphone access denied. Please enable it in your browser settings.', { autoClose: false, theme: currentEffectiveTheme });
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setCurrentTranscript('Stopped listening.');
      toast.info('Listening stopped.', { theme: currentEffectiveTheme, autoClose: 1500 });
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [SpeechRecognition, settings.language, currentEffectiveTheme]); // Re-initialize if language changes

  // Update recognition language if settings change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = settings.language;
    }
  }, [settings.language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      if (settings.offlineMode) {
        toast.info('Offline mode active. Recognition limited.', { theme: currentEffectiveTheme });
        setCurrentTranscript("Offline mode: Recognition capabilities are limited.");
        setIsListening(true); // Simulate listening
        return;
      }

      // Request microphone permission if not already granted
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current.start();
        })
        .catch(err => {
          console.error("Microphone access denied:", err);
          setError("Microphone access denied. Please allow access to use speech recognition.");
          toast.error("Microphone access denied. Please allow access to use speech recognition.", { autoClose: false, theme: currentEffectiveTheme });
        });
    } else {
      toast.error('Speech recognition not available.', { theme: currentEffectiveTheme });
    }
  }, [settings.offlineMode, recognitionRef, currentEffectiveTheme]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [recognitionRef, isListening]);

  const saveCurrentTranscriptSegment = useCallback((textToSave = currentTranscript) => {
    const text = textToSave.trim() || interimTranscript.trim();
    if (!text) {
      toast.warn('Nothing to save!', { theme: currentEffectiveTheme });
      return;
    }

    const newSegment = {
      id: generateUniqueId(),
      timestamp: generateTimestamp(),
      speaker: speaker,
      text: text,
      isFinal: !!textToSave.trim(),
    };

    setTranscriptionSegments(prevSegments => [...prevSegments, newSegment]);
    setCurrentTranscript('');
    setInterimTranscript('');
    toast.success('Transcript segment saved!', { theme: currentEffectiveTheme });
  }, [currentTranscript, interimTranscript, speaker, setTranscriptionSegments, currentEffectiveTheme]);

  const clearAllTranscripts = useCallback(() => {
    setTranscriptionSegments([]);
    setCurrentTranscript('');
    setInterimTranscript('');
    toast.info('All transcripts cleared.', { theme: currentEffectiveTheme });
  }, [setTranscriptionSegments, currentEffectiveTheme]);

  const deleteTranscriptionSegment = useCallback((id) => {
    setTranscriptionSegments(prevSegments => prevSegments.filter(segment => segment.id !== id));
    toast.info('Transcription segment deleted.', { theme: currentEffectiveTheme });
  }, [setTranscriptionSegments, currentEffectiveTheme]);


  const updateSpeaker = useCallback((newSpeakerName) => {
    setSpeaker(newSpeakerName);
    updateSetting('speakerId', newSpeakerName);
    toast.info(`Speaker changed to "${newSpeakerName}"`, { theme: currentEffectiveTheme });
  }, [setSpeaker, updateSetting, currentEffectiveTheme]);

  const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);


  const value = {
    isListening,
    currentTranscript,
    interimTranscript,
    transcriptionSegments,
    speaker,
    error,
    startListening,
    stopListening,
    saveCurrentTranscriptSegment,
    clearAllTranscripts,
    deleteTranscriptionSegment, // EXPOSED NEW FUNCTION
    updateSpeaker,
    SpeechRecognitionSupported: !!SpeechRecognition,
  };

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
};

/**
 * Custom hook to consume the SpeechContext.
 * @returns {{
 * isListening: boolean,
 * currentTranscript: string,
 * interimTranscript: string,
 * transcriptionSegments: Array<Object>,
 * speaker: string,
 * error: string|null,
 * startListening: Function,
 * stopListening: Function,
 * saveCurrentTranscriptSegment: Function,
 * clearAllTranscripts: Function,
 * deleteTranscriptionSegment: Function, // NEW IN RETURN TYPE
 * updateSpeaker: Function,
 * SpeechRecognitionSupported: boolean,
 * }}
 */
export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
