import { useState } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What's the deadline for this claim?",
  "Show me similar past cases",
  "What documents are missing?",
  "Explain the ICC coverage",
];

export function AIChatbox() {
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

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        deadline: "Based on IRDAI regulations, the Proof of Loss must be submitted within 30 days of the loss date (November 15, 2024). This gives you until December 15, 2024. Currently, the submission is incomplete - the sworn statement is missing.",
        similar: "I found 3 similar flood insurance cases from Maharashtra in the past 6 months. Average processing time was 18 days with a 92% approval rate. Key factors: proper documentation and timely property verification.",
        documents: "For claim CLM-2024-MH-00847, the following documents are still needed:\n\n1. Sworn Statement (Critical)\n2. Updated Property Valuation Report\n3. BMC Flood Zone Verification\n\nWould you like me to generate a document request email?",
        icc: "ICC (Increased Cost of Compliance) coverage provides up to ₹25,00,000 for properties in high-risk flood zones. This covers:\n\n• Elevation costs\n• Demolition if required\n• Reconstruction to current codes\n\nThis property may qualify based on its Zone classification.",
      };

      let response = "I understand your query. Based on the current case context (Flood Insurance - Maharashtra), I can provide guidance on IRDAI regulations, claim processing steps, and compliance requirements. Could you please be more specific about what you'd like to know?";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('deadline')) response = responses.deadline;
      else if (lowerInput.includes('similar') || lowerInput.includes('past')) response = responses.similar;
      else if (lowerInput.includes('document') || lowerInput.includes('missing')) response = responses.documents;
      else if (lowerInput.includes('icc') || lowerInput.includes('compliance')) response = responses.icc;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask anything about this case</p>
          </div>
        </div>
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
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
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
