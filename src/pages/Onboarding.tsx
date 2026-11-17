import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { 
  CheckCircle2, 
  Upload, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  ShieldCheck,
  Clock,
  FileText,
  Eye,
  AlertCircle,
  FileCheck,
  Lock,
  Download
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { generateSampleLegalPdf } from '../utils/sampleLegalPdf';
import { LegalDocViewerModal } from '../components/LegalDocViewerModal';
import { CompanyVerificationForm } from '../components/CompanyVerificationForm';
import { LegalDocument } from '../types';

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const { registerCompany } = useAppContext();
  const navigate = useNavigate();

  // Student State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const legalFileInputRef = useRef<HTMLInputElement>(null);

  // Legal Doc Preview Modal State
  const [previewDocOpen, setPreviewDocOpen] = useState(false);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);

  const [studentData, setStudentData] = useState({
    phone: '',
    studentId: '',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    batch: '2026',
    graduationYear: '2026',
    profilePhoto: '',
    aboutMe: '',
    careerInterests: '',
    skills: 'React, TypeScript, Python, SQL',
    languages: 'English, Hindi',
    workExperience: '',
    internshipsCompleted: '',
    projects: '',
    certifications: '',
    achievements: '',
    extracurriculars: '',
    cgpa: '8.4',
    semester: '6th Semester'
  });

  // Company State with Legal Registration & Proof PDF
  const defaultSampleCin = 'U72200KA2016PTC098765';
  const [companyData, setCompanyData] = useState({
    companyName: user?.name || 'TechCorp Solutions',
    recruiterName: user?.name ? `${user.name} (HR)` : 'Sarah Connor',
    recruiterDesignation: 'Head of Campus Recruitment & University Relations',
    recruiterPhone: '+91 98765 43210',
    website: 'https://techcorp.com',
    linkedin: 'https://linkedin.com/company/techcorp',
    legalName: user?.name || 'TechCorp Solutions Private Limited',
    displayName: user?.name || 'TechCorp Solutions',
    logo: '',
    industry: 'Enterprise Software & Cloud Systems',
    companySize: '500-1000 employees',
    foundedYear: '2016',
    headquarters: 'Bengaluru, Karnataka, India',
    operatingLocations: 'Bengaluru, Hyderabad, Pune, Remote',
    aboutCompany: 'Global software engineering consultancy specializing in enterprise web applications and scalable cloud architecture.',
    companyCulture: 'Inclusive, innovation-first engineering culture with dedicated mentorship programs for campus recruits.',
    areasOfWork: 'Cloud Systems, Web Applications, Distributed Systems',
    recruiterDepartment: 'University Relations & Talent Acquisition',
    recruiterLinkedin: 'https://linkedin.com/in/sarah-connor-hr',
    // Legitimacy & Legal Verification
    registrationNumber: 'U72200KA2016PTC098765',
    taxIdType: 'CIN' as 'CIN' | 'GSTIN' | 'EIN' | 'LLPIN' | 'Business Reg',
    incorporationDate: '2016-04-12',
    registeredAddress: 'TechCorp Tower, Outer Ring Road, Bellandur, Bengaluru - 560103',
    officialEmailDomain: user?.email?.includes('@') ? user.email.split('@')[1] : 'techcorp.com',
    legalDocument: {
      fileName: 'Certificate_of_Incorporation_MCA.pdf',
      fileType: 'application/pdf',
      fileUrl: generateSampleLegalPdf(user?.name || 'TechCorp Solutions', 'U72200KA2016PTC098765'),
      documentType: 'incorporation_certificate' as const,
      uploadedAt: new Date().toISOString(),
      fileSize: '1.4 MB'
    } as LegalDocument,
    declarationAccepted: true
  });

  // Admin / TPO State
  const [adminData, setAdminData] = useState({
    collegeName: 'National Institute of Technology & Management',
    collegeCode: 'NITM-2026',
    tpoName: user?.name || 'Prof. V. Sharma',
    designation: 'Head, Training & Placement Cell',
    officeEmail: user?.email || 'tpo@college.edu',
    officePhone: '+91 11 2345 6789',
    campusAddress: 'Academic Block A, Placement Wing, Main Campus',
    academicYear: '2025-2026',
    activePrograms: 'B.Tech (CSE, ECE, ME), MCA, M.Tech Data Science'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setStudentData(prev => ({ ...prev, cvUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/extract-cv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStudentData(prev => ({
          ...prev,
          ...data,
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || prev.skills),
          languages: Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || prev.languages)
        }));
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLegalPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setDocUploadError('Only official PDF documents (.pdf) are accepted for legal verification.');
      return;
    }

    setDocUploadError(null);
    const fileSizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyData(prev => ({
        ...prev,
        legalDocument: {
          fileName: file.name,
          fileType: 'application/pdf',
          fileUrl: reader.result as string,
          documentType: prev.legalDocument?.documentType || 'incorporation_certificate',
          uploadedAt: new Date().toISOString(),
          fileSize: fileSizeFormatted
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleLegalPdf = () => {
    setDocUploadError(null);
    const name = companyData.companyName || user?.name || 'TechCorp Solutions';
    const cin = companyData.registrationNumber || defaultSampleCin;
    const sampleUrl = generateSampleLegalPdf(name, cin);

    setCompanyData(prev => ({
      ...prev,
      legalDocument: {
        fileName: `${name.replace(/\s+/g, '_')}_Certificate_of_Incorporation_MCA.pdf`,
        fileType: 'application/pdf',
        fileUrl: sampleUrl,
        documentType: 'incorporation_certificate',
        uploadedAt: new Date().toISOString(),
        fileSize: '1.2 MB'
      }
    }));
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      ...studentData,
      skills: studentData.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    navigate('/');
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyData.legalDocument?.fileUrl) {
      setDocUploadError('Please upload your legal registration proof (PDF) or generate a sample certificate to proceed.');
      return;
    }

    // Register into persistent company registry in AppContext with 'pending' status
    registerCompany({
      userId: user?.id,
      name: companyData.companyName,
      email: user?.email || `recruiter@${companyData.officialEmailDomain || 'company.com'}`,
      website: companyData.website,
      industry: companyData.industry,
      headquarters: companyData.headquarters,
      companySize: companyData.companySize,
      foundedYear: companyData.foundedYear,
      aboutCompany: companyData.aboutCompany,
      registrationNumber: companyData.registrationNumber,
      taxIdType: companyData.taxIdType,
      incorporationDate: companyData.incorporationDate,
      officialEmailDomain: companyData.officialEmailDomain,
      registeredAddress: companyData.registeredAddress,
      legalDocument: companyData.legalDocument,
      recruiterName: companyData.recruiterName,
      recruiterDesignation: companyData.recruiterDesignation,
      recruiterPhone: companyData.recruiterPhone,
      recruiterLinkedin: companyData.recruiterLinkedin
    });

    // Save profile to user session with pending approval status
    completeOnboarding({
      ...companyData,
      approvalStatus: 'pending'
    });

    navigate('/');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      ...adminData
    });
    navigate('/');
  };

  const handleSkipForNow = () => {
    // Complete onboarding with current/default values so user is not blocked
    if (user?.role === 'student') {
      completeOnboarding({
        ...studentData,
        skills: studentData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
    } else if (user?.role === 'company') {
      completeOnboarding({
        ...companyData
      });
    } else {
      completeOnboarding({
        ...adminData
      });
    }
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs">
        
        {/* Onboarding Top Header */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">CareerNexus</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest block">Profile Setup</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSkipForNow}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Complete Later (Skip)</span>
            </button>
          </div>
        </div>

        {/* 1. STUDENT ONBOARDING */}
        {user.role === 'student' && (
          <div className="p-6 sm:p-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Profile Setup</h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Welcome, {user.name}! Add your academic details so employers and campus placement drives can verify your eligibility.
              </p>
            </div>

            {/* AI Auto-Fill via CV */}
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/40 border border-blue-100 dark:border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Auto-Fill from CV</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Upload your PDF resume to automatically populate your profile fields.</p>
                </div>
              </div>

              <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs shrink-0 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Analyzing Resume...' : 'Upload Resume (PDF)'}
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-6">
              {/* Academic Details */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  Academic Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student / Roll Number *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. 21CS048"
                      value={studentData.studentId} 
                      onChange={e => setStudentData({...studentData, studentId: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone Number *</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={studentData.phone} 
                      onChange={e => setStudentData({...studentData, phone: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree / Program *</label>
                    <input 
                      required 
                      type="text" 
                      value={studentData.degree} 
                      onChange={e => setStudentData({...studentData, degree: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Branch *</label>
                    <input 
                      required 
                      type="text" 
                      value={studentData.branch} 
                      onChange={e => setStudentData({...studentData, branch: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Cumulative CGPA</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 8.4"
                      value={studentData.cgpa} 
                      onChange={e => setStudentData({...studentData, cgpa: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                    <input 
                      type="text" 
                      value={studentData.graduationYear} 
                      onChange={e => setStudentData({...studentData, graduationYear: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills and Professional Interests */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  Skills & Summary
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Core Technical Skills (comma separated) *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. React, Node.js, Python, SQL, Docker"
                    value={studentData.skills} 
                    onChange={e => setStudentData({...studentData, skills: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Headline / About Me</label>
                  <textarea 
                    rows={3}
                    placeholder="Brief overview of your academic focus, technical strengths, and career ambitions..."
                    value={studentData.aboutMe} 
                    onChange={e => setStudentData({...studentData, aboutMe: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSkipForNow}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white order-2 sm:order-1"
                >
                  I'll fill the rest later in Settings
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <span>Complete Setup & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. COMPANY ONBOARDING WITH LEGAL PROOF & TPO VERIFICATION */}
        {user.role === 'company' && (
          <div className="p-4 sm:p-8">
            <CompanyVerificationForm onSuccess={() => navigate('/')} />
          </div>
        )}

        {/* 3. ADMIN / TPO ONBOARDING */}
        {user.role === 'admin' && (
          <div className="p-6 sm:p-10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Placement Cell Configuration</h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Configure your institution's Training & Placement Office (TPO) to manage university placement drives.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                  Institutional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">University / College Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={adminData.collegeName} 
                      onChange={e => setAdminData({...adminData, collegeName: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institutional Code</label>
                    <input 
                      type="text" 
                      value={adminData.collegeCode} 
                      onChange={e => setAdminData({...adminData, collegeCode: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">TPO Officer In-Charge *</label>
                    <input 
                      required 
                      type="text" 
                      value={adminData.tpoName} 
                      onChange={e => setAdminData({...adminData, tpoName: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Official TPO Contact Email</label>
                    <input 
                      required 
                      type="email" 
                      value={adminData.officeEmail} 
                      onChange={e => setAdminData({...adminData, officeEmail: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSkipForNow}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white order-2 sm:order-1"
                >
                  Skip for now
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <span>Launch TPO Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Legal Document Preview Modal */}
      {previewDocOpen && companyData.legalDocument && (
        <LegalDocViewerModal
          isOpen={previewDocOpen}
          onClose={() => setPreviewDocOpen(false)}
          document={companyData.legalDocument}
          companyName={companyData.companyName || user?.name || 'Company'}
          registrationNumber={companyData.registrationNumber}
          taxIdType={companyData.taxIdType}
        />
      )}
    </div>
  );
}
