'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, HelpCircle, FileQuestion, Globe, Clock } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Card, CardBody } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const suggestedQuestions = [
    {
        icon: FileQuestion,
        title: 'H-1B Requirements',
        question: 'What are the eligibility requirements for an H-1B visa?',
    },
    {
        icon: Globe,
        title: 'Processing Times',
        question: 'What are the current visa processing times?',
    },
    {
        icon: Clock,
        title: 'Status Check',
        question: 'How can I check my visa application status?',
    },
    {
        icon: HelpCircle,
        title: 'Document Checklist',
        question: 'What documents do I need for a visa interview?',
    },
];

const mockResponses: Record<string, string> = {
    'h-1b': `The H-1B visa is a non-immigrant visa that allows U.S. employers to temporarily employ foreign workers in specialty occupations.

**Eligibility Requirements:**
- A job offer from a U.S. employer for a specialty occupation
- A bachelor's degree or higher (or equivalent) in the specific specialty
- The position must require the theoretical and practical application of a body of specialized knowledge

**Key Points:**
- Annual cap of 65,000 visas (plus 20,000 for advanced degree holders)
- Initial period of stay is 3 years, extendable to 6 years
- Employer must file a Labor Condition Application (LCA)

Would you like more details about any specific aspect of the H-1B process?`,
    'processing': `**Current Visa Processing Times (Estimated):**

| Visa Type | Processing Time |
|-----------|-----------------|
| H-1B | 3-6 months |
| O-1 | 2-3 months |
| EB-2/EB-3 | 12-24 months |
| L-1 | 2-4 months |

**Premium Processing:**
Available for certain visa types at an additional fee of $2,805, guaranteeing a response within 15 business days.

*Note: Processing times vary based on service center workload and case complexity.*`,
    'status': `You can check your visa application status through several methods:

1. **USCIS Online Account**
   - Create an account at my.uscis.gov
   - Track your case with your receipt number

2. **Case Status Online**
   - Visit uscis.gov/casestatus
   - Enter your 13-character receipt number

3. **USCIS Contact Center**
   - Call 1-800-375-5283
   - Available Monday-Friday, 8am-8pm ET

4. **Emma Virtual Assistant**
   - Available 24/7 on the USCIS website

Your receipt number starts with three letters (e.g., EAC, WAC, LIN, SRC) followed by 10 digits.`,
    'documents': `**Essential Documents for Visa Interview:**

**Identity Documents:**
- Valid passport (6+ months validity)
- Previous passports with U.S. visas
- Passport-style photographs

**Application Documents:**
- DS-160 confirmation page
- Appointment confirmation letter
- Receipt number/petition approval notice

**Supporting Documents:**
- Employment verification letter
- Educational credentials
- Financial documents
- Travel itinerary

**Additional (if applicable):**
- Marriage certificate
- Birth certificates for dependents
- Previous visa denial letters

*Tip: Organize documents in a clear folder and bring originals with copies.*`,
    'default': `Thank you for your question! I'm VIA, your Virtual Immigration Assistant.

I can help you with:
- **Visa Types & Requirements** - H-1B, O-1, EB-2, L-1, and more
- **Processing Times** - Current wait times and premium processing
- **Application Status** - How to track your case
- **Document Requirements** - Checklists for various visa types
- **General FAQs** - Common immigration questions

Please feel free to ask me anything about U.S. immigration processes!`,
};

function getAIResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('h-1b') || lowerQuestion.includes('h1b') || lowerQuestion.includes('eligibility')) {
        return mockResponses['h-1b'];
    }
    if (lowerQuestion.includes('processing') || lowerQuestion.includes('time') || lowerQuestion.includes('how long')) {
        return mockResponses['processing'];
    }
    if (lowerQuestion.includes('status') || lowerQuestion.includes('check') || lowerQuestion.includes('track')) {
        return mockResponses['status'];
    }
    if (lowerQuestion.includes('document') || lowerQuestion.includes('interview') || lowerQuestion.includes('checklist')) {
        return mockResponses['documents'];
    }
    return mockResponses['default'];
}

export default function AskVIAPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getAIResponse(messageText),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleNewChat = () => {
        setMessages([]);
        setInput('');
        inputRef.current?.focus();
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-[calc(100vh-var(--header-height)-4rem)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-navy)] flex items-center justify-center shadow-lg">
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-heading text-[var(--primary-navy)]">
                                Ask VIA
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Virtual Immigration Assistant - Your 24/7 visa guide
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        New Chat
                    </button>
                </div>

                {/* Chat Container */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardBody className="flex-1 overflow-y-auto p-6">
                        {messages.length === 0 ? (
                            /* Welcome Screen */
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-navy)] flex items-center justify-center mb-6 shadow-xl">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-heading text-[var(--primary-navy)] mb-2">
                                    Welcome to Ask VIA
                                </h2>
                                <p className="text-gray-500 mb-8 max-w-md">
                                    I&apos;m your Virtual Immigration Assistant. Ask me anything about visa requirements, processing times, application status, and more.
                                </p>
                                
                                {/* Suggested Questions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                                    {suggestedQuestions.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(item.question)}
                                            className="flex items-start gap-3 p-4 text-left rounded-xl border border-gray-200 hover:border-[var(--secondary-blue)] hover:bg-[var(--cream-white)] transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-[var(--info-blue-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--secondary-blue)] transition-colors">
                                                <item.icon className="w-5 h-5 text-[var(--secondary-blue)] group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.question}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Messages */
                            <div className="space-y-8 max-w-4xl mx-auto">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            'flex items-start gap-4',
                                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md',
                                            message.role === 'assistant' 
                                                ? 'bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-navy)]'
                                                : 'bg-[var(--secondary-blue)]'
                                        )}>
                                            {message.role === 'assistant' ? (
                                                <Bot className="w-5 h-5 text-white" />
                                            ) : (
                                                <User className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                'flex-1 max-w-[75%] rounded-2xl px-5 py-4',
                                                message.role === 'user'
                                                    ? 'bg-[var(--primary-navy)] text-white rounded-tr-md ml-auto'
                                                    : 'bg-[var(--gray-50)] border border-gray-200 text-gray-900 rounded-tl-md'
                                            )}
                                        >
                                            <div 
                                                className={cn(
                                                    'prose prose-sm max-w-none leading-relaxed',
                                                    message.role === 'user' && 'prose-invert'
                                                )}
                                                dangerouslySetInnerHTML={{
                                                    __html: message.content
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                        .replace(/\n/g, '<br />')
                                                        .replace(/\|(.*?)\|/g, '<span class="font-mono text-xs">$1</span>')
                                                }}
                                            />
                                            {message.role === 'assistant' && (
                                                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200">
                                                    <button
                                                        onClick={() => handleCopy(message.content, message.id)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                                                        title="Copy response"
                                                    >
                                                        {copiedId === message.id ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <span className="text-xs text-gray-400">
                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--secondary-blue)] to-[var(--primary-navy)] flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="bg-[var(--gray-50)] border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4">
                                            <div className="flex gap-1.5">
                                                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </CardBody>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                        <div className="flex items-end gap-3">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about visas and immigration..."
                                    className="input resize-none min-h-[48px] max-h-[120px] pr-12"
                                    rows={1}
                                    disabled={isTyping}
                                />
                            </div>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isTyping}
                                className={cn(
                                    'btn btn-primary h-12 w-12 p-0 flex items-center justify-center',
                                    (!input.trim() || isTyping) && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            VIA provides general information only. For official guidance, consult USCIS or an immigration attorney.
                        </p>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
}
