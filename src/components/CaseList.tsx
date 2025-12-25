import { useState } from 'react';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  Search,
  Filter,
  SortAsc,
  IndianRupee
} from 'lucide-react';
import { CaseData } from '@/types/case';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CaseListProps {
  cases: CaseData[];
  selectedCaseId?: string;
  onSelectCase: (caseData: CaseData) => void;
}

const statusConfig = {
  'open': { label: 'Open', variant: 'info' as const },
  'in-review': { label: 'In Review', variant: 'warning' as const },
  'pending': { label: 'Pending', variant: 'muted' as const },
  'resolved': { label: 'Resolved', variant: 'success' as const },
};

const priorityColors = {
  'low': 'bg-muted',
  'medium': 'bg-info',
  'high': 'bg-warning',
  'critical': 'bg-destructive',
};

const formatINR = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function CaseList({ cases, selectedCaseId, onSelectCase }: CaseListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter(
    (c) =>
      c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 min-w-[280px] max-w-[320px] border-r border-border bg-card flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-base">Active Cases</h2>
            <p className="text-xs text-muted-foreground">{cases.length} cases in queue</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SortAsc className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Case List */}
      <div className="flex-1 overflow-auto">
        {filteredCases.map((caseItem, index) => {
          const status = statusConfig[caseItem.status];
          const isSelected = selectedCaseId === caseItem.id;
          
          return (
            <div
              key={caseItem.id}
              onClick={() => onSelectCase(caseItem)}
              className={cn(
                "p-4 border-b border-border cursor-pointer transition-all duration-200 animate-slide-in-up",
                isSelected 
                  ? "bg-primary/5 border-l-4 border-l-primary" 
                  : "hover:bg-muted/50 border-l-4 border-l-transparent"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Priority Indicator */}
                <div className={cn(
                  "w-1 h-12 rounded-full flex-shrink-0 mt-1",
                  priorityColors[caseItem.priority]
                )} />
                
                <div className="flex-1 min-w-0">
                  {/* Case Number & Status */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{caseItem.claimNumber}</span>
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                  
                  {/* Applicant Name */}
                  <p className="text-sm text-foreground mb-1 truncate">
                    {caseItem.applicant.name}
                  </p>
                  
                  {/* Claim Type & Amount */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {caseItem.claimType}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatINR(caseItem.claim.estimatedDamage)}
                    </span>
                  </div>
                  
                  {/* Stage & Time */}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{caseItem.caseStage}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {caseItem.jurisdiction}
                    </span>
                  </div>
                </div>
                
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform",
                  isSelected && "text-primary transform translate-x-0.5"
                )} />
              </div>
            </div>
          );
        })}
        
        {filteredCases.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No cases found</p>
          </div>
        )}
      </div>
    </div>
  );
}
