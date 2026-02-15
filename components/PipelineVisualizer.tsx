import React from 'react';
import { PipelineStage } from '../types';
import { Layers, Scissors, Move, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

interface PipelineVisualizerProps {
  stage: PipelineStage;
}

const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ stage }) => {
  
  const steps = [
    {
      id: PipelineStage.SEGMENTATION,
      label: 'Human Parsing',
      subtext: 'U-Net Segmentation',
      icon: Scissors
    },
    {
      id: PipelineStage.WARPING,
      label: 'Cloth Warping',
      subtext: 'Geometric Transform',
      icon: Move
    },
    {
      id: PipelineStage.GENERATION,
      label: 'Generator Network',
      subtext: 'Texture Blending',
      icon: Layers
    }
  ];

  const getStatusColor = (stepId: PipelineStage) => {
    if (stage === PipelineStage.IDLE || stage === PipelineStage.ERROR) return 'text-slate-500 border-slate-700 bg-slate-800/50';
    if (stage === PipelineStage.COMPLETE) return 'text-emerald-400 border-emerald-500/50 bg-emerald-900/20';
    
    // Determine active index
    const order = [PipelineStage.SEGMENTATION, PipelineStage.WARPING, PipelineStage.GENERATION];
    const currentIndex = order.indexOf(stage);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'text-emerald-400 border-emerald-500/50 bg-emerald-900/20';
    if (stepIndex === currentIndex) return 'text-blue-400 border-blue-500 bg-blue-900/20 animate-pulse';
    return 'text-slate-500 border-slate-700 bg-slate-800/50';
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Inference Pipeline
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const statusClass = getStatusColor(step.id);
          const isActive = stage === step.id;
          const isComplete = stage === PipelineStage.COMPLETE;

          return (
            <div 
              key={step.id} 
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${statusClass}`}
            >
              <div className="mb-3 p-3 rounded-full bg-slate-950/50 shadow-inner">
                {isActive ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isComplete || (step.id !== stage && getStatusColor(step.id).includes('emerald')) ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span className="font-semibold text-sm">{step.label}</span>
              <span className="text-xs opacity-70 mt-1">{step.subtext}</span>
              
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 animate-loading-bar rounded-b-lg overflow-hidden" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-400">
        <p className="opacity-75">
          <span className="text-blue-400">Architecture:</span> Custom PyTorch Pipeline
        </p>
        <p className="opacity-75 mt-1">
          <span className="text-purple-400">Backbone:</span> U-Net + WarpingNet
        </p>
      </div>
    </div>
  );
};

export default PipelineVisualizer;