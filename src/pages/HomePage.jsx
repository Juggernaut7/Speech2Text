// src/pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TranscriptionDisplay from '../components/transcription/TranscriptionDisplay';
import TranscriptionControls from '../components/transcription/TranscriptionControls';
import { useTheme } from '../context/ThemeContext';
import { useSpeechCommands } from '../hooks/useSpeechCommands'; // Import the new hook
import SavedTranscriptionsList from '../components/transcription/SavedTranscriptionList';

/**
 * The main home page for the Speech2Text application.
 * It integrates all the core transcription components, header, and footer.
 */
const HomePage = () => {
  const { currentEffectiveTheme } = useTheme();

  // Activate voice commands for this page
  useSpeechCommands();

  return (
    <div className={`min-h-screen flex flex-col ${currentEffectiveTheme === 'dark' ? 'bg-neutral-900 text-neutral-0' : 'bg-neutral-100 text-neutral-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body">
        <motion.h2
          className="font-heading text-2xl md:text-3xl font-bold text-center text-primary-500 dark:text-secondary-500 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Personal Speech-to-Text Assistant
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Transcription Controls */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TranscriptionControls />
          </motion.div>

          {/* Middle Column: Live Transcription Display */}
          <motion.div
            className="lg:col-span-1 flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TranscriptionDisplay />
          </motion.div>

          {/* Right Column: Saved Transcriptions List */}
          <motion.div
            className="lg:col-span-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <SavedTranscriptionsList />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
