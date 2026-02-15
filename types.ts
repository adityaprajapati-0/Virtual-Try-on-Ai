export enum PipelineStage {
  IDLE = 'IDLE',
  SEGMENTATION = 'SEGMENTATION',
  WARPING = 'WARPING',
  GENERATION = 'GENERATION',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ProcessingLog {
  id: string;
  message: string;
  timestamp: Date;
  stage: PipelineStage;
}

export interface TryOnRequest {
  personImage: File | null;
  clothImage: File | null;
  useHighQuality: boolean;
}

export interface TryOnResult {
  imageUrl: string | null;
  processingTime: number;
}