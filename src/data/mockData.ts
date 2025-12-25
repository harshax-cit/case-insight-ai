import { CaseData, PolicyResult, ComplianceAlert } from '@/types/case';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalClaims: number;
  activeClaims: number;
  status: 'active' | 'inactive';
}

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    totalClaims: 3,
    activeClaims: 1,
    status: 'active',
  },
  {
    id: 'cust-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 87654 32109',
    totalClaims: 2,
    activeClaims: 1,
    status: 'active',
  },
  {
    id: 'cust-3',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 76543 21098',
    totalClaims: 5,
    activeClaims: 2,
    status: 'active',
  },
  {
    id: 'cust-4',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@email.com',
    phone: '+91 65432 10987',
    totalClaims: 1,
    activeClaims: 0,
    status: 'inactive',
  },
];

export const mockCases: CaseData[] = [
  {
    id: 'CLM-2024-MH-00847',
    claimNumber: 'CLM-2024-MH-00847',
    claimType: 'Flood Insurance',
    jurisdiction: 'Maharashtra',
    caseStage: 'Initial Review',
    status: 'resolved',
    priority: 'high',
    applicant: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: '2847 Marine Drive, Mumbai, MH 400020',
    },
    property: {
      address: '2847 Marine Drive, Mumbai, MH 400020',
      type: 'Single Family Residence',
      estimatedValue: 40500000,
    },
    claim: {
      dateOfLoss: '2024-11-15',
      dateSubmitted: '2024-11-18',
      description: 'Significant flooding due to heavy monsoon rains. Water damage to ground floor, including flooring, drywall, electrical systems, and HVAC equipment. Property located in Special Flood Hazard Area.',
      estimatedDamage: 10650000,
    },
    documents: [
      { id: 'doc-1', name: 'Insurance Policy Declaration', type: 'Policy', uploadDate: '2024-11-18' },
      { id: 'doc-2', name: 'Proof of Loss Form', type: 'Claim Form', uploadDate: '2024-11-18' },
      { id: 'doc-3', name: 'Property Photos (42)', type: 'Evidence', uploadDate: '2024-11-19' },
      { id: 'doc-4', name: 'Contractor Estimate', type: 'Estimate', uploadDate: '2024-11-20' },
      { id: 'doc-5', name: 'Property Certificate', type: 'Certificate', uploadDate: '2024-11-18' },
    ],
    timeline: [
      { date: '2024-11-18 09:23', event: 'Claim submitted via online portal', user: 'System' },
      { date: '2024-11-18 09:25', event: 'Assigned to Claims Agent', user: 'Auto-Assignment' },
      { date: '2024-11-19 14:30', event: 'Supporting documents uploaded', user: 'Rajesh Kumar' },
      { date: '2024-11-20 10:15', event: 'Initial review started', user: 'Agent: Priya Mehta' },
      { date: '2024-11-21 14:00', event: 'AI Analysis completed - Approved for ₹10,650,000', user: 'Enterprise Claims AI' },
      { date: '2024-11-21 14:30', event: 'Claim resolved and payment processed', user: 'System' },
    ],
  },
  {
    id: 'CLM-2024-KA-00523',
    claimNumber: 'CLM-2024-KA-00523',
    claimType: 'Property Insurance',
    jurisdiction: 'Karnataka',
    caseStage: 'Assessment',
    status: 'open',
    priority: 'medium',
    applicant: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      address: '123 MG Road, Bangalore, KA 560001',
    },
    property: {
      address: '123 MG Road, Bangalore, KA 560001',
      type: 'Commercial Property',
      estimatedValue: 85000000,
    },
    claim: {
      dateOfLoss: '2024-11-10',
      dateSubmitted: '2024-11-12',
      description: 'Fire damage to office premises. Affected areas include server room, main office space, and reception. Electrical short circuit suspected as cause.',
      estimatedDamage: 25000000,
    },
    documents: [
      { id: 'doc-6', name: 'Fire Investigation Report', type: 'Report', uploadDate: '2024-11-15' },
      { id: 'doc-7', name: 'Insurance Policy', type: 'Policy', uploadDate: '2024-11-12' },
    ],
    timeline: [
      { date: '2024-11-12 11:00', event: 'Claim submitted', user: 'System' },
      { date: '2024-11-13 09:00', event: 'Assigned to Senior Agent', user: 'Auto-Assignment' },
    ],
  },
  {
    id: 'CLM-2024-TN-00912',
    claimNumber: 'CLM-2024-TN-00912',
    claimType: 'Vehicle Insurance',
    jurisdiction: 'Tamil Nadu',
    caseStage: 'Pending Documents',
    status: 'pending',
    priority: 'low',
    applicant: {
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 76543 21098',
      address: '456 Anna Salai, Chennai, TN 600002',
    },
    property: {
      address: '456 Anna Salai, Chennai, TN 600002',
      type: 'Residential Apartment',
      estimatedValue: 15000000,
    },
    claim: {
      dateOfLoss: '2024-11-08',
      dateSubmitted: '2024-11-09',
      description: 'Vehicle collision resulting in damage to car. Third party liability claim included.',
      estimatedDamage: 850000,
    },
    documents: [
      { id: 'doc-8', name: 'Police FIR', type: 'Report', uploadDate: '2024-11-09' },
    ],
    timeline: [
      { date: '2024-11-09 15:30', event: 'Claim submitted', user: 'System' },
    ],
  },
];

