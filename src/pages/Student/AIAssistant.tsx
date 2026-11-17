import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const { internships, events } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I am your AI Career Assistant. Ask me about your profile, career gap, or let's find some great internships together!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoadingChat || !user) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoadingChat(true);

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
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">AI Career & Placement Advisor</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini AI • Contextual to your student profile</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ready
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60 dark:bg-slate-950/40">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-xs font-medium' 
                : 'bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoadingChat && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Analyzing opportunities and crafting response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-6 py-2 bg-slate-50/60 dark:bg-slate-950/40 flex flex-wrap gap-2">
          {[
            "Review my skills for Software Engineering roles",
            "Which companies have open drives right now?",
            "How do I prepare for technical interviews?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
        <input 
          type="text" 
          placeholder="Ask anything about roles, resumes, skill gaps, or interview prep..." 
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoadingChat}
          className="px-4 py-2.5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 transition-colors shrink-0 font-semibold text-sm shadow-xs"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
