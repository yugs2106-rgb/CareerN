import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Eye, 
  Download, 
  Search, 
  Filter, 
  ExternalLink, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  AlertCircle,
  Plus,
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';
import { LegalDocViewerModal } from '../../components/LegalDocViewerModal';
import { RegisteredCompany, LegalDocument, CompanyApprovalStatus } from '../../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { 
    events, 
    addEvent, 
    internships, 
    companies, 
    approveCompany, 
    rejectCompany 
  } = useAppContext();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'verification' | 'directory' | 'internships' | 'events'>('verification');

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Legal Doc Modal state
  const [selectedDoc, setSelectedDoc] = useState<{
    doc: LegalDocument;
    companyName: string;
    regNumber?: string;
    taxType?: string;
  } | null>(null);

  // Reject Reason Modal state
  const [rejectingCompanyId, setRejectingCompanyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Submitted legal certificate does not match registrar records.');

  // Immediate action feedback toast
  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'reject';
    companyName: string;
    message: string;
  } | null>(null);

  // Notice/Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    type: 'event' as 'event' | 'update' | 'achievement' | 'alumni'
  });

  // Derived counts
  const pendingCompanies = companies.filter(c => c.approvalStatus === 'pending');
  const approvedCompanies = companies.filter(c => c.approvalStatus === 'approved');
  const rejectedCompanies = companies.filter(c => c.approvalStatus === 'rejected');

  const filteredCompanies = companies.filter(c => {
    // Status filter
    if (statusFilter !== 'all' && c.approvalStatus !== statusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCin = (c.registrationNumber || '').toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchRecruiter = (c.recruiterName || '').toLowerCase().includes(q);
      return matchName || matchCin || matchEmail || matchRecruiter;
    }
    return true;
  });

  const handleApprove = (companyId: string, companyName: string) => {
    approveCompany(companyId, `Approved by Placement Officer ${user?.name || 'TPO'} on ${new Date().toLocaleDateString()}`);
    setActionNotice({
      type: 'success',
      companyName,
      message: `${companyName} has been approved and authorized for campus recruitment drives.`
    });
    setTimeout(() => {
      setActionNotice(null);
    }, 6000);
  };

  const handleConfirmReject = () => {
    if (!rejectingCompanyId) return;
    const targetComp = companies.find(c => c.id === rejectingCompanyId);
    const cName = targetComp?.name || 'Company';
    rejectCompany(rejectingCompanyId, rejectReason);
    setRejectingCompanyId(null);
    setActionNotice({
      type: 'reject',
      companyName: cName,
      message: `Registration for ${cName} was rejected. Feedback recorded in institutional audit log.`
    });
    setRejectReason('Submitted legal certificate does not match registrar records.');
    setTimeout(() => {
      setActionNotice(null);
    }, 6000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(eventForm);
    setEventForm({ title: '', description: '', date: '', type: 'event' });
  };

  const downloadPdf = (doc: LegalDocument) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName || 'Legal_Registration_Document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider">
              Training & Placement Cell
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• Institutional Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Placement Administration & Employer Verification
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Verify corporate legal registrations, approve visiting campus recruiters, and audit placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">TPO In-Charge</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{user?.name || 'Prof. Placement Head'}</p>
          </div>
        </div>
      </div>

      {/* Immediate Action Toast / Alert Banner */}
      {actionNotice && (
        <div 
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              actionNotice.type === 'success' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
            }`}>
              {actionNotice.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-bold text-sm text-white">{actionNotice.companyName}</p>
              <p className="text-xs opacity-90">{actionNotice.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' && (
              <button
                type="button"
                onClick={() => { setActiveTab('directory'); setStatusFilter('approved'); }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                View in Directory
              </button>
            )}
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { setActiveTab('verification'); setStatusFilter('pending'); }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'pending' && activeTab === 'verification'
              ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400/50 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending Legal Reviews
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingCompanies.length > 0 ? 'bg-amber-500 text-black animate-pulse' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{pendingCompanies.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {pendingCompanies.length === 0 ? 'All employers reviewed' : 'Action required to unlock drives'}
          </p>
        </div>

        <div 
          onClick={() => { setActiveTab('verification'); setStatusFilter('approved'); }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'approved' && activeTab === 'verification'
              ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Verified Employers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{approvedCompanies.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Certified entities authorized to hire
          </p>
        </div>

        <div 
          onClick={() => { setActiveTab('verification'); setStatusFilter('rejected'); }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'rejected' && activeTab === 'verification'
              ? 'bg-rose-500/15 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400/50 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Rejected / Non-Compliant
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{rejectedCompanies.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Failed legal registration validation
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('internships')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'internships'
              ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400/50 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Campus Drives
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{internships.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active internships in pipeline
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'verification'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Employer Legal Verification</span>
          {pendingCompanies.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'verification' ? 'bg-white text-blue-700' : 'bg-amber-500 text-black'
            }`}>
              {pendingCompanies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Verified Employers Directory ({approvedCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('internships')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'internships'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Placement Drives Audit ({internships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Placement Notice Board ({events.length})</span>
        </button>
      </div>

      {/* TAB 1: EMPLOYER LEGAL VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name, CIN, or recruiter..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Filter:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All ({companies.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review ({pendingCompanies.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approved ({approvedCompanies.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Rejected ({rejectedCompanies.length})</span>
              </button>
            </div>
          </div>

          {/* Companies List */}
          {filteredCompanies.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Companies Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No company registrations match your active filter or search query.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCompanies.map(company => {
                const isPending = company.approvalStatus === 'pending';
                const isApproved = company.approvalStatus === 'approved';
                const isRejected = company.approvalStatus === 'rejected';

                return (
                  <div 
                    key={company.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 sm:p-6 shadow-sm ${
                      isPending 
                        ? 'border-amber-400/50 dark:border-amber-500/40 bg-amber-500/[0.02]' 
                        : isApproved 
                          ? 'border-slate-200 dark:border-slate-800' 
                          : 'border-red-300 dark:border-red-900/50 bg-red-500/[0.02]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      
                      {/* Left: Company Identity & Legal Details */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-yellow-400 font-bold text-base shrink-0">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                {company.name}
                              </h3>
                              {/* Status Badge */}
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                                  <Clock className="w-3 h-3" /> PENDING TPO APPROVAL
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" /> VERIFIED & APPROVED
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                                  <XCircle className="w-3 h-3" /> REJECTED / UNVERIFIED
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {company.industry} • {company.headquarters || 'India'} • {company.companySize || 'Corporate'}
                            </p>
                          </div>
                        </div>

                        {/* Government Registration & Verification Data Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              {company.taxIdType || 'CIN'} Registration No.
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-yellow-400 text-[11px] block mt-0.5">
                              {company.registrationNumber || 'Not provided'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Incorporated
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px] block mt-0.5">
                              {company.incorporationDate ? new Date(company.incorporationDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Official Website & Domain
                            </span>
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noreferrer"
                              className="font-medium text-blue-600 dark:text-blue-400 text-[11px] flex items-center gap-1 hover:underline mt-0.5 truncate"
                            >
                              <span className="truncate">{company.website?.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>
                        </div>

                        {/* Registered Office & Recruiter Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Registered Office: </span>
                            <span>{company.registeredAddress || 'Registered Office Address on File'}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Liaison Recruiter: </span>
                            <span>{company.recruiterName || 'HR Lead'} ({company.recruiterDesignation || 'Campus Lead'}) • {company.recruiterPhone || company.email}</span>
                          </div>
                        </div>

                        {/* Rejection notice if applicable */}
                        {isRejected && company.rejectionReason && (
                          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                            <div>
                              <span className="font-bold text-red-400">Rejection Reason recorded by TPO: </span>
                              <span>{company.rejectionReason}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Legal Document & Actions Box */}
                      <div className="w-full lg:w-80 flex flex-col justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shrink-0">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-yellow-500" />
                              Legal Proof Document
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              PDF Certified
                            </span>
                          </div>

                          {company.legalDocument ? (
                            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {company.legalDocument.fileName || 'Incorporation_Certificate.pdf'}
                                  </p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {company.legalDocument.fileSize || '1.2 MB'} • {company.legalDocument.documentType?.replace('_', ' ') || 'Incorporation Certificate'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDoc({
                                    doc: company.legalDocument!,
                                    companyName: company.name,
                                    regNumber: company.registrationNumber,
                                    taxType: company.taxIdType
                                  })}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs transition-colors shadow-sm"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Proof PDF</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadPdf(company.legalDocument!)}
                                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                  title="Download Original PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 text-center">
                              No legal PDF attached
                            </div>
                          )}
                        </div>

                        {/* Action Buttons for TPO */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                          {isPending && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(company.id, company.name)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Approve & Authorize</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingCompanyId(company.id);
                                }}
                                className="px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-600 dark:text-red-400 font-bold text-xs transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {isApproved && (
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Authorized for Placements
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingCompanyId(company.id);
                                }}
                                className="text-[10px] text-slate-400 hover:text-red-400 underline font-medium"
                              >
                                Revoke Approval
                              </button>
                            </div>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => handleApprove(company.id, company.name)}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
                              <span>Re-evaluate & Approve</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERIFIED EMPLOYERS DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Official Campus Recruiting Partners ({approvedCompanies.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All listed employers below have been legally verified by the Training & Placement Cell. Their placement drives are certified and open for student applications.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Company & Registration</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Headquarters</th>
                    <th className="px-4 py-3">Authorized Liaison</th>
                    <th className="px-4 py-3">Legal Proof</th>
                    <th className="px-4 py-3 text-right">Placement Drives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {approvedCompanies.map(c => {
                    const companyDrives = internships.filter(i => i.companyId === c.id || i.companyName === c.name);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-500 font-bold flex items-center justify-center shrink-0">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-xs">{c.name}</p>
                              <p className="font-mono text-[10px] text-slate-400">
                                {c.taxIdType || 'CIN'}: {c.registrationNumber || 'Verified'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{c.industry}</td>
                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{c.headquarters}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-slate-900 dark:text-white">{c.recruiterName || 'HR Lead'}</p>
                          <p className="text-[10px] text-slate-400">{c.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          {c.legalDocument ? (
                            <button
                              type="button"
                              onClick={() => setSelectedDoc({
                                doc: c.legalDocument!,
                                companyName: c.name,
                                regNumber: c.registrationNumber,
                                taxType: c.taxIdType
                              })}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-500 hover:text-yellow-400 underline"
                            >
                              <FileText className="w-3 h-3" /> View Certificate
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">On Record</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {companyDrives.length} drives
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLACEMENT DRIVES AUDIT */}
      {activeTab === 'internships' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Active Placement Drives ({internships.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              All active job & internship listings published by verified recruiting partners.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Role Title</th>
                    <th className="px-4 py-3">Employer</th>
                    <th className="px-4 py-3">Stipend</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {internships.map(i => (
                    <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{i.title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{i.companyName}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{i.stipend}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Date(i.deadline).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          {i.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLACEMENT NOTICES & ANNOUNCEMENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-yellow-400" /> Post Placement Notice
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Broadcast orientation sessions, drive schedules, or eligibility notices to students.
            </p>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Title *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Google Cloud Placement Drive: Pre-Talk"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-400" 
                  value={eventForm.title} 
                  onChange={e => setEventForm({...eventForm, title: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Details & Schedule *</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Full description, venue, links, or instructions..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-400" 
                  value={eventForm.description} 
                  onChange={e => setEventForm({...eventForm, description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Date *</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-400" 
                    value={eventForm.date} 
                    onChange={e => setEventForm({...eventForm, date: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-400" 
                    value={eventForm.type} 
                    onChange={e => setEventForm({...eventForm, type: e.target.value as any})}
                  >
                    <option value="event">Campus Event</option>
                    <option value="update">Drive Update</option>
                    <option value="achievement">Placement Achievement</option>
                    <option value="alumni">Alumni Session</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-xs hover:bg-yellow-500 transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Placement Announcements</h3>
            {events.length === 0 ? (
              <p className="text-xs text-slate-400 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                No active notices posted yet.
              </p>
            ) : (
              events.map((ev, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-500 font-bold text-[10px] uppercase">
                        {ev.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(ev.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{ev.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingCompanyId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Company Registration</h3>
                <p className="text-xs text-slate-400">Specify reason to be saved in institutional audit records.</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-300">Rejection Reason</label>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-400 mb-2"
              >
                <option value="Submitted legal certificate does not match registrar records.">
                  Registration certificate does not match MCA/Government records
                </option>
                <option value="Corporate Identification Number (CIN) could not be verified.">
                  Corporate Identification Number (CIN / GSTIN) invalid or unverified
                </option>
                <option value="Legal proof document is illegible, incomplete, or expired.">
                  Legal proof document is illegible, incomplete, or expired
                </option>
                <option value="Corporate domain could not be validated for authorized recruiter.">
                  Corporate domain could not be validated for authorized recruiter
                </option>
                <option value="Organization is not authorized for campus placement recruitment.">
                  Organization is not authorized for campus placement recruitment
                </option>
              </select>

              <textarea 
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Additional notes for the employer..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingCompanyId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEGAL DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <LegalDocViewerModal
          isOpen={true}
          onClose={() => setSelectedDoc(null)}
          document={selectedDoc.doc}
          companyName={selectedDoc.companyName}
          registrationNumber={selectedDoc.regNumber}
          taxIdType={selectedDoc.taxType}
        />
      )}
    </div>
  );
}
