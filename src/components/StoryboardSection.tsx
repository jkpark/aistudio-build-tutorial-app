import React, { useState } from 'react';
import { Play, Loader2, LayoutGrid } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { motion } from 'motion/react';

export function StoryboardSection({ apiKey }: { apiKey: string }) {
  const [frames, setFrames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("A cinematic commercial for a sleek new smartphone. Neon-lit cyberpunk city background.");

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Please enter your Gemini API Key at the top of the page.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFrames([]);
    try {
      // Generate 3 frames for the storyboard
      const prompts = [
        `${prompt} - Scene 1: Wide establishing shot`,
        `${prompt} - Scene 2: Close up on the product features`,
        `${prompt} - Scene 3: Action shot with dynamic lighting`
      ];
      
      const results = await Promise.all(prompts.map(p => generateImage(p, apiKey)));
      setFrames(results);
    } catch (err: any) {
      setError(err.message || "Failed to generate storyboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Storyboard Ads</h2>
        <p className="text-neutral-400 text-lg">Generate a sequence of cinematic frames for your video ad concepts using Nano Banana.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 bg-black relative min-h-[400px] flex items-center justify-center">
          {frames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {frames.map((frame, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  key={idx} 
                  className="aspect-video rounded-xl overflow-hidden border border-neutral-800 relative group"
                >
                  <img src={frame} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white">
                    Scene {idx + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500 space-y-4 text-center">
              {isLoading ? (
                <>
                  <Loader2 size={48} className="animate-spin text-yellow-500" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-300">Drawing storyboard frames...</p>
                    <p className="text-sm">Generating 3 high-quality scenes.</p>
                  </div>
                </>
              ) : (
                <>
                  <LayoutGrid size={48} className="opacity-50" />
                  <p className="text-lg font-medium">No storyboard generated yet</p>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 bg-neutral-900 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 disabled:opacity-50"
              placeholder="Describe your ad concept..."
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
              {isLoading ? 'Generating...' : 'Generate Storyboard'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
