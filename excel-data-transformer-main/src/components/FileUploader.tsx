import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export function FileUploader({ onFileSelect, accept = '.xlsx,.xls', className }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {selectedFile ? (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="rounded-full p-1 hover:bg-destructive/10 transition-colors"
          >
            <X className="h-5 w-5 text-destructive" />
          </button>
        </div>
      ) : (
        <label
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />
          <Upload className={cn(
            'h-12 w-12 mb-4 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )} />
          <p className="text-lg font-medium text-foreground">
            Arraste o arquivo aqui
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Formatos aceitos: .xlsx, .xls
          </p>
        </label>
      )}
    </div>
  );
}
