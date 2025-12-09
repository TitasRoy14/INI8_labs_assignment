import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div 
      className="min-h-96 flex flex-col items-center justify-center text-center p-8"
      data-testid="empty-state"
    >
      <div className="p-6 bg-muted/50 rounded-full mb-6">
        <FileText className="size-16 text-muted-foreground/50" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No documents uploaded yet
      </h3>
      <p className="text-muted-foreground max-w-sm">
        Upload your first medical document to get started. Your files are stored securely.
      </p>
    </div>
  );
}
