import { useState } from 'react';
import { Eye, ChevronDown, ChevronRight, Clock, FileText, AlertTriangle } from 'lucide-react';
import { AIDecision } from '@/types/case';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuditTrailProps {
  decisions: AIDecision[];
  className?: string;
}

export function AuditTrail({ decisions, className }: AuditTrailProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (decisions.length === 0) {
    return (
      <div className={cn("p-6 text-center text-muted-foreground", className)}>
        <Eye className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">No AI decisions recorded yet</p>
        <p className="text-xs mt-1">Enable Witness mode to start logging AI decisions</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">AI Decision Audit Trail</h3>
        <Badge variant="outline" className="text-xs">
          {decisions.length} decision{decisions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-2 max-h-96 overflow-auto">
        {decisions.slice().reverse().map((decision) => {
          const isExpanded = expandedItems.has(decision.id);

          return (
            <Card key={decision.id} className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(decision.id)}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {decision.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <Badge
                      variant={decision.confidence >= 90 ? 'default' : decision.confidence >= 80 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {decision.confidence}% confidence
                    </Badge>
                  </div>

                  <div className="ml-8">
                    <p className="text-sm font-medium mb-1">Query: {decision.query}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {decision.response}
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 ml-8 space-y-3 border-t border-border pt-3">
                  <div>
                    <h4 className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Applied Rules
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {decision.reasoning.appliedRules.map((rule, i) => (
                        <Badge key={i} variant="default" className="text-xs">
                          {rule}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {decision.reasoning.excludedRules.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Why NOT These Rules?
                      </h4>
                      <div className="space-y-2">
                        {decision.reasoning.excludedRules.map((exclusion, i) => (
                          <div key={i} className="p-2 rounded bg-muted/50">
                            <div className="flex items-start gap-2">
                              <span className="text-destructive text-xs font-bold">✗</span>
                              <div>
                                <span className="text-xs font-medium">{exclusion.rule}:</span>
                                <span className="text-xs text-muted-foreground ml-1">{exclusion.reason}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-info mb-2">Evidence</h4>
                    <div className="space-y-1">
                      {decision.reasoning.evidence.map((evidence, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                          <span className="text-xs font-medium">{evidence.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{evidence.relevance}% relevant</span>
                            <Badge variant="outline" className="text-xs">
                              {evidence.excerpt.substring(0, 25)}...
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}