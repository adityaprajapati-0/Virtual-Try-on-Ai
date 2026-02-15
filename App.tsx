import React, { useState, useEffect } from 'react';
import { Sparkles, Shirt, Info, Github, Cpu, Maximize2, X, Download } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import PipelineVisualizer from './components/PipelineVisualizer';
import { generateTryOnResult } from './services/geminiService';
import { PipelineStage, TryOnRequest } from './types';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothImage, setClothImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>(PipelineStage.IDLE);
  const [useHighQuality, setUseHighQuality] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check for API key on mount
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleTryOn = async () => {
    if (!personImage || !clothImage) return;
    
    setPipelineStage(PipelineStage.SEGMENTATION);
    setError(null);
    setResultImage(null);

    // Simulate pipeline stages visually before calling API (to match the spec's architecture)
    try {
      // 1. Segmentation Simulation
      await new Promise(r => setTimeout(r, 1200));
      setPipelineStage(PipelineStage.WARPING);
      
      // 2. Warping Simulation
      await new Promise(r => setTimeout(r, 1200));
      setPipelineStage(PipelineStage.GENERATION);

      // 3. Actual Generation call to Gemini
      const result = await generateTryOnResult(personImage, clothImage, useHighQuality);
      
      setResultImage(result);
      setPipelineStage(PipelineStage.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setPipelineStage(PipelineStage.ERROR);
    }
  };

  const handleReset = () => {
    setPersonImage(null);
    setClothImage(null);
    setResultImage(null);
    setPipelineStage(PipelineStage.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-blue-600 p-2 rounded-lg">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NeuralFit <span className="text-purple-400 text-xs font-mono px-2 py-0.5 rounded-full bg-purple-900/30 border border-purple-500/30 uppercase tracking-wide">Studio</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSpecsOpen(true)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Specs
            </button>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className={`w-2 h-2 rounded-full ${apiKeyMissing ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {apiKeyMissing ? 'NO API KEY' : 'SYSTEM ONLINE'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {apiKeyMissing && (
           <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-center">
             <p className="text-red-200 font-medium">Missing Gemini API Key. Please set process.env.API_KEY.</p>
           </div>
        )}

        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Virtual Try-On <span className="text-purple-400">Architecture</span>
          </h2>
          <p className="text-lg text-slate-400">
            A demonstration of conditional image generation using geometric transformation and texture blending.
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">1</span>
                  Input Sources
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">High Quality Mode</span>
                  <button 
                    onClick={() => setUseHighQuality(!useHighQuality)}
                    disabled={pipelineStage !== PipelineStage.IDLE}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${useHighQuality ? 'bg-purple-600' : 'bg-slate-700'}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${useHighQuality ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <ImageUploader 
                  label="Target Person (P)" 
                  image={personImage} 
                  onImageChange={setPersonImage} 
                  disabled={pipelineStage !== PipelineStage.IDLE}
                />
                <ImageUploader 
                  label="Clothing Item (C)" 
                  image={clothImage} 
                  onImageChange={setClothImage} 
                  disabled={pipelineStage !== PipelineStage.IDLE}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <button
                  onClick={handleTryOn}
                  disabled={!personImage || !clothImage || pipelineStage !== PipelineStage.IDLE || apiKeyMissing}
                  className={`
                    w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2
                    transition-all duration-300 shadow-lg shadow-purple-900/20
                    ${(!personImage || !clothImage || pipelineStage !== PipelineStage.IDLE) 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white hover:shadow-purple-600/25 transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  <Sparkles className="w-5 h-5" />
                  {pipelineStage !== PipelineStage.IDLE ? 'Processing...' : 'Run Inference'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visualization & Output */}
          <div className="lg:col-span-7 space-y-6">
            
            <PipelineVisualizer stage={pipelineStage} />

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 min-h-[500px] flex flex-col backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">2</span>
                  Generated Output (T)
                </h3>
                {resultImage && (
                  <div className="flex gap-2">
                    <button onClick={handleReset} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <a href={resultImage} download="tryon-result.png" className="p-2 text-purple-400 hover:text-white bg-purple-900/30 hover:bg-purple-600 rounded-lg transition-colors border border-purple-500/30">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex-1 rounded-xl bg-slate-950 border border-slate-900 overflow-hidden relative group">
                {resultImage ? (
                  <img 
                    src={resultImage} 
                    alt="Generated Try-On Result" 
                    className="w-full h-full object-contain animate-in fade-in zoom-in duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                    {pipelineStage === PipelineStage.IDLE ? (
                      <>
                        <Maximize2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-mono text-sm">Waiting for input tensor...</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                           <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-purple-500 animate-spin"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                             <Cpu className="w-6 h-6 text-slate-500 animate-pulse" />
                           </div>
                        </div>
                        <p className="font-mono text-sm text-purple-400 animate-pulse">
                          {pipelineStage === PipelineStage.SEGMENTATION && "Extracting semantic map..."}
                          {pipelineStage === PipelineStage.WARPING && "Calculating affine grid..."}
                          {pipelineStage === PipelineStage.GENERATION && "Synthesizing texture..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {error && (
                   <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center p-8 text-center">
                     <div className="p-3 bg-red-800 rounded-full mb-4 text-white">
                        <X className="w-8 h-8" />
                     </div>
                     <h4 className="text-white font-bold text-lg mb-2">Inference Failed</h4>
                     <p className="text-red-200 text-sm max-w-md">{error}</p>
                     <button 
                        onClick={() => setPipelineStage(PipelineStage.IDLE)}
                        className="mt-6 px-4 py-2 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition-colors"
                      >
                        Try Again
                     </button>
                   </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Technical Specs Drawer (Modal) */}
      {isSpecsOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSpecsOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full p-8 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setIsSpecsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-500" />
              Specs
            </h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Model Architecture</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <h4 className="text-purple-400 font-medium mb-1">Human Parsing (Stage 1)</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Custom U-Net with ResNet backbone.
                      <br/>Input: <span className="font-mono text-xs bg-slate-800 px-1 rounded">3x256x256</span>
                      <br/>Output: Segmentation Mask
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <h4 className="text-blue-400 font-medium mb-1">Cloth Warping (Stage 2)</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Geometric Matching Module using Thin Plate Spline (TPS) or Affine transformations. Aligns cloth tensor to person pose keypoints.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <h4 className="text-emerald-400 font-medium mb-1">Generator (Stage 3)</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      U-Net Inpainting Model.
                      <br/>Loss: L1 + Perceptual (VGG16) + Adversarial (GAN).
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Training Config</h3>
                <ul className="space-y-2 text-sm text-slate-400 font-mono bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <li className="flex justify-between">
                    <span>Optimizer</span>
                    <span className="text-slate-200">Adam (lr=1e-4)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Batch Size</span>
                    <span className="text-slate-200">8</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Resolution</span>
                    <span className="text-slate-200">256x256</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Hardware</span>
                    <span className="text-slate-200">NVIDIA V100</span>
                  </li>
                </ul>
              </section>

              <div className="pt-8 border-t border-slate-800">
                 <p className="text-xs text-slate-500 text-center">
                   Implementation based on "Custom Virtual Try-On AI" tech spec.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;