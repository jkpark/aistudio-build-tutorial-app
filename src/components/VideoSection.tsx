import React, { useState } from 'react';
import { Play, Loader2, Video } from 'lucide-react';
import { generateVideo } from '../services/geminiService';

export function VideoSection() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("A cinematic, high-quality commercial for a sleek new smartphone. The phone is floating in a neon-lit cyberpunk city, rotating slowly to show off its glowing edges and futuristic camera module.");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate video");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Next-Gen Mobile Ads</h2>
        <p className="text-neutral-400 text-lg">Generate cinematic video advertisements for your products using Veo 3.1.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video bg-black relative flex items-center justify-center">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 space-y-4 p-6 text-center">
              {isLoading ? (
                <>
                  <Loader2 size={48} className="animate-spin text-yellow-500" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-300">Generating your video...</p>
                    <p className="text-sm">This usually takes a few minutes. Hang tight!</p>
                  </div>
                </>
              ) : (
                <>
                  <Video size={48} className="opacity-50" />
                  <p className="text-lg font-medium">No video generated yet</p>
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
              placeholder="Describe your video ad..."
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
