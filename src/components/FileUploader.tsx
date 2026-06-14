import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAppStore } from '../store';

export const FileUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setDocument = useAppStore((state) => state.setDocument);
  const currentAssessment = useAppStore((state) => state.currentAssessment);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = Array.from(e.dataTransfer.files).find(
      (file) => file.type === 'application/pdf' || file.type.startsWith('image/')
    );
    
    if (file) {
      setDocument(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!currentAssessment) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Sélectionnez ou créez un assessment pour commencer</p>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer transition hover:border-gray-400 hover:bg-gray-50"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center gap-3">
        <Upload className="w-8 h-8 text-gray-400" />
        <div>
          <p className="text-base font-medium text-gray-700">
            Déposez votre fichier ici
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ou cliquez pour parcourir
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Accepte: PDF, JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
};
