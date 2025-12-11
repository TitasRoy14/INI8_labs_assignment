import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Document } from "@shared/schema";

interface DeleteDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteDialog({ 
  document, 
  open, 
  onOpenChange, 
  onConfirm, 
  isDeleting 
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md" data-testid="dialog-delete">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="text-xl">Delete Document</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {document?.filename}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              disabled={isDeleting}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              data-testid="button-confirm-delete"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
