import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "./EmptyState";
import type { Document } from "@shared/schema";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDownload: (id: number) => void;
  onDelete: (document: Document) => void;
  deletingId: number | null;
}

function DocumentSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Skeleton className="size-14 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function DocumentList({ 
  documents, 
  isLoading, 
  onDownload, 
  onDelete, 
  deletingId 
}: DocumentListProps) {
  return (
    <section className="space-y-6" aria-labelledby="documents-heading">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="documents-heading" className="text-xl md:text-2xl font-semibold text-foreground">
          Your Documents
        </h2>
        {!isLoading && documents.length > 0 && (
          <Badge variant="secondary" className="no-default-active-elevate" data-testid="badge-document-count">
            {documents.length} file{documents.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <DocumentSkeleton key={i} />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState />
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="document-grid"
        >
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDownload={onDownload}
              onDelete={onDelete}
              isDeleting={deletingId === doc.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
