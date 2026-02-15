import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAreaClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
      <div 
        onClick={handleAreaClick}
        className={`
          relative group flex flex-col items-center justify-center 
          w-full h-64 rounded-xl border-2 border-dashed 
          transition-all duration-300 overflow-hidden cursor-pointer
          ${image 
            ? 'border-purple-500/50 bg-slate-900/50' 
            : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={disabled}
        />

        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain p-2"
            />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" /> Change Image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <div className="p-4 rounded-full bg-slate-800 mb-3 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="font-medium text-sm">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;