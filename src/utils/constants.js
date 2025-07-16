// src/utils/constants.js

// Language options for Web Speech API
export const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'ig-NG', name: 'Igbo (Nigeria)' },
  { code: 'ha-NG', name: 'Hausa (Nigeria)' },
  { code: 'yo-NG', name: 'Yoruba (Nigeria)' },
];

// Default application settings
export const DEFAULT_APP_SETTINGS = {
  language: 'en-US',
  offlineMode: false,
  highContrastMode: false,
  autoPunctuation: true,
  speakerId: 'Speaker 1',
};

// Voice commands and their actions
export const VOICE_COMMANDS = [
  { command: 'clear screen', description: 'Clears the transcription display.' },
  { command: 'save this', description: 'Saves the current transcription segment.' },
  { command: 'export', description: 'Exports all saved transcriptions.' },
  { command: 'stop listening', description: 'Stops the speech recognition.' },
  { command: 'new speaker', description: 'Prompts for a new speaker name.' },
  { command: 'start listening', description: 'Starts the speech recognition.' },
];

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  APP_SETTINGS: 'speech2text_app_settings',
  SAVED_TRANSCRIPTIONS: 'speech2text_saved_transcriptions',
  THEME: 'speech2text_theme',
  AUTH_USER: 'speech2text_auth_user', // NEW: Key for storing authenticated user
  REGISTERED_USERS: 'speech2text_registered_users', // NEW: Key for storing registered users
};
