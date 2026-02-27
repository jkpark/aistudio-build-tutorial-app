import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { motion } from 'motion/react';

const SAMPLE_PROMPTS = [
  "A sleek modern smartphone resting on a mossy rock in a dense, misty forest, cinematic lighting",
  "A futuristic transparent smartphone floating in zero gravity with Earth in the background",
  "Close up of a premium smartphone camera lens reflecting a vibrant neon city street at night"
];

export function GallerySection({ apiKey }: { apiKey: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSamples = async () => {
    if (!apiKey) {
      setError("Please enter your Gemini API Key at the top of the page.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages([]);
    
    try {
      const results = await Promise.all(
        SAMPLE_PROMPTS.map(prompt => generateImage(prompt, apiKey))
      );
      setImages(results);
    } catch (err: any) {
      setError(err.message || "Failed to generate sample images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Campaign Gallery</h2>
          <p className="text-neutral-400">Sample promotional images generated with Nano Banana.</p>
        </div>
        <button 
          onClick={handleGenerateSamples}
          disabled={isLoading}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Generate Samples
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group"
            >
              <img src={img} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-xs text-neutral-300 line-clamp-2">{SAMPLE_PROMPTS[idx]}</p>
              </div>
            </motion.div>
          ))
        ) : (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="aspect-square rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-600">
              {isLoading ? (
                <Loader2 size={32} className="animate-spin text-neutral-500 mb-2" />
              ) : (
                <ImageIcon size={32} className="mb-2 opacity-50" />
              )}
              <span className="text-sm font-medium">{isLoading ? 'Generating...' : 'Empty Slot'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
