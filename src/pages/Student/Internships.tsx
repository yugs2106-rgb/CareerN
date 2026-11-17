import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Sparkles, Loader2, Clock, Search, X, ShieldCheck, Building2 } from 'lucide-react';
import ApplicationModal from '../../components/ApplicationModal';

const InternshipCard = ({ internship, user, userSkills, apply, hasApplied, company }: any) => {
  const [matchData, setMatchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnalyze = async () => {
    if (!user || !user.profile) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/match-internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentProfile: user.profile, internship })
      });
      if (res.ok) {
        setMatchData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const matchCount = internship.requiredSkills.filter((skill: string) => userSkills.includes(skill)).length;
  const matchPercentage = internship.requiredSkills.length > 0 ? Math.round((matchCount / internship.requiredSkills.length) * 100) : 100;
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{internship.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-yellow-600 font-bold text-sm">{internship.companyName}</p>
              {company?.approvalStatus === 'approved' && (
                <span 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                  title={`Legally Verified by TPO (${company.taxIdType || 'CIN'}: ${company.registrationNumber || 'Verified'})`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>TPO Verified</span>
                </span>
              )}
            </div>
          </div>
          {userSkills.length > 0 && (
            <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              {matchPercentage}% Match
            </div>
          )}
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">{internship.description}</p>
        
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <p><strong>Stipend:</strong> {internship.stipend}</p>
          <p><strong>Deadline:</strong> {format(new Date(internship.deadline), 'MMM d, yyyy')}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {internship.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
              <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">{skill}</span>
            ))}
            {internship.requiredSkills.length > 3 && <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">+{internship.requiredSkills.length - 3}</span>}
          </div>
        </div>
        
        {/* AI Match Section */}
        <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200 mt-4">
          {!matchData && !isLoading ? (
            <button onClick={handleAnalyze} className="w-full flex items-center justify-center gap-2 text-yellow-600 font-semibold text-sm hover:text-yellow-700 transition-colors">
              <Sparkles className="w-4 h-4" />
              Get AI Match Score
            </button>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 text-yellow-600 font-semibold text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Fit...
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-700 font-bold text-sm">
                  <Sparkles className="w-4 h-4" /> AI Match Score
                </div>
                <div className={`text-lg font-black ${matchData.score > 75 ? 'text-green-600' : matchData.score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {matchData.score}%
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {matchData.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 mt-auto">
        {hasApplied ? (
          <button disabled className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded font-medium cursor-not-allowed">
            Applied
          </button>
        ) : (
          <button onClick={() => apply(internship)} className="w-full py-2 bg-yellow-400 text-black rounded font-medium hover:bg-yellow-500 transition-colors">
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default function StudentInternships() {
  const { internships, applyForInternship, applications, companies } = useAppContext();
  const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_internship_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const termClean = term.trim();
    const updatedSearches = [termClean, ...recentSearches.filter(s => s.toLowerCase() !== termClean.toLowerCase())].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_internship_searches', JSON.stringify(updatedSearches));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveSearch(searchTerm);
    }
  };

  const handleSearchBlur = () => {
    if (searchTerm) {
      saveSearch(searchTerm);
    }
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_internship_searches');
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recent_internship_searches', JSON.stringify(updated));
  };

  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  
  // Protect students by only showing drives from legally approved recruiters
  const openInternships = internships.filter(i => {
    if (i.status !== 'open') return false;
    const matchingCompany = companies.find(
      c => c.id === i.companyId || c.name.toLowerCase() === i.companyName.toLowerCase()
    );
    if (matchingCompany && matchingCompany.approvalStatus !== 'approved') {
      return false;
    }
    return true;
  });

  const userSkills = user?.profile?.skills || [];
  
  const filteredInternships = openInternships.filter(internship => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = (internship.title || '').toLowerCase().includes(term);
    const companyMatch = (internship.companyName || '').toLowerCase().includes(term);
    const descMatch = (internship.description || '').toLowerCase().includes(term);
    const skillsMatch = (internship.requiredSkills || []).some(skill => skill.toLowerCase().includes(term));
    return titleMatch || companyMatch || descMatch || skillsMatch;
  });

  const hasApplied = (internshipId: string) => {
    return applications.some(app => app.internshipId === internshipId && app.studentId === user?.id);
  };

  const handleApplyClick = (internship: any) => {
    if (!user) return;
    
    setSelectedInternship(internship);
  };

  const handleModalApply = (internship: any, formData: any) => {
    if (!user) return;
    
    applyForInternship({
      internshipId: internship.id,
      internshipTitle: internship.title,
      studentId: user.id,
      studentName: formData.name,
      studentSkills: user.profile?.skills,
      studentCvUrl: user.profile?.cvUrl,
      companyId: internship.companyId,
      status: 'pending',
      age: formData.age,
      collegeName: formData.collegeName,
      course: formData.course,
      capabilities: formData.capabilities
    });
    setSelectedInternship(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Discover Internships</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roles, companies, or skills (Press Enter to save)..." 
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSearchBlur}
          />
        </div>
        
        {recentSearches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                Recent Searches
              </div>
              <button 
                onClick={clearSearches} 
                className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchTerm(term);
                    saveSearch(term);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full transition-colors group"
                >
                  {term}
                  <div 
                    onClick={(e) => removeRecentSearch(term, e)} 
                    className="p-0.5 rounded-full hover:bg-slate-300 text-slate-400 hover:text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map(internship => {
          const matchingCompany = companies.find(
            c => c.id === internship.companyId || c.name.toLowerCase() === internship.companyName.toLowerCase()
          );
          return (
            <InternshipCard 
              key={internship.id}
              internship={internship}
              company={matchingCompany}
              user={user}
              userSkills={userSkills}
              apply={handleApplyClick}
              hasApplied={hasApplied(internship.id)}
            />
          );
        })}
        
        {filteredInternships.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            No verified open internships found matching your search.
          </div>
        )}
      </div>

      {selectedInternship && (
        <ApplicationModal
          internship={selectedInternship}
          user={user}
          onClose={() => setSelectedInternship(null)}
          onApply={handleModalApply}
        />
      )}
    </div>
  );
}
