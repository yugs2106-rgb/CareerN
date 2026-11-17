import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { 
  Building2, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import { LegalDocument, CompanyApprovalStatus } from '../types';
import { generateSampleLegalPdf } from '../utils/sampleLegalPdf';
import { LegalDocViewerModal } from './LegalDocViewerModal';

interface CompanyVerificationFormProps {
  onSuccess?: () => void;
}

export const CompanyVerificationForm: React.FC<CompanyVerificationFormProps> = ({ onSuccess }) => {
  const { user, completeOnboarding, login } = useAuth();
  const { companies, registerCompany } = useAppContext();
  const navigate = useNavigate();

  // Find existing record if any
  const existingCompany = companies.find(
    c =>
      c.id === user?.id ||
      c.userId === user?.id ||
      (user?.email && c.email.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && c.name.toLowerCase() === user.name.toLowerCase()) ||
      (user?.profile?.companyName && c.name.toLowerCase() === user.profile.companyName.toLowerCase())
  );

  const [formData, setFormData] = useState({
    companyName: existingCompany?.name || user?.profile?.companyName || user?.name || '',
    website: existingCompany?.website || 'https://techcorp.com',
    registeredAddress: existingCompany?.registeredAddress || 'Outer Ring Road, Bellandur, Bengaluru - 560103',
    taxIdType: existingCompany?.taxIdType || ('CIN' as const),
    registrationNumber: existingCompany?.registrationNumber || 'U72200KA2016PTC098765',
    incorporationDate: existingCompany?.incorporationDate || '2019-06-15',
    recruiterName: existingCompany?.recruiterName || user?.name || 'Talent Acquisition Team',
    recruiterPhone: existingCompany?.recruiterPhone || '+91 98765 43210',
    industry: existingCompany?.industry || 'Technology & Software Systems',
    companySize: existingCompany?.companySize || '250-500 employees'
  });

  const [legalDoc, setLegalDoc] = useState<LegalDocument | null>(
    existingCompany?.legalDocument || null
  );

  const [declarationAgreed, setDeclarationAgreed] = useState(true);
  const [docError, setDocError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(
    existingCompany?.approvalStatus === 'pending' || existingCompany?.approvalStatus === 'approved'
  );

  // File Upload Handler (Strictly PDF)
  const handlePdfUpload = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setDocError('Please upload a valid PDF document (.pdf). Images or Word documents are not accepted.');
      return;
    }

    setDocError(null);
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLegalDoc({
        fileName: file.name,
        fileType: 'application/pdf',
        fileUrl: reader.result as string,
        documentType: 'incorporation_certificate',
        uploadedAt: new Date().toISOString(),
        fileSize: sizeStr
      });
    };
    reader.readAsDataURL(file);
  };

  // Quick 1-Click Sample PDF Generator for Fast Testing
  const handleUseSampleCertificate = () => {
    setDocError(null);
    const companyName = formData.companyName || 'Verified Corporate Enterprise';
    const cin = formData.registrationNumber || 'U72200KA2016PTC098765';
    const pdfDataUrl = generateSampleLegalPdf(companyName, cin);

    setLegalDoc({
      fileName: `${companyName.replace(/\s+/g, '_')}_Incorporation_Certificate_MCA.pdf`,
      fileType: 'application/pdf',
      fileUrl: pdfDataUrl,
      documentType: 'incorporation_certificate',
      uploadedAt: new Date().toISOString(),
      fileSize: '1.2 MB'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!legalDoc || !legalDoc.fileUrl) {
      setDocError('Uploading your legal registration document (Certificate of Incorporation/GST) is mandatory.');
      return;
    }

    if (!declarationAgreed) {
      setDocError('You must certify the legal accuracy of your organization details.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const email = user?.email || `${formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@company.com`;
      
      const saved = registerCompany({
        userId: user?.id,
        name: formData.companyName,
        email,
        website: formData.website,
        industry: formData.industry,
        headquarters: formData.registeredAddress.split(',')[0] || 'Headquarters',
        companySize: formData.companySize,
        foundedYear: formData.incorporationDate.split('-')[0] || '2020',
        aboutCompany: `Verified campus recruitment partner specializing in ${formData.industry}.`,
        registrationNumber: formData.registrationNumber,
        taxIdType: formData.taxIdType,
        incorporationDate: formData.incorporationDate,
        officialEmailDomain: formData.website.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
        registeredAddress: formData.registeredAddress,
        legalDocument: legalDoc,
        recruiterName: formData.recruiterName,
        recruiterDesignation: 'Campus Hiring Lead',
        recruiterPhone: formData.recruiterPhone
      });

      completeOnboarding({
        companyName: formData.companyName,
        approvalStatus: 'pending' as CompanyApprovalStatus,
        registrationNumber: formData.registrationNumber
      });

      setIsSubmitting(false);
      setSubmissionComplete(true);

      if (onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Context Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Step 1: Mandatory Legal Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Company Accreditation & Legal Proof
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              University placement policy requires all hiring organizations to submit their government certificate of incorporation or tax registration. Placement cell officers review this proof before drives are published to students.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-right">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Logged in as</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate max-w-[180px]">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* If submission is already complete or just submitted */}
      {submissionComplete ? (
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0 mt-1">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Legal Documents Submitted for TPO Review
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  PENDING AUDIT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Your Certificate of Incorporation ({formData.taxIdType}: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{formData.registrationNumber}</span>) for <strong className="text-slate-900 dark:text-white">{formData.companyName}</strong> has been transmitted to the university placement administration.
              </p>
            </div>
          </div>

          {/* Document Summary Card */}
          {legalDoc && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{legalDoc.fileName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PDF Document • {legalDoc.fileSize || '1.2 MB'} • Uploaded {new Date(legalDoc.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Submitted PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Placement officers typically review verification proofs within 24 hours.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSubmissionComplete(false)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Edit & Re-upload Proof
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <span>Proceed to Recruiter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher helper for the user to easily test admin approval */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                Testing the full flow? Switch to the TPO Admin account to approve this company immediately:
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                login('tpo@college.edu', 'admin', 'Prof. V. Sharma (TPO)');
                navigate('/admin');
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 text-xs whitespace-nowrap transition-colors"
            >
              Switch to TPO Admin &rarr;
            </button>
          </div>
        </div>
      ) : (
        /* Redesigned Streamlined Verification Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Corporate Legal Identity (5 Cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Corporate Credentials
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official registrar identity and contact details.
                </p>
              </div>

              {/* Company Legal Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Software Technologies Ltd."
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Official Corporate Website */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Website / Domain *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Registration Type & CIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registration Type *
                  </label>
                  <select
                    value={formData.taxIdType}
                    onChange={e => setFormData({ ...formData, taxIdType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="CIN">CIN (India Corporate ID)</option>
                    <option value="GSTIN">GSTIN (Tax Registration)</option>
                    <option value="LLPIN">LLPIN (Partnership)</option>
                    <option value="Business Reg">Operating License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registration ID / CIN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. U72200KA2016PTC098765"
                    value={formData.registrationNumber}
                    onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Incorporation Date & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Incorporation
                  </label>
                  <input
                    type="date"
                    value={formData.incorporationDate}
                    onChange={e => setFormData({ ...formData, incorporationDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud & AI Systems"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Registered Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Corporate Office Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower 4, Cyber City, Gurugram, Haryana - 122002"
                  value={formData.registeredAddress}
                  onChange={e => setFormData({ ...formData, registeredAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Recruiter Liaison Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recruiter Liaison Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Nair"
                    value={formData.recruiterName}
                    onChange={e => setFormData({ ...formData, recruiterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recruiter Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.recruiterPhone}
                    onChange={e => setFormData({ ...formData, recruiterPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Mandatory PDF Proof Upload (6 Cols) */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Legal Document Proof (PDF)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Certificate of Incorporation, GST, or MCA registration.
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                    Mandatory
                  </span>
                </div>

                {/* Upload Box */}
                <div className="space-y-3">
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handlePdfUpload(file);
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      legalDoc 
                        ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' 
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/30'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfUpload(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {legalDoc ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">
                            {legalDoc.fileName}
                          </p>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ Ready for Verification • {legalDoc.fileSize}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Click or drag another file to replace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Upload Official PDF Document
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Drag & drop or click to browse (PDF only, up to 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fast Test Auto-fill Button */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleUseSampleCertificate}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Generate Sample MCA Certificate (Fast Test)</span>
                    </button>

                    {legalDoc && (
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview PDF</span>
                      </button>
                    )}
                  </div>

                  {/* Validation Error Message */}
                  {docError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{docError}</span>
                    </div>
                  )}
                </div>

                {/* Legal Certification Affirmation */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declarationAgreed}
                      onChange={e => setDeclarationAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                      I certify that the submitted details and registration certificate belong to an active, legally established corporation authorized to hire university graduates.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting Documents...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Legal Proof for TPO Approval</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* PDF VIEWER MODAL */}
      {legalDoc && (
        <LegalDocViewerModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={legalDoc}
          companyName={formData.companyName || 'Corporate Entity'}
          registrationNumber={formData.registrationNumber}
          taxIdType={formData.taxIdType}
        />
      )}
    </div>
  );
};
