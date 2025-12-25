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

export interface AIDecision {
  id: string;
  timestamp: Date;
  query: string;
  response: string;
  reasoning: {
    appliedRules: string[];
    excludedRules: {
      rule: string;
      reason: string;
    }[];
    evidence: {
      source: string;
      relevance: number;
      excerpt: string;
    }[];
  };
  confidence: number;
  caseContext: {
    caseId: string;
    claimType: string;
    jurisdiction: string;
  };
}

export interface GuardianAlert {
  id: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trigger: string;
  description: string;
  recommendedAction: string;
  caseId: string;
  autoResolved?: boolean;
}

export interface AIMode {
  witness: boolean;
  guardian: boolean;
  whyNot: boolean;
}
