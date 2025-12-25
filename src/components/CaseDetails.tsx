import { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Home,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Upload,
  IndianRupee,
  ExternalLink
} from 'lucide-react';
import { CaseData } from '@/types/case';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProcessClaimDialog } from '@/components/ProcessClaimDialog';
import { RequestInfoDialog } from '@/components/RequestInfoDialog';
import { UploadDocumentDialog } from '@/components/UploadDocumentDialog';
import { DocumentViewerDialog } from '@/components/DocumentViewerDialog';
import { toast } from 'sonner';

interface CaseDetailsProps {
  caseData: CaseData;
  onCaseUpdate?: (updatedCase: CaseData) => void;
}

const statusConfig = {
  'open': { label: 'Open', variant: 'info' as const },
  'in-review': { label: 'In Review', variant: 'warning' as const },
  'pending': { label: 'Pending', variant: 'muted' as const },
  'resolved': { label: 'Resolved', variant: 'success' as const },
};

const priorityConfig = {
  'low': { label: 'Low', variant: 'muted' as const },
  'medium': { label: 'Medium', variant: 'info' as const },
  'high': { label: 'High', variant: 'warning' as const },
  'critical': { label: 'Critical', variant: 'destructive' as const },
};

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CaseDetails({ caseData, onCaseUpdate }: CaseDetailsProps) {
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerDialogOpen, setViewerDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<typeof caseData.documents[0] | null>(null);

  const status = statusConfig[caseData.status];
  const priority = priorityConfig[caseData.priority];

  const handleProcessClaim = (decision: string, amount: number, notes: string) => {
    const updatedCase = { ...caseData };
    if (decision === 'approve' || decision === 'reject') {
      updatedCase.status = 'resolved';
    } else if (decision === 'review') {
      updatedCase.status = 'pending';
    }
    updatedCase.timeline.push({
      event: decision === 'approve' ? `Claim approved for ${formatINR(amount)}` : decision === 'reject' ? 'Claim rejected' : 'Sent for further review',
      date: new Date().toLocaleDateString(),
      user: 'Current User'
    });
    onCaseUpdate?.(updatedCase);
    console.log('Processing claim:', { decision, amount, notes });
  };

  const handleViewDocument = (doc: typeof caseData.documents[0]) => {
    setSelectedDocument(doc);
    setViewerDialogOpen(true);
  };

  return (
    <div className="flex-1 min-w-0 overflow-auto p-6 space-y-5 bg-background/50">
      {/* Case Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold tracking-tight">{caseData.claimNumber}</h1>
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={priority.variant}>{priority.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {caseData.claimType}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {caseData.jurisdiction}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {caseData.caseStage}
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setRequestInfoDialogOpen(true)}>
            Request Info
          </Button>
          <Button size="sm" onClick={() => setProcessDialogOpen(true)}>
            Process Claim
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4 h-9">
          <TabsTrigger value="details" className="text-xs">Claim Details</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Documents ({caseData.documents.length})</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Applicant Info */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium text-sm">{caseData.applicant.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{caseData.applicant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{caseData.applicant.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                  <span>{caseData.applicant.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <div>
                  <p className="text-xs text-muted-foreground">Property Address</p>
                  <p className="font-medium text-sm">{caseData.property.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Property Type</p>
                  <p className="font-medium text-sm">{caseData.property.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Value</p>
                  <p className="font-semibold text-base text-primary">{formatINR(caseData.property.estimatedValue)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Claim Info */}
            <Card className="xl:col-span-2 card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                  </div>
                  Claim Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3" />
                      Date of Loss
                    </p>
                    <p className="font-medium text-sm">{new Date(caseData.claim.dateOfLoss).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3" />
                      Date Submitted
                    </p>
                    <p className="font-medium text-sm">{new Date(caseData.claim.dateSubmitted).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <IndianRupee className="w-3 h-3" />
                      Estimated Damage
                    </p>
                    <p className="font-bold text-lg text-primary">{formatINR(caseData.claim.estimatedDamage)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Description of Loss</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg leading-relaxed">{caseData.claim.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">Uploaded Documents</CardTitle>
              <Button size="sm" variant="outline" className="h-8" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload New
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {caseData.documents.map((doc, index) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer group animate-slide-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleViewDocument(doc)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} • {doc.uploadDate}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDocument(doc);
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Case Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
                <div className="space-y-4">
                  {caseData.timeline.map((event, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4 relative animate-slide-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center z-10">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">{event.event}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{event.date}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          <span>{event.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ProcessClaimDialog
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
        caseData={caseData}
        onProcess={handleProcessClaim}
      />
      <RequestInfoDialog
        open={requestInfoDialogOpen}
        onOpenChange={setRequestInfoDialogOpen}
        caseData={caseData}
      />
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        claimNumber={caseData.claimNumber}
      />
      <DocumentViewerDialog
        open={viewerDialogOpen}
        onOpenChange={setViewerDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
}
