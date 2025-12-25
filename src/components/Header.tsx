import { useState } from 'react';
import { Search, Sparkles, RefreshCw, FileText, BookOpen, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { mockCases, mockPolicies } from '@/data/mockData';
import { toast } from 'sonner';

interface HeaderProps {
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onSelectCase?: (caseId: string) => void;
}

export function Header({ isRefreshing, onRefresh, onSelectCase }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSelectCase = (caseId: string) => {
    const selectedCase = mockCases.find((c) => c.id === caseId);
    if (selectedCase && onSelectCase) {
      onSelectCase(caseId);
      toast.success(`Navigated to ${selectedCase.claimNumber}`);
    }
    setSearchOpen(false);
  };

  const handleSelectPolicy = (policyTitle: string) => {
    toast.info(`Opening policy: ${policyTitle}`, {
      description: 'Policy details would open in the Knowledge Panel',
    });
    setSearchOpen(false);
  };

  return (
    <>
      <header className="h-14 flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight">JIT-Knowledge</span>
              <Badge variant="info" className="text-[10px] px-1.5 py-0 font-semibold">AI</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="w-72 h-9 justify-start text-muted-foreground font-normal"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            Search cases, policies...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <NotificationsDropdown />
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search cases, policies, documents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Cases">
            {mockCases.map((caseItem) => (
              <CommandItem
                key={caseItem.id}
                onSelect={() => handleSelectCase(caseItem.id)}
                className="cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">{caseItem.claimNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {caseItem.applicant.name} • {caseItem.claimType}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Policies">
            {mockPolicies.map((policy) => (
              <CommandItem
                key={policy.id}
                onSelect={() => handleSelectPolicy(policy.title)}
                className="cursor-pointer"
              >
                <BookOpen className="w-4 h-4 mr-2 text-success" />
                <div className="flex flex-col">
                  <span className="font-medium">{policy.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {policy.summary}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
