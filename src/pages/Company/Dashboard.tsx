import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { calculateMatchScore } from '../../lib/matchUtils';
import { format } from 'date-fns';
import { 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  Lock,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { LegalDocViewerModal } from '../../components/LegalDocViewerModal';
import { CompanyVerificationForm } from '../../components/CompanyVerificationForm';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { 
    internships, 
    applications, 
    students, 
    companies, 
    addInternship, 
    updateApplicationStatus, 
    deleteInternship 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'internships' | 'post' | 'applicants' | 'matches' | 'verification'>('internships');
  const [viewProofOpen, setViewProofOpen] = useState(false);

  // Match registered company details from context
  const matchedCompany = companies.find(
    c => c.id === user?.id || 
         c.userId === user?.id || 
         (user?.email && c.email.toLowerCase() === user.email.toLowerCase()) ||
         (user?.name && c.name.toLowerCase() === user.name.toLowerCase()) ||
         (user?.profile?.companyName && c.name.toLowerCase() === user.profile.companyName.toLowerCase())
  );

  const approvalStatus = matchedCompany?.approvalStatus || user?.companyApprovalStatus || 'pending';
  const isApproved = approvalStatus === 'approved';
  const isPending = approvalStatus === 'pending';
  const isRejected = approvalStatus === 'rejected';

  const myInternships = internships.filter(i => i.companyId === user?.id || i.companyName === user?.name);
  const myInternshipIds = myInternships.map(i => i.id);
  const myApplications = applications.filter(a => a.companyId === user?.id || myInternshipIds.includes(a.internshipId));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    requiredSkills: '',
    preferredSkills: '',
    stipend: '',
    deadline: ''
  });
  
  const [selectedInternshipForMatch, setSelectedInternshipForMatch] = useState<string>('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    addInternship({
      companyId: user.id,
      companyName: user.name,
      title: formData.title,
      description: formData.description,
      eligibility: formData.eligibility,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      stipend: formData.stipend,
      deadline: formData.deadline,
      status: 'open'
    });
    
    setFormData({ title: '', description: '', eligibility: '', requiredSkills: '', preferredSkills: '', stipend: '', deadline: '' });
    setActiveTab('internships');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {user?.name} Recruiter Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Campus placement drives, university relations, and applicant pipeline
          </p>
        </div>

        {matchedCompany?.registrationNumber && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {matchedCompany.taxIdType || 'CIN'}: {matchedCompany.registrationNumber}
            </span>
          </div>
        )}
      </div>

      {/* INSTITUTIONAL VERIFICATION STATUS BANNER */}
      {isPending && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Verification In Review by College Placement Office (TPO)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black">
                  PENDING AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                Your Certificate of Incorporation and registration documents are currently being validated by the Training & Placement Cell to establish company legitimacy. You can prepare internship listings now; they will become visible to students upon approval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-xs whitespace-nowrap transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Review Registration Data</span>
            </button>
            {matchedCompany?.legalDocument && (
              <button
                type="button"
                onClick={() => setViewProofOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 border border-amber-500/30 text-slate-800 dark:text-slate-200 font-bold text-xs whitespace-nowrap transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>View Submitted PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isApproved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Legally Verified Campus Recruiting Partner
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  TPO APPROVED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Your company registration ({matchedCompany?.taxIdType || 'CIN'}: {matchedCompany?.registrationNumber || 'On Record'}) is certified. All internships are actively visible to eligible students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs whitespace-nowrap"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Accreditation Details</span>
            </button>
            {matchedCompany?.legalDocument && (
              <button
                type="button"
                onClick={() => setViewProofOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium text-xs whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>Proof PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isRejected && (
        <div className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">
                  Company Legal Verification Was Not Approved
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                  REJECTED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                <span className="font-semibold text-red-500">Reason: </span>
                {matchedCompany?.rejectionReason || 'Submitted legal documents could not be authenticated against the Ministry of Corporate Affairs / official registry.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs whitespace-nowrap transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resubmit Legal Document</span>
            </button>
            {matchedCompany?.legalDocument && (
              <button
                type="button"
                onClick={() => setViewProofOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-700 dark:text-red-300 font-bold text-xs whitespace-nowrap transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Rejected PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button 
          className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all ${activeTab === 'internships' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => setActiveTab('internships')}
        >
          My Internships
        </button>
        <button 
          className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all ${activeTab === 'post' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => setActiveTab('post')}
        >
          Post New Internship
        </button>
        <button 
          className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all ${activeTab === 'applicants' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => setActiveTab('applicants')}
        >
          Applicants
        </button>
        <button 
          className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all ${activeTab === 'matches' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => setActiveTab('matches')}
        >
          Skill Matches
        </button>
        <button 
          className={`flex items-center gap-1.5 px-4 py-2 font-semibold text-xs rounded-xl transition-all ${activeTab === 'verification' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          onClick={() => setActiveTab('verification')}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Accreditation</span>
          {isApproved && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          )}
          {isPending && (
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          )}
          {isRejected && (
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          )}
        </button>
      </div>

      {activeTab === 'internships' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Deadline</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Applicants</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myInternships.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No internships posted yet.</td></tr>
              ) : (
                myInternships.map(internship => (
                  <tr key={internship.id}>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{internship.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{format(new Date(internship.deadline), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${internship.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {applications.filter(a => a.internshipId === internship.id).length}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => deleteInternship(internship.id)} 
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === 'post' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-2xl">
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internship Title</label>
              <input required type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Eligibility Criteria</label>
              <input required type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="E.g., 3rd year B.Tech CS students" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Required Skills (comma separated)</label>
              <input required type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="React, Node.js" value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Skills (comma separated)</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Statistics, Tableau" value={formData.preferredSkills} onChange={e => setFormData({...formData, preferredSkills: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stipend</label>
                <input required type="text" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. 20,000 / month" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
                <input required type="date" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>
            <div className="pt-4 space-y-3">
              {isPending && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> Your company legal registration is currently under TPO review. This drive will be queued and published to university students once the Placement Cell verifies your legal documents.
                  </span>
                </div>
              )}
              {isRejected && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Posting Disabled:</strong> Your company legal registration was not approved by the Placement Cell. Please re-submit valid registration documents to unlock student placements.
                  </span>
                </div>
              )}
              <button 
                type="submit" 
                disabled={isRejected}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                Post Internship
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'applicants' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Applicant Details</th>
                <th className="px-6 py-3 font-medium">Role Applied</th>
                <th className="px-6 py-3 font-medium">Skills</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myApplications.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No applicants yet.</td></tr>
              ) : (
                myApplications.map(app => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="font-medium text-slate-900 dark:text-white">{app.studentName} {app.age ? `(${app.age})` : ''}</div>
                      {app.collegeName && <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{app.course} • {app.collegeName}</div>}
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applied: {format(new Date(app.appliedAt), 'MMM d, yyyy')}</div>
                      {app.studentCvUrl && <a href={app.studentCvUrl} download="student_resume.pdf" target="_blank" rel="noreferrer" className="text-yellow-600 hover:underline text-xs mt-1 inline-block">View CV</a>}
                      {app.capabilities && (
                        <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm whitespace-pre-wrap">
                          <span className="font-bold block mb-1">What makes you a suitable candidate for this job?:</span>
                          {app.capabilities}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{app.internshipTitle}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {app.studentSkills?.slice(0, 3).map((s, i) => <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{s}</span>)}
                        {(app.studentSkills?.length || 0) > 3 && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">+{app.studentSkills!.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`capitalize font-medium text-sm ${app.status === 'accepted' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button onClick={() => updateApplicationStatus(app.id, 'accepted')} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">Accept</button>
                          <button onClick={() => updateApplicationStatus(app.id, 'rejected')} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Find Best Matches</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Role to Match</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"
                value={selectedInternshipForMatch}
                onChange={e => setSelectedInternshipForMatch(e.target.value)}
              >
                <option value="">-- Select an Internship --</option>
                {myInternships.map(i => (
                  <option key={i.id} value={i.id}>{i.title}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedInternshipForMatch && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white">Suggested Students</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(() => {
                  const internship = myInternships.find(i => i.id === selectedInternshipForMatch);
                  if (!internship) return null;
                  
                  const matches = students
                    .map(student => {
                      const { score, matchedSkills } = calculateMatchScore(student, internship);
                      return { student, score, matchedSkills };
                    })
                    .filter(m => m.score > 0)
                    .sort((a, b) => b.score - a.score);

                  if (matches.length === 0) {
                    return <div className="p-6 text-center text-slate-500 dark:text-slate-400">No matches found for these skills.</div>;
                  }

                  return matches.map((match, idx) => (
                    <div key={match.student.id} className="p-6 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 font-bold flex items-center justify-center text-lg">
                          {match.student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{match.student.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{match.student.profile?.degree} &bull; {match.student.profile?.branch} &bull; CGPA: {match.student.profile?.cgpa}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {internship.requiredSkills.concat(internship.preferredSkills || []).map((skill, i) => {
                              const isMatched = match.matchedSkills.includes(skill);
                              return (
                                <span key={i} className={`text-xs px-2 py-1 rounded-md font-medium border ${isMatched ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                  {skill} {isMatched && '✓'}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-yellow-600">{match.score}%</span>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Match</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-md shadow-sm">View Profile</button>
                          <button className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold rounded-md shadow-sm">Shortlist</button>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <CompanyVerificationForm onSuccess={() => setActiveTab('internships')} />
        </div>
      )}

      {/* Legal Document Proof Viewer Modal */}
      {viewProofOpen && matchedCompany?.legalDocument && (
        <LegalDocViewerModal
          isOpen={viewProofOpen}
          onClose={() => setViewProofOpen(false)}
          document={matchedCompany.legalDocument}
          companyName={matchedCompany.name || user?.name || 'Company'}
          registrationNumber={matchedCompany.registrationNumber}
          taxIdType={matchedCompany.taxIdType}
        />
      )}
    </div>
  );
}
