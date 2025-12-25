import { useState } from 'react';
import { Send, Sparkles, User, Bot, Eye, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AIDecision, GuardianAlert, AIMode } from '@/types/case';

interface AIChatboxProps {
  auditTrail?: AIDecision[];
  onAuditTrailUpdate?: (decisions: AIDecision[]) => void;
  guardianAlerts?: GuardianAlert[];
  onGuardianAlertsUpdate?: (alerts: GuardianAlert[]) => void;
  guardianMode?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  decision?: AIDecision;
  guardianAlert?: GuardianAlert;
}

const suggestedQuestions = [
  "What's the deadline for this claim?",
  "Show me similar past cases",
  "What documents are missing?",
  "Explain the ICC coverage",
];

export function AIChatbox({
  auditTrail = [],
  onAuditTrailUpdate,
  guardianAlerts = [],
  onGuardianAlertsUpdate,
  guardianMode = false
}: AIChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you with policy questions, claim processing guidance, and compliance requirements. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiModes, setAiModes] = useState<AIMode>({
    witness: true,
    guardian: false,
    whyNot: true,
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with enhanced reasoning
    setTimeout(() => {
      const lowerInput = input.toLowerCase();

      // Base responses with enhanced reasoning
      const responses = {
        deadline: {
          content: "Based on IRDAI regulations, the Proof of Loss must be submitted within 30 days of the loss date (November 15, 2024). This gives you until December 15, 2024. Currently, the submission is incomplete - the sworn statement is missing.",
          appliedRules: ["IRDAI Regulation 5.1 - Proof of Loss Submission", "Section 64VB - Time Limits"],
          excludedRules: [
            { rule: "Emergency Filing Exception", reason: "No emergency conditions present in this case" },
            { rule: "Extended Deadline for Natural Disasters", reason: "Flood occurred in non-restricted zone" },
            { rule: "Administrative Extension", reason: "No prior extension requests filed" }
          ],
          evidence: [
            { source: "IRDAI Guidelines 2023", relevance: 95, excerpt: "Proof of Loss must be filed within 30 days..." },
            { source: "Case CLM-2024-MH-00847", relevance: 100, excerpt: "Loss date: November 15, 2024" }
          ],
          confidence: 98
        },
        similar: {
          content: "I found 3 similar flood insurance cases from Maharashtra in the past 6 months. Average processing time was 18 days with a 92% approval rate. Key factors: proper documentation and timely property verification.",
          appliedRules: ["Historical Case Analysis Protocol", "Regional Pattern Recognition"],
          excludedRules: [
            { rule: "National Average Benchmark", reason: "Maharashtra-specific data more relevant" },
            { rule: "Seasonal Adjustment Factor", reason: "Current period matches historical patterns" },
            { rule: "Economic Impact Modifier", reason: "No significant economic factors detected" }
          ],
          evidence: [
            { source: "Internal Database Query", relevance: 100, excerpt: "3 matching cases found in Maharashtra" },
            { source: "Processing Metrics 2024", relevance: 90, excerpt: "Average 18-day processing time" }
          ],
          confidence: 94
        },
        documents: {
          content: "For claim CLM-2024-MH-00847, the following documents are still needed:\n\n1. Sworn Statement (Critical)\n2. Updated Property Valuation Report\n3. BMC Flood Zone Verification\n\nWould you like me to generate a document request email?",
          appliedRules: ["Document Verification Checklist", "Critical Path Analysis"],
          excludedRules: [
            { rule: "Preliminary Assessment Only", reason: "Full claim processing requires complete documentation" },
            { rule: "Waiver for Minor Claims", reason: "Claim value exceeds waiver threshold" },
            { rule: "Digital Submission Alternative", reason: "Physical verification required for this claim type" }
          ],
          evidence: [
            { source: "Claim CLM-2024-MH-00847", relevance: 100, excerpt: "Missing: Sworn Statement, Valuation Report" },
            { source: "IRDAI Document Requirements", relevance: 95, excerpt: "BMC verification mandatory for flood claims" }
          ],
          confidence: 96
        },
        icc: {
          content: "ICC (Increased Cost of Compliance) coverage provides up to ₹25,00,000 for properties in high-risk flood zones. This covers:\n\n• Elevation costs\n• Demolition if required\n• Reconstruction to current codes\n\nThis property may qualify based on its Zone classification.",
          appliedRules: ["ICC Coverage Guidelines", "Flood Zone Classification"],
          excludedRules: [
            { rule: "Standard Reconstruction Coverage", reason: "ICC provides additional compliance costs" },
            { rule: "Business Interruption Coverage", reason: "No business operations affected" },
            { rule: "Additional Living Expenses", reason: "Property inhabitable, no displacement required" }
          ],
          evidence: [
            { source: "NFIP ICC Guidelines", relevance: 100, excerpt: "Up to $30,000 coverage for compliance costs" },
            { source: "Property Assessment", relevance: 90, excerpt: "Located in high-risk flood zone" }
          ],
          confidence: 92
        }
      };

      let responseData = {
        content: "I understand your query. Based on the current case context (Flood Insurance - Maharashtra), I can provide guidance on IRDAI regulations, claim processing steps, and compliance requirements. Could you please be more specific about what you'd like to know?",
        appliedRules: ["General Query Processing", "Context Awareness"],
        excludedRules: [
          { rule: "Specific Regulation Lookup", reason: "Query lacks specific regulatory reference" },
          { rule: "Document Generation", reason: "No document creation requested" },
          { rule: "Case Comparison", reason: "No comparison criteria specified" }
        ],
        evidence: [
          { source: "Case Context Analysis", relevance: 100, excerpt: "Flood Insurance claim in Maharashtra" },
          { source: "Query Pattern Recognition", relevance: 80, excerpt: "General inquiry detected" }
        ],
        confidence: 85
      };

      if (lowerInput.includes('deadline')) responseData = responses.deadline;
      else if (lowerInput.includes('similar') || lowerInput.includes('past')) responseData = responses.similar;
      else if (lowerInput.includes('document') || lowerInput.includes('missing')) responseData = responses.documents;
      else if (lowerInput.includes('icc') || lowerInput.includes('compliance')) responseData = responses.icc;

      // Create AI Decision for witness mode
      const decision: AIDecision = {
        id: `decision-${Date.now()}`,
        timestamp: new Date(),
        query: input,
        response: responseData.content,
        reasoning: {
          appliedRules: responseData.appliedRules,
          excludedRules: responseData.excludedRules,
          evidence: responseData.evidence
        },
        confidence: responseData.confidence,
        caseContext: {
          caseId: 'CLM-2024-MH-00847',
          claimType: 'Flood Insurance',
          jurisdiction: 'Maharashtra'
        }
      };

      // Add to audit trail if witness mode is enabled
      if (aiModes.witness && onAuditTrailUpdate) {
        onAuditTrailUpdate([...auditTrail, decision]);
      }

      // Check for guardian alerts
      if (guardianMode) {
        const riskPatterns = [
          { pattern: /deadline|overdue/i, risk: 'high' as const, message: 'Urgent deadline approaching' },
          { pattern: /missing|incomplete/i, risk: 'medium' as const, message: 'Missing critical documents detected' },
          { pattern: /compliance|violation/i, risk: 'high' as const, message: 'Compliance risk identified' }
        ];

        const detectedRisk = riskPatterns.find(p => p.pattern.test(input));
        if (detectedRisk && onGuardianAlertsUpdate) {
          const alert: GuardianAlert = {
            id: `alert-${Date.now()}`,
            timestamp: new Date(),
            riskLevel: detectedRisk.risk,
            trigger: input,
            description: detectedRisk.message,
            recommendedAction: 'Review case immediately',
            caseId: 'CLM-2024-MH-00847'
          };
          onGuardianAlertsUpdate([...guardianAlerts, alert]);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.content,
        timestamp: new Date(),
        decision: aiModes.witness ? decision : undefined
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask anything about this case</p>
            </div>
          </div>

          {/* AI Mode Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAiModes(prev => ({ ...prev, witness: !prev.witness }))}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                aiModes.witness
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              title="AI Witness Mode - Records all decisions for audit"
            >
              <Eye className="w-3 h-3" />
              Witness
            </button>
            <button
              onClick={() => setAiModes(prev => ({ ...prev, guardian: !prev.guardian }))}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                aiModes.guardian
                  ? "bg-warning/10 text-warning border border-warning/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              title="Silent Guardian Mode - Monitors for risks"
            >
              <Shield className="w-3 h-3" />
              Guardian
            </button>
            <button
              onClick={() => setAiModes(prev => ({ ...prev, whyNot: !prev.whyNot }))}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                aiModes.whyNot
                  ? "bg-info/10 text-info border border-info/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              title="Why NOT? Engine - Explains rule exclusions"
            >
              <AlertTriangle className="w-3 h-3" />
              Why NOT?
            </button>
          </div>
        </div>

        {/* Guardian Alerts */}
        {guardianAlerts.length > 0 && (
          <div className="mt-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-warning">
                {guardianAlerts.length} Risk{guardianAlerts.length > 1 ? 's' : ''} Detected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === 'user'
                  ? "bg-primary"
                  : "bg-primary/10"
              )}
            >
              {message.role === 'user' ? (
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            <div className="max-w-[85%]">
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* AI Decision Details (Witness Mode) */}
              {message.decision && aiModes.witness && (
                <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AI Decision Audit</span>
                    <Badge variant="outline" className="text-xs">
                      {message.decision.confidence}% confidence
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-muted-foreground">Applied Rules:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {message.decision.reasoning.appliedRules.map((rule, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {aiModes.whyNot && message.decision.reasoning.excludedRules.length > 0 && (
                      <div>
                        <span className="font-medium text-muted-foreground">Why NOT these rules?</span>
                        <div className="mt-1 space-y-1">
                          {message.decision.reasoning.excludedRules.map((exclusion, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded bg-background/50">
                              <span className="font-medium text-destructive text-xs">✗</span>
                              <div>
                                <span className="font-medium">{exclusion.rule}:</span>
                                <span className="text-muted-foreground ml-1">{exclusion.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-muted-foreground">Evidence:</span>
                      <div className="mt-1 space-y-1">
                        {message.decision.reasoning.evidence.map((evidence, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded bg-background/50">
                            <span className="font-medium">{evidence.source}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{evidence.relevance}% relevant</span>
                              <Badge variant="outline" className="text-xs">
                                {evidence.excerpt.substring(0, 30)}...
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedQuestion(q)}
                className="text-xs px-2 py-1 rounded-full border border-border hover:bg-muted transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button size="sm" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
