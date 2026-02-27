import React from 'react';
import { StoryboardSection } from './components/StoryboardSection';
import { GallerySection } from './components/GallerySection';
import { StudioSection } from './components/StudioSection';
import { Banana } from 'lucide-react';

export default function App() {
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
            <a href="#storyboard" className="hover:text-neutral-50 transition-colors">Storyboard Ad</a>
            <a href="#gallery" className="hover:text-neutral-50 transition-colors">Gallery</a>
            <a href="#studio" className="hover:text-neutral-50 transition-colors">Studio</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        <section id="storyboard">
          <StoryboardSection />
        </section>
        
        <section id="gallery">
          <GallerySection />
        </section>

        <section id="studio">
          <StudioSection />
        </section>
      </main>
      
      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        <p>Powered by Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
}
