// src/hooks/useSpeechCommands.js
import { useEffect, useCallback, useRef } from 'react';
import { useSpeech } from '../context/SpeechContext';
import { useAppContextSettings } from '../context/AppSettingsContext';
import { useTheme } from '../context/ThemeContext';
import { VOICE_COMMANDS } from '../utils/constants';
import { toast } from 'react-toastify';

/**
 * Custom hook to handle voice commands based on the transcription.
 * It listens to final transcription results and triggers actions for recognized commands.
 */
export function useSpeechCommands() {
  const {
    currentTranscript,
    interimTranscript, // Listen to interim for faster command detection
    isListening,
    startListening,
    stopListening,
    saveCurrentTranscriptSegment,
    clearAllTranscripts,
    updateSpeaker,
    speaker,
  } = useSpeech();

  const { currentEffectiveTheme } = useTheme();
  const { settings } = useAppContextSettings();

  // Use a ref to store the latest speaker name to avoid stale closures in prompts
  const latestSpeakerRef = useRef(speaker);
  useEffect(() => {
    latestSpeakerRef.current = speaker;
  }, [speaker]);

  // Use a ref to prevent commands from firing multiple times for the same transcript segment
  const lastProcessedTranscriptRef = useRef('');

  const speakFeedback = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.language;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis API not supported for voice feedback.");
    }
  }, [settings.language]);

  const handleVoiceCommand = useCallback((transcript) => {
    const lowerTranscript = transcript.toLowerCase().trim();

    // Prevent processing the same command multiple times if interim results are similar
    if (lowerTranscript === lastProcessedTranscriptRef.current) {
        return;
    }

    // Check for "clear screen"
    if (lowerTranscript.includes("clear screen")) {
      clearAllTranscripts();
      speakFeedback("Screen cleared.");
      toast.info("Voice Command: Screen cleared.", { theme: currentEffectiveTheme });
      lastProcessedTranscriptRef.current = lowerTranscript;
      return;
    }

    // Check for "save this"
    if (lowerTranscript.includes("save this")) {
      saveCurrentTranscriptSegment(); // Saves the current final or interim transcript
      speakFeedback("Transcript saved.");
      toast.info("Voice Command: Transcript saved.", { theme: currentEffectiveTheme });
      lastProcessedTranscriptRef.current = lowerTranscript;
      return;
    }

    // Check for "export"
    if (lowerTranscript.includes("export")) {
      // Export all is handled by the button, but we can trigger a toast here
      speakFeedback("Export initiated.");
      toast.info("Voice Command: Exporting all transcripts. Please use the export button to download.", { theme: currentEffectiveTheme });
      lastProcessedTranscriptRef.current = lowerTranscript;
      return;
    }

    // Check for "stop listening"
    if (lowerTranscript.includes("stop listening")) {
      stopListening();
      speakFeedback("Stopped listening.");
      toast.info("Voice Command: Stopped listening.", { theme: currentEffectiveTheme });
      lastProcessedTranscriptRef.current = lowerTranscript;
      return;
    }

    // Check for "start listening"
    if (lowerTranscript.includes("start listening")) {
        if (!isListening) { // Only start if not already listening
            startListening();
            speakFeedback("Starting listening.");
            toast.info("Voice Command: Starting listening.", { theme: currentEffectiveTheme });
        }
        lastProcessedTranscriptRef.current = lowerTranscript;
        return;
    }

    // Check for "new speaker"
    if (lowerTranscript.includes("new speaker")) {
      // In a real app, you'd trigger a modal here. For a hook, we'll use prompt for simplicity.
      // Note: `prompt` is blocking and not ideal in React, but demonstrates the functionality.
      // A better approach would be to dispatch an action to a global state/context to open a modal.
      speakFeedback("Please say the new speaker's name.");
      setTimeout(() => { // Give time for feedback to play
        const newName = prompt(`Current speaker is "${latestSpeakerRef.current}". Enter new speaker name:`);
        if (newName && newName.trim()) {
          updateSpeaker(newName.trim());
          speakFeedback(`Speaker changed to ${newName.trim()}.`);
          toast.info(`Voice Command: Speaker changed to "${newName.trim()}".`, { theme: currentEffectiveTheme });
        } else {
          speakFeedback("Speaker name not changed.");
          toast.warn("Voice Command: Speaker name not provided.", { theme: currentEffectiveTheme });
        }
      }, 500); // Small delay to allow speech feedback
      lastProcessedTranscriptRef.current = lowerTranscript;
      return;
    }

    // Reset last processed transcript if it's not a command to allow new commands
    lastProcessedTranscriptRef.current = '';

  }, [
    clearAllTranscripts,
    saveCurrentTranscriptSegment,
    stopListening,
    startListening,
    updateSpeaker,
    speakFeedback,
    isListening,
    currentEffectiveTheme
  ]);

  // Effect to process final transcripts for commands
  useEffect(() => {
    // Only process if there's a final transcript segment
    if (currentTranscript && currentTranscript.trim()) {
      handleVoiceCommand(currentTranscript);
    }
  }, [currentTranscript, handleVoiceCommand]);

  // Effect to process interim transcripts for commands (optional, for faster response)
  // Be careful with interim results as they can change rapidly
  useEffect(() => {
    if (interimTranscript && interimTranscript.trim() && isListening) {
        // You might want to process only certain "trigger" words from interim
        // For simplicity, we'll process the full interim for commands here.
        // This can lead to commands firing multiple times if not debounced/managed carefully.
        // The `lastProcessedTranscriptRef` helps mitigate this.
        handleVoiceCommand(interimTranscript);
    }
  }, [interimTranscript, handleVoiceCommand, isListening]);
}