export const mockCase: CaseData = mockCases[0];

export const mockPolicies: PolicyResult[] = [
  {
    id: 'pol-1',
    type: 'regulation',
    title: 'IRDAI Flood Insurance Guidelines',
    summary: 'For high-risk flood zone properties, verify property certificate compliance. Building coverage applies to structural elements, foundation, electrical/plumbing systems. Contents coverage requires separate documentation. 30-day proof of loss requirement applies.',
    relevanceScore: 98,
    citation: {
      document: 'IRDAI Claims Manual 2024',
      section: 'Chapter 7: Building Coverage',
      page: 142,
      paragraph: '7.3.2 - Flood Zone Requirements',
    },
    effectiveDate: '2024-01-01',
    tags: ['IRDAI', 'Flood Zone', 'Building Coverage'],
  },
  {
    id: 'pol-2',
    type: 'regulation',
    title: 'Maharashtra Insurance Act - Monsoon Claims',
    summary: 'State law requires insurers to acknowledge claims within 14 days, begin investigation within 30 days, and provide determination within 90 days. Enhanced policyholder protections apply to declared disaster zones.',
    relevanceScore: 95,
    citation: {
      document: 'Maharashtra Insurance Code',
      section: 'Section 45.2',
      page: 1,
      paragraph: 'Subsection (2)(a)',
    },
    effectiveDate: '2023-07-01',
    tags: ['Maharashtra', 'Monsoon', 'Timeline'],
  },
  {
    id: 'pol-3',
    type: 'sop',
    title: 'Monsoon 2024 - Special Processing Guidelines',
    summary: 'IRDAI has authorized expedited processing for monsoon-related claims. Advance payments up to ₹15,00,000 permitted for verified high-risk zone properties. Standard deductible waiver applies for declared disaster areas.',
    relevanceScore: 92,
    citation: {
      document: 'Internal SOP - Monsoon 2024',
      section: 'Expedited Claims Processing',
      page: 8,
      paragraph: 'Section 3.1',
    },
    effectiveDate: '2024-06-10',
    tags: ['Monsoon 2024', 'Expedited', 'Advance Payment'],
  },
  {
    id: 'pol-4',
    type: 'guideline',
    title: 'Increased Cost of Compliance (ICC) Coverage',
    summary: 'Properties in high-risk zones with repetitive loss history may qualify for ICC coverage up to ₹25,00,000 for elevation or reconstruction. Requires substantial damage determination from local authority.',
    relevanceScore: 85,
    citation: {
      document: 'IRDAI Claims Manual 2024',
      section: 'Chapter 9: ICC Benefits',
      page: 198,
      paragraph: '9.2.1',
    },
    tags: ['ICC', 'Mitigation', 'High-Risk Zone'],
  },
];

export const mockAlerts: ComplianceAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Proof of Loss Deadline Approaching',
    description: 'IRDAI requires signed Proof of Loss within 30 days of loss. Current submission incomplete - missing sworn statement.',
    citation: {
      document: 'IRDAI Regulation 13(b)',
      section: 'Proof of Loss Requirements',
      page: 1,
    },
    actionRequired: 'Request completed Proof of Loss form from policyholder immediately.',
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Flood Zone Verification Required',
    description: 'Property is in Special Flood Hazard Area. Property Certificate shows compliance - verify against current municipal records before processing.',
    citation: {
      document: 'IRDAI Claims Manual',
      section: '6.4.3',
      page: 118,
    },
    actionRequired: 'Cross-reference Property Certificate with BMC records.',
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: 'Advance Payment Eligibility',
    description: 'Claim qualifies for Monsoon 2024 expedited advance payment program. Up to ₹15,00,000 can be issued pending full assessment.',
    citation: {
      document: 'SOP Monsoon 2024',
      section: '3.1.2',
      page: 9,
    },
  },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Case Assigned',
    message: 'CLM-2024-TN-00912 has been assigned to you',
    time: '5 min ago',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-2',
    title: 'Document Upload',
    message: 'Rajesh Kumar uploaded new documents for CLM-2024-MH-00847',
    time: '1 hour ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-3',
    title: 'Deadline Alert',
    message: 'Proof of Loss deadline in 5 days for 3 cases',
    time: '2 hours ago',
    read: true,
    type: 'warning',
  },
  {
    id: 'notif-4',
    title: 'System Update',
    message: 'New IRDAI guidelines have been added to the knowledge base',
    time: '1 day ago',
    read: true,
    type: 'info',
  },
];

export const mockClaimStats = {
  totalClaims: 156,
  openClaims: 42,
  pendingClaims: 28,
  resolvedClaims: 86,
  totalValue: 125000000,
  averageProcessingTime: 12,
  monthlyData: [
    { month: 'Jul', claims: 18, amount: 15000000 },
    { month: 'Aug', claims: 24, amount: 22000000 },
    { month: 'Sep', claims: 32, amount: 28000000 },
    { month: 'Oct', claims: 28, amount: 25000000 },
    { month: 'Nov', claims: 35, amount: 30000000 },
    { month: 'Dec', claims: 19, amount: 5000000 },
  ],
  claimsByType: [
    { type: 'Flood', count: 45, percentage: 29 },
    { type: 'Fire', count: 32, percentage: 21 },
    { type: 'Vehicle', count: 48, percentage: 31 },
    { type: 'Health', count: 31, percentage: 19 },
  ],
};
