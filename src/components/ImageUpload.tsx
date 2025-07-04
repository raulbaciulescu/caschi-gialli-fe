import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Camera, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  className = "",
  children,
  disabled = false,
  loading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        alert(error);
        continue;
      }

      if (!multiple && validFiles.length >= 1) break;
      if (multiple && validFiles.length >= maxFiles) break;

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(updatedFiles);
      onImageSelect(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImageSelect(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || loading) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    if (disabled || loading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-yellow-500 bg-yellow-50'
            : disabled || loading
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || loading}
        />
        
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-yellow-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              {selectedFiles.length > 0 ? (
                <ImageIcon className="h-6 w-6 text-yellow-600" />
              ) : (
                <Upload className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {selectedFiles.length > 0 ? 'Add more images' : 'Upload images'}
            </p>
            <p className="text-xs text-gray-500">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max {maxSizeMB}MB per file
              {multiple && `, up to ${maxFiles} files`}
            </p>
          </div>
        )}
      </div>

      {/* Preview Grid - Only show for multiple file uploads */}
      {previews.length > 0 && multiple && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {selectedFiles[index]?.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;