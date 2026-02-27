import React, { useState, useRef } from 'react';
import { Wand2, Upload, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { generateImage, editImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export function StudioSection() {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const match = result.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        setSourceImage({
          mimeType: match[1],
          data: match[2]
        });
        setResultImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      if (mode === 'generate') {
        result = await generateImage(prompt);
      } else {
        if (!sourceImage) throw new Error("Please upload a source image first");
        result = await editImage(sourceImage.data, sourceImage.mimeType, prompt);
      }
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Controls */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Nano Studio</h2>
            <p className="text-neutral-400">Create or edit images using text prompts.</p>
          </div>

          <div className="flex p-1 bg-neutral-950 rounded-xl">
            <button 
              onClick={() => { setMode('generate'); setResultImage(null); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'generate' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Generate New
            </button>
            <button 
              onClick={() => { setMode('edit'); setResultImage(null); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${mode === 'edit' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Edit Existing
            </button>
          </div>

          {mode === 'edit' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-300">Source Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-950/50"
              >
                {sourceImage ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <img src={`data:${sourceImage.mimeType};base64,${sourceImage.data}`} alt="Source" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium flex items-center gap-2"><Upload size={18}/> Change Image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-3">
                      <Upload size={20} className="text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-200">Click to upload</p>
                    <p className="text-xs text-neutral-500 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-300">
              {mode === 'generate' ? 'Prompt' : 'Edit Instructions'}
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "A futuristic smartphone with a holographic display..." : "Add a retro filter, remove the background..."}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[120px] resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim() || (mode === 'edit' && !sourceImage)}
            className="w-full bg-white hover:bg-neutral-200 text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
            {isLoading ? 'Processing...' : (mode === 'generate' ? 'Generate Image' : 'Apply Edit')}
          </button>
        </div>

        {/* Result */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-neutral-300 mb-3">Result</label>
          <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-neutral-500"
                >
                  <Loader2 size={40} className="animate-spin mb-4 text-yellow-500" />
                  <p className="font-medium">Creating magic...</p>
                </motion.div>
              ) : resultImage ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full relative group"
                >
                  <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={resultImage} 
                      download="nano-banana-result.png"
                      className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Download size={16} /> Save
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-neutral-600"
                >
                  <ImageIcon size={48} className="mb-4 opacity-50" />
                  <p className="font-medium">Your image will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
