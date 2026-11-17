import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { calculateProfileStrength } from '../../lib/profileUtils';
import { Briefcase, Star, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { internships, applications } = useAppContext();
  
  // Match calculations
  const openInternships = internships.filter(i => i.status === 'open');
  const userSkills = user?.profile?.skills || [];
  
  const matches = openInternships.map(internship => {
    const matchCount = internship.requiredSkills.filter(skill => userSkills.includes(skill)).length;
    const matchPercentage = internship.requiredSkills.length > 0 
      ? Math.round((matchCount / internship.requiredSkills.length) * 100) 
      : 100;
    return { ...internship, matchPercentage };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3); // Top 3

  const { score: profileScore } = calculateProfileStrength(user);

  const myApplications = applications.filter(app => app.studentId === user?.id);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'rejected': return 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800';
      default: return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Here is an overview of your verified profile strength and matching campus placement opportunities.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center min-w-[110px]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Profile Score</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{profileScore}%</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center min-w-[110px]">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Top Match</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{matches[0]?.matchPercentage || 0}%</span>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Column: Top Matches */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Recommended Drives</span>
            </h2>
            <Link to="/student/internships" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3.5 flex-1">
            {matches.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No open internships available right now.</p>
            ) : (
              matches.map(internship => (
                <motion.div key={internship.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Link 
                    to="/student/internships" 
                    className="block group"
                  >
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{internship.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{internship.companyName}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-xs shrink-0">
                          {internship.matchPercentage}% Match
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {internship.requiredSkills.slice(0, 3).map((skill: string, idx: number) => {
                          const hasSkill = userSkills.includes(skill);
                          return (
                            <span 
                              key={idx} 
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${hasSkill ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                        {internship.requiredSkills.length > 3 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            +{internship.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Internship Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Application Status</span>
            </h2>
            <Link to="/student/applications" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {myApplications.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">You haven't applied to any internships yet.</p>
            ) : (
              myApplications.slice(0, 3).map(app => (
                <motion.div whileHover={{ x: 2 }} key={app.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{app.internshipTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.div 
                      key={app.status}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize shadow-xs shrink-0 ${getStatusBadge(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      <span>{app.status}</span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
