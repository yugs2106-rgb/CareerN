import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Award, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function Noticeboard() {
  const { events } = useAppContext();
  const [activeTab, setActiveTab] = useState<'events' | 'achievements' | 'alumni'>('events');

  const renderIcon = (type: string) => {
    switch(type) {
      case 'event': return <Calendar className="w-5 h-5 text-yellow-500" />;
      case 'update': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'alumni': return <MessageSquare className="w-5 h-5 text-green-500" />;
      default: return <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const filteredEvents = events.filter(e => {
    if (activeTab === 'events') return e.type === 'event' || e.type === 'update';
    if (activeTab === 'achievements') return e.type === 'achievement';
    if (activeTab === 'alumni') return e.type === 'alumni';
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex gap-1.5 w-max flex-wrap">
        <button
          onClick={() => setActiveTab('events')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === 'events' ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          Events & Updates
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === 'achievements' ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
            activeTab === 'alumni' ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          Alumni Messages
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 shadow-xs hover:border-blue-500/40 transition-all">
            <div className="mt-1 shrink-0">{renderIcon(event.type)}</div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{event.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                {format(new Date(event.date), 'MMMM d, yyyy')} &bull; <span className="capitalize">{event.type}</span>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 col-span-2 text-sm p-4">No updates available in this category.</p>
        )}
      </div>
    </div>
  );
}
