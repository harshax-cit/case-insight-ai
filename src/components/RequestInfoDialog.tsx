import { useState } from 'react';
import { Mail, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { CaseData } from '@/types/case';

interface RequestInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: CaseData;
}

const documentTypes = [
  { id: 'proof-of-loss', label: 'Proof of Loss (Sworn Statement)' },
  { id: 'property-valuation', label: 'Property Valuation Report' },
  { id: 'photos', label: 'Additional Property Photos' },
  { id: 'receipts', label: 'Repair Receipts/Estimates' },
  { id: 'id-proof', label: 'Identity Verification' },
  { id: 'bank-details', label: 'Bank Account Details' },
];

export function RequestInfoDialog({ open, onOpenChange, caseData }: RequestInfoDialogProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleToggleDoc = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSend = async () => {
    if (selectedDocs.length === 0 && !customMessage.trim()) {
      toast.error('Please select at least one document or add a custom message');
      return;
    }

    setIsSending(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(`Information request sent to ${caseData.applicant.name}`, {
      description: `Email sent to ${caseData.applicant.email}`,
    });

    setIsSending(false);
    onOpenChange(false);
    setSelectedDocs([]);
    setCustomMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Request Information
          </DialogTitle>
          <DialogDescription>
            Send a request for additional documents or information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient Info */}
          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{caseData.applicant.name}</p>
              <p className="text-xs text-muted-foreground">{caseData.applicant.email}</p>
            </div>
          </div>

          {/* Document Checklist */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Required Documents
            </Label>
            <div className="space-y-2 p-3 rounded-lg border border-border">
              {documentTypes.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2">
                  <Checkbox
                    id={doc.id}
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={() => handleToggleDoc(doc.id)}
                  />
                  <label
                    htmlFor={doc.id}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {doc.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label>Additional Message</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add any specific instructions or questions..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Mail className="w-4 h-4 mr-1.5" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
