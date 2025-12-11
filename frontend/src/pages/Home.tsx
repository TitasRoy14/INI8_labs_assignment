import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DocumentList } from '@/components/DocumentList';
import { DeleteDialog } from '@/components/DeleteDialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type { Document } from '@shared/schema';

export default function Home() {
  const { toast } = useToast();
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok)
        throw new Error((await res.json()).message || 'Upload failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Upload successful',
        description: 'Your document has been uploaded securely.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setDeletingId(id);
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!res.ok)
        throw new Error((await res.json()).message || 'Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Document deleted',
        description: 'The document has been permanently removed.',
      });
      setDocumentToDelete(null);
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
      setDeletingId(null);
    },
  });

  const handleDownload = async (id: number) => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="?(.+)"?/);
      const filename = match
        ? decodeURIComponent(match[1].replace(/"/g, ''))
        : 'document.pdf';

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Download failed',
        description:
          error instanceof Error ? error.message : 'Unable to download',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <FileUploadZone
            onUpload={uploadMutation.mutateAsync}
            isUploading={uploadMutation.isPending}
          />
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onDownload={handleDownload}
            onDelete={setDocumentToDelete}
            deletingId={deletingId}
          />
        </div>
      </main>
      <DeleteDialog
        document={documentToDelete}
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
        onConfirm={() =>
          documentToDelete && deleteMutation.mutate(documentToDelete.id)
        }
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
