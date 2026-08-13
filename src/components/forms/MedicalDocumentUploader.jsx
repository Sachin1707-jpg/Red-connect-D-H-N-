import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '../common/Button';

export const MedicalDocumentUploader = ({
  label = 'Upload Verification Document',
  description = 'Upload Govt ID, Medical Certificate, or Hospital License (PDF, PNG, JPG)',
  onUploadSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setUploading(true);
    setProgress(20);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploading(false);
          setFile({
            name: selected.name,
            size: (selected.size / 1024).toFixed(1) + ' KB',
            type: selected.type,
            url: URL.createObjectURL(selected),
          });
          if (onUploadSuccess) onUploadSuccess(selected);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleRemove = () => {
    setFile(null);
    setProgress(0);
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wide">
        {label}
      </label>

      {!file ? (
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors group cursor-pointer">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:text-primary group-hover:bg-red-50 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Click or drag file to upload
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs">{description}</p>
          </div>
          {uploading && (
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">
              {file.type.includes('image') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{file.size} · Uploaded ✓</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Preview File"
            >
              <Eye className="w-4 h-4" />
            </a>
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
