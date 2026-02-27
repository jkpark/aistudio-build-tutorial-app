import React, { useState, useEffect } from 'react';
import { VideoSection } from './components/VideoSection';
import { GallerySection } from './components/GallerySection';
import { StudioSection } from './components/StudioSection';
import { Banana, Key } from 'lucide-react';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(false);
        }
      } else {
        // If not in AI Studio environment, assume key is provided via env
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success to mitigate race condition
      setHasKey(true);
    }
  };

  if (hasKey === null) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md text-center space-y-6 bg-neutral-900 p-8 rounded-2xl border border-neutral-800">
          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto text-neutral-950">
            <Key size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Paid API Key Required</h1>
            <p className="text-neutral-400">
              Veo 3.1 video generation requires an API key from a paid Google Cloud project.
            </p>
          </div>
          <button
            onClick={handleSelectKey}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Select API Key
          </button>
          <p className="text-sm text-neutral-500">
            Learn more about <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-neutral-300">billing and pricing</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-yellow-500/30">
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-neutral-950">
              <Banana size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">NanoBanana Studio</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-neutral-400">
            <a href="#video" className="hover:text-neutral-50 transition-colors">Video Ad</a>
            <a href="#gallery" className="hover:text-neutral-50 transition-colors">Gallery</a>
            <a href="#studio" className="hover:text-neutral-50 transition-colors">Studio</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        <section id="video">
          <VideoSection />
        </section>
        
        <section id="gallery">
          <GallerySection />
        </section>

        <section id="studio">
          <StudioSection />
        </section>
      </main>
      
      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        <p>Powered by Gemini 2.5 Flash Image & Veo 3.1</p>
      </footer>
    </div>
  );
}
