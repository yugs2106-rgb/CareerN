import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  FileText, 
  User, 
  Sparkles, 
  Settings, 
  Bell, 
  LayoutDashboard,
  ArrowRight,
  Command
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const MacCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { internships } = useAppContext();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const isStudent = user?.role === 'student';

  // Mac keyboard listeners: ⌘K or Ctrl+K to toggle, ⌘, for settings, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        if (isStudent) {
          navigate('/student/settings');
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigate, isStudent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Predefined navigational actions
  const actions = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      subtitle: 'Home & active opportunities',
      path: '/',
      icon: LayoutDashboard,
      category: 'Navigation',
    },
    ...(isStudent
      ? [
          {
            id: 'internships',
            title: 'Browse Internships',
            subtitle: 'Explore available placements',
            path: '/student/internships',
            icon: Briefcase,
            category: 'Navigation',
          },
          {
            id: 'applications',
            title: 'My Applications',
            subtitle: 'View status & applied drives',
            path: '/student/applications',
            icon: FileText,
            category: 'Navigation',
          },
          {
            id: 'assistant',
            title: 'AI Placement Assistant',
            subtitle: 'Resume review & interview preparation',
            path: '/student/assistant',
            icon: Sparkles,
            category: 'AI Tools',
          },
          {
            id: 'profile',
            title: 'Student Profile',
            subtitle: 'Manage bio, skills, CGPA & resume',
            path: '/student/profile',
            icon: User,
            category: 'Account',
          },
          {
            id: 'settings',
            title: 'Preferences & Settings',
            subtitle: 'Theme, security & notifications (⌘,)',
            path: '/student/settings',
            icon: Settings,
            category: 'Account',
          },
        ]
      : []),
    {
      id: 'notices',
      title: 'Placement Noticeboard',
      subtitle: 'Campus drives, news & results',
      path: '/notices',
      icon: Bell,
      category: 'Campus',
    },
  ];

  // Filter actions
  const filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Filter internships for direct search jump
  const filteredInternships = query.trim()
    ? internships
        .filter(
          (i) =>
            i.title.toLowerCase().includes(query.toLowerCase()) ||
            i.companyName.toLowerCase().includes(query.toLowerCase()) ||
            i.requiredSkills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const totalItems = filteredActions.length + filteredInternships.length;

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredActions.length) {
        handleSelect(filteredActions[selectedIndex].path);
      } else {
        handleSelect('/student/internships');
      }
    }
  };

  return (
    <>
      {/* Quick Access Keyboard Trigger in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-medium transition cursor-pointer"
        title="Open Spotlight Search (⌘K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Quick search</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Spotlight Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownNav}
                placeholder="Search pages, internships, skills..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-400 uppercase">
                ESC to close
              </span>
            </div>

            {/* Results Section */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Navigation Items */}
              {filteredActions.length > 0 && (
                <div className="py-1">
                  <p className="px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Navigation</p>
                  {filteredActions.map((action, index) => {
                    const Icon = action.icon;
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={action.id}
                        onClick={() => handleSelect(action.path)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 font-medium'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="leading-tight">{action.title}</p>
                            <p className={`text-xs ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>{action.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Direct Internship Matches */}
              {filteredInternships.length > 0 && (
                <div className="py-1">
                  <p className="px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Internship Listings</p>
                  {filteredInternships.map((internship, i) => {
                    const currentIndex = filteredActions.length + i;
                    const isSelected = selectedIndex === currentIndex;
                    return (
                      <div
                        key={internship.id}
                        onClick={() => handleSelect('/student/internships')}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 font-medium'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-black/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="leading-tight">{internship.title}</p>
                            <p className={`text-xs ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>
                              {internship.companyName} • {internship.stipend}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-slate-950 font-bold' : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400'}`}>
                          Apply
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalItems === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No matching actions or internships found for "{query}".
                </div>
              )}
            </div>

            {/* Mac-style Footer Hints */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">↑</kbd>
                  <kbd className="px-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">↵</kbd> select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">⌘,</kbd> Settings
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
