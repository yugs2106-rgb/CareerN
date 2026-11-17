import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { Trash2, Briefcase, FileText, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentApplications() {
  const { applications, withdrawApplication } = useAppContext();
  const { user } = useAuth();
  
  const myApplications = applications.filter(app => app.studentId === user?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Placement Pipeline</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">My Applications & Status</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track submitted applications, recruitment progress, and interview decisions in real time.
          </p>
        </div>

        <Link
          to="/student/internships"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs self-start sm:self-auto shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Explore Open Drives</span>
        </Link>
      </div>
      
      {/* Table Container with safe overflow handling */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[580px]">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Opportunity / Role</th>
                <th className="px-6 py-3.5">Submission Date</th>
                <th className="px-6 py-3.5">Evaluation Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {myApplications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No applications submitted yet</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                        Browse active campus drives and internship listings to submit your profile.
                      </p>
                      <Link
                        to="/student/internships"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
                      >
                        <span>Browse Opportunities</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                myApplications.map(app => (
                  <motion.tr 
                    key={app.id} 
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{app.internshipTitle}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">Application #{app.id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-xs">
                      {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={app.status}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          {getStatusBadge(app.status)}
                        </motion.div>
                      </AnimatePresence>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => withdrawApplication(app.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
