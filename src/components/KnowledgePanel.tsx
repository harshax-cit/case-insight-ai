import { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  AlertTriangle,
  FileText,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle2,
  Zap,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Eye
} from 'lucide-react';
import { PolicyResult, ComplianceAlert, CaseData, GuardianAlert, AIDecision } from '@/types/case';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AIChatbox } from '@/components/AIChatbox';
import { AuditTrail } from '@/components/AuditTrail';
import { cn } from '@/lib/utils';

interface KnowledgePanelProps {
  policies: PolicyResult[];
  alerts: ComplianceAlert[];
  caseData: CaseData;
  isLoading?: boolean;
  guardianAlerts?: GuardianAlert[];
  onGuardianModeToggle?: (enabled: boolean) => void;
  guardianMode?: boolean;
  auditTrail?: AIDecision[];
  onAuditTrailUpdate?: (decisions: AIDecision[]) => void;
  onGuardianAlertsUpdate?: (alerts: GuardianAlert[]) => void;
}

const typeConfig = {
  regulation: { icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
  sop: { icon: BookOpen, color: 'text-success', bg: 'bg-success/10' },
  guideline: { icon: FileText, color: 'text-info', bg: 'bg-info/10' },
  alert: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
};

const severityConfig = {
  info: { icon: CheckCircle2, variant: 'info' as const, color: 'border-info' },
  warning: { icon: AlertTriangle, variant: 'warning' as const, color: 'border-warning' },
  critical: { icon: AlertTriangle, variant: 'destructive' as const, color: 'border-destructive' },
};

export function KnowledgePanel({ policies, alerts, caseData, isLoading, guardianAlerts = [], onGuardianModeToggle, guardianMode = false, auditTrail = [], onAuditTrailUpdate, onGuardianAlertsUpdate }: KnowledgePanelProps) {
  const [selectedCitation, setSelectedCitation] = useState<PolicyResult | null>(null);
  const [activeTab, setActiveTab] = useState('policies');

  const contextTokens = Array.from(
    new Set(
      [caseData.claimType, caseData.jurisdiction, caseData.caseStage]
        .flatMap((s) => s.toLowerCase().split(/[^a-z0-9]+/g))
        .filter(Boolean)
    )
  );

  const matchesContext = (text: string) => {
    const hay = text.toLowerCase();
    return contextTokens.some((t) => hay.includes(t));
  };

  const filteredPolicies = policies.filter((p) =>
    matchesContext(`${p.title} ${p.summary} ${p.tags.join(' ')}`)
  );

  const filteredAlerts = alerts.filter((a) =>
    matchesContext(`${a.title} ${a.description} ${a.citation.document}`)
  );

  const criticalAlerts = filteredAlerts.filter((a) => a.severity === 'critical');

  return (
    <>
      <div className="w-88 min-w-[320px] max-w-[400px] border-l border-border bg-card flex flex-col h-full flex-shrink-0">
        {/* Panel Header */}
        <div className="p-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-base">AI Knowledge Assistant</h2>
                <p className="text-xs text-muted-foreground">Context-aware guidance</p>
              </div>
            </div>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] text-success bg-success/10 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Connected
              </div>
            )}
          </div>

          {/* Context Chips */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px] h-6">
              <FileText className="w-3 h-3 mr-1" />
              {caseData.claimType}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-6">
              <Shield className="w-3 h-3 mr-1" />
              {caseData.jurisdiction}
            </Badge>
            <Badge variant="outline" className="text-[10px] h-6">
              <Clock className="w-3 h-3 mr-1" />
              {caseData.caseStage}
            </Badge>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {criticalAlerts.length > 0 && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-destructive">
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
                </p>
                <p className="text-[11px] text-destructive/80 mt-0.5">
                  {criticalAlerts[0].title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Mode Toggle */}
        {onGuardianModeToggle && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold">Silent Guardian Mode</p>
                  <p className="text-[11px] text-muted-foreground">AI monitors for risks passively</p>
                </div>
              </div>
              <button
                onClick={() => onGuardianModeToggle(!guardianMode)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  guardianMode ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    guardianMode ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        )}

        {/* Guardian Alerts */}
        {guardianAlerts.length > 0 && (
          <div className="mx-3 mt-3 space-y-2">
            {guardianAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-xl border",
                  alert.riskLevel === 'critical' ? "bg-destructive/10 border-destructive/30" :
                  alert.riskLevel === 'high' ? "bg-warning/10 border-warning/30" :
                  "bg-info/10 border-info/30"
                )}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={cn(
                    "w-4 h-4 mt-0.5 flex-shrink-0",
                    alert.riskLevel === 'critical' ? "text-destructive" :
                    alert.riskLevel === 'high' ? "text-warning" : "text-info"
                  )} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={
                        alert.riskLevel === 'critical' ? 'destructive' :
                        alert.riskLevel === 'high' ? 'default' : 'secondary'
                      } className="text-xs">
                        {alert.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium">{alert.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{alert.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-3 mt-3 mb-2 h-9 grid grid-cols-4">
            <TabsTrigger value="policies" className="text-xs">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="alerts" className="relative text-xs">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Alerts
              {filteredAlerts.length > 0 && (
                <span className="ml-1.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                  {filteredAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="flex-1 overflow-auto px-3 pb-3 mt-0">
            {filteredPolicies.length > 0 ? (
              <div className="space-y-2.5">
                {filteredPolicies.map((policy, index) => {
                  const config = typeConfig[policy.type];
                  const Icon = config.icon;

                  return (
                    <Card
                      key={policy.id}
                      className="knowledge-card animate-slide-in-up cursor-pointer p-3"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedCitation(policy)}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-medium text-xs leading-tight">{policy.title}</h3>
                            <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                              <TrendingUp className="w-3 h-3" />
                              {policy.relevanceScore}%
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">
                            {policy.summary}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCitation(policy);
                              }}
                            >
                              <FileText className="w-3 h-3" />
                              Page {policy.citation.page}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                            {policy.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[9px] py-0 h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No matching policies</p>
                <p className="text-xs mt-1">Try another case to see relevant guidance.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 overflow-auto px-3 pb-3 mt-0">
            {filteredAlerts.length > 0 ? (
              <div className="space-y-2.5">
                {filteredAlerts.map((alert, index) => {
                  const config = severityConfig[alert.severity];
                  const Icon = config.icon;

                  return (
                    <Card
                      key={alert.id}
                      className={`p-3 animate-slide-in-up border-l-4 ${config.color}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            alert.severity === 'critical'
                              ? 'bg-destructive/10'
                              : alert.severity === 'warning'
                                ? 'bg-warning/10'
                                : 'bg-info/10'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              alert.severity === 'critical'
                                ? 'text-destructive'
                                : alert.severity === 'warning'
                                  ? 'text-warning'
                                  : 'text-info'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={config.variant} className="text-[9px] h-4">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-xs mb-1">{alert.title}</h3>
                          <p className="text-[11px] text-muted-foreground mb-2">{alert.description}</p>
                          {alert.actionRequired && (
                            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/50 mt-2">
                              <Zap className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-[11px] font-medium">{alert.actionRequired}</p>
                            </div>
                          )}
                          <button className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium mt-2">
                            <FileText className="w-3 h-3" />
                            {alert.citation.document}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No matching alerts</p>
                <p className="text-xs mt-1">This case has no context-specific alerts.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
            <AIChatbox
              auditTrail={auditTrail}
              onAuditTrailUpdate={onAuditTrailUpdate}
              guardianAlerts={guardianAlerts}
              onGuardianAlertsUpdate={onGuardianAlertsUpdate}
              guardianMode={guardianMode}
            />
          </TabsContent>

          <TabsContent value="audit" className="flex-1 overflow-hidden mt-0 px-3 pb-3">
            <AuditTrail decisions={auditTrail} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="p-2.5 border-t border-border bg-muted/30">
          <p className="text-[10px] text-center text-muted-foreground">
            Powered by RAG • {filteredPolicies.length} policies • Updated just now
          </p>
        </div>
      </div>

      {/* Citation Modal */}
      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-primary" />
              Source Citation
            </DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <h3 className="font-semibold text-sm mb-2">{selectedCitation.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedCitation.summary}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Document</p>
                  <p className="font-medium text-sm">{selectedCitation.citation.document}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Section</p>
                  <p className="font-medium text-sm">{selectedCitation.citation.section}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Page Number</p>
                  <p className="font-medium text-sm">{selectedCitation.citation.page}</p>
                </div>
                {selectedCitation.citation.paragraph && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Paragraph</p>
                    <p className="font-medium text-sm">{selectedCitation.citation.paragraph}</p>
                  </div>
                )}
              </div>

              {selectedCitation.effectiveDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Effective:</span>
                  <span className="font-medium">{selectedCitation.effectiveDate}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <div className="flex gap-1.5">
                  {selectedCitation.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex-1" />
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Open Full Document
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
