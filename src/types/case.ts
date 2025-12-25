export interface CaseData {
  id: string;
  claimNumber: string;
  claimType: string;
  jurisdiction: string;
  caseStage: string;
  status: 'open' | 'in-review' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  applicant: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  property: {
    address: string;
    type: string;
    estimatedValue: number;
  };
  claim: {
    dateOfLoss: string;
    dateSubmitted: string;
    description: string;
    estimatedDamage: number;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
  }[];
  timeline: {
    date: string;
    event: string;
    user: string;
  }[];
}

export interface PolicyResult {
  id: string;
  type: 'regulation' | 'sop' | 'guideline' | 'alert';
  title: string;
  summary: string;
  relevanceScore: number;
  citation: {
    document: string;
    section: string;
    page: number;
    paragraph?: string;
  };
  effectiveDate?: string;
  tags: string[];
}

export interface ComplianceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  citation: {
    document: string;
    section: string;
    page: number;
  };
  actionRequired?: string;
}
