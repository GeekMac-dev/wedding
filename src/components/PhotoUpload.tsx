import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PhotoUploadProps {
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/')
      );
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'success') continue;
      
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[i].status = 'uploading';
        return newFiles;
      });

      try {
        const file = files[i].file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('wedding-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase
          .from('wedding_photos')
          .insert({
            file_name: file.name,
            file_path: filePath,
            file_url: publicUrl,
            uploaded_by: uploaderName || 'Anonymous Guest',
          });

        if (dbError) throw dbError;

        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].status = 'success';
          newFiles[i].progress = 100;
          return newFiles;
        });
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[i].status = 'error';
          return newFiles;
        });
      }
    }

    setIsUploading(false);
    onUploadComplete();
    
    // Clear successful uploads after a delay
    setTimeout(() => {
      setFiles(prev => prev.filter(f => f.status !== 'success'));
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-gray-800 mb-2">Share Your Memories</h3>
        <p className="text-gray-500">Upload your photos from our special day</p>
      </div>

      {/* Uploader Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name (optional)
        </label>
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-rose-400 bg-rose-50'
            : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 transition-colors ${
            isDragging ? 'bg-rose-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-rose-500' : 'text-gray-400'}`} />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF, WEBP</p>
        </div>
      </div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-700">
              Selected Photos ({files.length})
            </h4>
            <button
              onClick={() => setFiles([])}
              className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {files.map((uploadFile, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={uploadFile.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  uploadFile.status === 'pending' ? 'bg-black/0 group-hover:bg-black/40' :
                  uploadFile.status === 'uploading' ? 'bg-black/50' :
                  uploadFile.status === 'success' ? 'bg-green-500/50' :
                  'bg-red-500/50'
                }`}>
                  {uploadFile.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {uploadFile.status === 'uploading' && (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  )}
                  {uploadFile.status === 'success' && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                  {uploadFile.status === 'error' && (
                    <X className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadFiles}
            disabled={isUploading || files.every(f => f.status === 'success')}
            className={`w-full mt-6 py-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              isUploading || files.every(f => f.status === 'success')
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : files.every(f => f.status === 'success') ? (
              <>
                <CheckCircle className="w-5 h-5" />
                All Photos Uploaded!
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Upload {files.filter(f => f.status === 'pending').length} Photo{files.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
