import { useState, useRef } from 'react';
import { uploadFile, deleteFile } from '@teknomed/database';
import { Upload, X, Box } from 'lucide-react';

interface ModelUploadProps {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

export function ModelUpload({ currentUrl, onUpload, onRemove }: ModelUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'glb' && ext !== 'gltf') {
      setError('Hanya file .glb atau .gltf yang diterima');
      return;
    }

    // Validate size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File terlalu besar (max 50MB)');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Simulate progress (Supabase SDK doesn't expose upload progress)
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const filePath = `models/${Date.now()}-${file.name}`;
      const url = await uploadFile('models', filePath, file);

      clearInterval(progressInterval);
      setProgress(100);

      onUpload(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (currentUrl) {
      try {
        const urlParts = currentUrl.split('/storage/v1/object/public/models/');
        if (urlParts[1]) {
          await deleteFile('models', urlParts[1]);
        }
      } catch {
        // Silent fail
      }
    }
    onRemove();
  };

  const fileName = currentUrl?.split('/').pop() ?? '';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">3D Model (GLB)</label>

      {currentUrl ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Box size={20} className="text-gray-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{fileName}</p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener"
              className="text-xs text-gray-500 hover:underline"
            >
              Preview GLB
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gray-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm">Upload GLB Model</span>
              <span className="text-xs text-gray-400">.glb / .gltf — Max 50MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf"
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
