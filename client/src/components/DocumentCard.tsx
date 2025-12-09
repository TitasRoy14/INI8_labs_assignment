import { FileText, Download, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Document } from "@shared/schema";

interface DocumentCardProps {
  document: Document;
  onDownload: (id: number) => void;
  onDelete: (document: Document) => void;
  isDeleting: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const docDate = new Date(date);
  const diffMs = now.getTime() - docDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return docDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: docDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function DocumentCard({ document, onDownload, onDelete, isDeleting }: DocumentCardProps) {
  return (
    <Card 
      className="p-6 hover-elevate transition-all duration-200"
      data-testid={`card-document-${document.id}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <FileText className="size-8 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 
                  className="font-medium text-foreground truncate cursor-default"
                  data-testid={`text-filename-${document.id}`}
                >
                  {document.filename}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                <p>{document.filename}</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span data-testid={`text-filesize-${document.id}`}>
                {formatFileSize(document.filesize)}
              </span>
              <span aria-hidden="true">·</span>
              <span data-testid={`text-date-${document.id}`}>
                {formatRelativeDate(document.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDownload(document.id)}
                aria-label={`Download ${document.filename}`}
                data-testid={`button-download-${document.id}`}
              >
                <Download className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(document)}
                disabled={isDeleting}
                aria-label={`Delete ${document.filename}`}
                data-testid={`button-delete-${document.id}`}
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
