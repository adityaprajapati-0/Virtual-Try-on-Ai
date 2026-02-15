export const MODELS = {
  FAST: 'gemini-2.5-flash-image',
  QUALITY: 'gemini-3-pro-image-preview'
};

export const PROMPTS = {
  TRY_ON_SYSTEM: `You are an expert fashion AI capable of performing virtual try-on tasks. 
  Your task is to generate a realistic image of the person provided in the first image wearing the clothing provided in the second image.
  
  Follow this internal pipeline logic:
  1. Analyze the person's pose and body shape (Segmentation).
  2. Analyze the clothing texture and structure.
  3. Warp the clothing to fit the person's pose (Geometric Transformation).
  4. Generate the final image ensuring seamless blending and texture preservation.
  
  Return ONLY the final image. Do not add extra text.`,
  
  TRY_ON_USER: `Perform a virtual try-on. 
  Image 1: Target Person. 
  Image 2: Clothing Item. 
  Output: The person from Image 1 wearing the item from Image 2.`
};