import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIAssistantWidget() {
  const { user } = useAuth();
  const { internships, events } = useAppContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am your AI Career Assistant. Ask me about your profile, career gap, or available internships!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!user || user.role !== 'student') return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          studentProfile: user.profile,
          context: {
            availableInternships: internships.filter(i => i.status === 'open'),
            upcomingEvents: events
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-transform hover:scale-105 z-50",
          "bg-black text-white",
          isOpen ? "translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50 transition-all origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-black rounded-t-2xl flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold">AI Career Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white dark:bg-slate-900/20 p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                msg.role === 'user' ? "bg-yellow-400 text-black rounded-tr-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm whitespace-pre-wrap"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-b-2xl flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Ask about your profile or internships..." 
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
