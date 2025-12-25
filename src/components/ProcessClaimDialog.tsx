import { useState } from 'react';
import { CheckCircle2, AlertTriangle, FileCheck, IndianRupee } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CaseData } from '@/types/case';

interface ProcessClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: CaseData;
  onProcess: (decision: string, amount: number, notes: string) => void;
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ProcessClaimDialog({ open, onOpenChange, caseData, onProcess }: ProcessClaimDialogProps) {
  const [decision, setDecision] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(caseData.claim.estimatedDamage.toString());
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!decision) {
      toast.error('Please select a decision');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onProcess(decision, parseInt(approvedAmount), notes);
    
    toast.success(
      decision === 'approve' 
        ? `Claim ${caseData.claimNumber} approved for ${formatINR(parseInt(approvedAmount))}` 
        : decision === 'reject'
        ? `Claim ${caseData.claimNumber} has been rejected`
        : `Claim ${caseData.claimNumber} sent for further review`
    );

    setIsProcessing(false);
    onOpenChange(false);
    setDecision('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            Process Claim
          </DialogTitle>
          <DialogDescription>
            Review and process claim {caseData.claimNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Claim Summary */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Claim Type</span>
              <span className="font-medium">{caseData.claimType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Applicant</span>
              <span className="font-medium">{caseData.applicant.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Damage</span>
              <span className="font-semibold text-primary">{formatINR(caseData.claim.estimatedDamage)}</span>
            </div>
          </div>

          {/* Decision */}
          <div className="space-y-2">
            <Label>Decision *</Label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger>
                <SelectValue placeholder="Select decision..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Approve Claim
                  </div>
                </SelectItem>
                <SelectItem value="reject">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Reject Claim
                  </div>
                </SelectItem>
                <SelectItem value="review">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-warning" />
                    Send for Further Review
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Approved Amount (only for approve) */}
          {decision === 'approve' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                Approved Amount
              </Label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Processing Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments about this decision..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleProcess} disabled={isProcessing || !decision}>
            {isProcessing ? 'Processing...' : 'Confirm Decision'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
