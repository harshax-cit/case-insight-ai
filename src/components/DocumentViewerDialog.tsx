import { FileText, Download, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

export function DocumentViewerDialog({ open, onOpenChange, document }: DocumentViewerDialogProps) {
  if (!document) return null;

  const handleDownload = () => {
    toast.success(`Downloading ${document.name}...`);
  };

  const handleOpenExternal = () => {
    toast.info('Opening document in new tab...', {
      description: 'Document viewer would open here in production',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Document Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{document.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {document.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {document.uploadDate}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="info">Verified</Badge>
            </div>
          </div>

          {/* Document Preview Placeholder */}
          <div className="aspect-[4/3] rounded-lg border border-border bg-muted/30 flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Document Preview</p>
            <p className="text-xs text-muted-foreground mt-1">
              Full document viewer would render here
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </Button>
            <Button onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Open Full View
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
