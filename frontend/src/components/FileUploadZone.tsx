import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function FileUploadZone({ onUpload, isUploading }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    await onUpload(selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Upload Document
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your medical PDF documents securely
          </p>
        </div>

        <div
          className={cn(
            "min-h-48 border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-4 p-6 cursor-pointer",
            isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            error && "border-destructive/50 bg-destructive/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF file"
          data-testid="upload-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleInputChange}
            className="hidden"
            data-testid="input-file"
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="size-10 text-primary" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground truncate max-w-xs" data-testid="text-selected-filename">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-selected-filesize">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFile}
                  disabled={isUploading}
                  data-testid="button-clear-file"
                >
                  <X className="size-4 mr-1" aria-hidden="true" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                  data-testid="button-upload"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 mr-1 animate-spin" aria-hidden="true" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 mr-1" aria-hidden="true" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-muted/50 rounded-full">
                <Upload className="size-12 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">
                  Drop PDF files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum 10MB per file
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center" data-testid="text-upload-error">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}
