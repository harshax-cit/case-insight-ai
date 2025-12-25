import { useState } from 'react';
import { Search, User, Mail, Phone, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockCustomers, mockCases, Customer } from '@/data/mockData';
import { CaseData } from '@/types/case';
import { cn } from '@/lib/utils';

interface CustomerListProps {
  onSelectCase: (caseData: CaseData) => void;
  selectedCaseId?: string;
}

export function CustomerList({ onSelectCase, selectedCaseId }: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerCases = selectedCustomer
    ? mockCases.filter((c) => c.applicant.name === selectedCustomer.name)
    : [];

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Auto-select first case of this customer
    const cases = mockCases.filter((c) => c.applicant.name === customer.name);
    if (cases.length > 0) {
      onSelectCase(cases[0]);
    }
  };

  const handleBack = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">
          {selectedCustomer ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              ← {selectedCustomer.name}
            </button>
          ) : (
            'Customers'
          )}
        </h1>
        <p className="text-muted-foreground">
          {selectedCustomer
            ? `${customerCases.length} active case(s)`
            : `${mockCustomers.length} registered customers`}
        </p>
      </div>

      {/* Search */}
      {!selectedCustomer && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Customer List or Customer Cases */}
      <div className="flex-1 overflow-auto space-y-3">
        {selectedCustomer ? (
          // Show cases for selected customer
          <>
            <Card className="p-4 mb-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedCustomer.phone}
                  </div>
                </div>
                <Badge variant={selectedCustomer.status === 'active' ? 'success' : 'muted'}>
                  {selectedCustomer.status}
                </Badge>
              </div>
            </Card>

            <h3 className="font-medium text-sm text-muted-foreground mb-2">Claims History</h3>

            {customerCases.map((caseItem) => (
              <Card
                key={caseItem.id}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:border-primary/50",
                  selectedCaseId === caseItem.id && "border-primary bg-primary/5"
                )}
                onClick={() => onSelectCase(caseItem)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{caseItem.claimNumber}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {caseItem.claimType} • {caseItem.jurisdiction}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{caseItem.claim.estimatedDamage.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        caseItem.status === 'resolved'
                          ? 'success'
                          : caseItem.status === 'in-review'
                          ? 'warning'
                          : caseItem.status === 'pending'
                          ? 'muted'
                          : 'info'
                      }
                    >
                      {caseItem.caseStage}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))}

            {customerCases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No claims found for this customer</p>
              </div>
            )}
          </>
        ) : (
          // Show customer list
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="p-4 cursor-pointer transition-all hover:border-primary/50"
              onClick={() => handleCustomerClick(customer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{customer.activeClaims} active</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.totalClaims} total claims
                    </p>
                  </div>
                  <Badge variant={customer.status === 'active' ? 'success' : 'muted'}>
                    {customer.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))
        )}

        {!selectedCustomer && filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
