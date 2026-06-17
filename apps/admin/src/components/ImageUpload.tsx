import { useState, useRef } from 'react';
import { uploadFile, deleteFile } from '@teknomed/database';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  bucket: string;
  path: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({
  bucket,
  path,
  currentUrl,
  onUpload,
  onRemove,
  label = 'Upload Gambar',
  accept = 'image/*',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File terlalu besar (max 5MB)');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const filePath = `${path}/${Date.now()}-${file.name}`;
      const url = await uploadFile(bucket, filePath, file);
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
        // Extract path from URL for deletion
        const urlParts = currentUrl.split(`/storage/v1/object/public/${bucket}/`);
        if (urlParts[1]) {
          await deleteFile(bucket, urlParts[1]);
        }
      } catch {
        // Silent fail — file might already be deleted
      }
    }
    onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentUrl ? (
        <div className="relative group">
          <img
            src={currentUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm">{label}</span>
              <span className="text-xs text-gray-400">Max 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
