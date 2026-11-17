import React from 'react';
import { X, FileText, Download, ShieldCheck, Calendar, Building2, Hash } from 'lucide-react';
import { LegalDocument } from '../types';

interface LegalDocViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: LegalDocument | null;
  companyName: string;
  registrationNumber?: string;
  taxIdType?: string;
}

export const LegalDocViewerModal: React.FC<LegalDocViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  companyName,
  registrationNumber,
  taxIdType = 'CIN'
}) => {
  if (!isOpen || !document) return null;

  const getDocTypeLabel = (type?: string) => {
    switch (type) {
      case 'incorporation_certificate':
        return 'Certificate of Incorporation (MCA)';
      case 'gst_tax_certificate':
        return 'GST / Tax Registration Certificate';
      case 'business_license':
        return 'Government Business Operating License';
      case 'msme_certificate':
        return 'MSME / Udyam Registration Certificate';
      default:
        return 'Government Legal Entity Proof';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Legal Proof of Registration
                </h3>
                <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Official PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {companyName} • {getDocTypeLabel(document.documentType)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={document.fileUrl}
              download={document.fileName || `${companyName}_Legal_Certificate.pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Details bar */}
        <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium truncate">{companyName}</span>
          </div>
          {registrationNumber && (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-medium truncate">{taxIdType}: {registrationNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{document.fileName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{document.fileSize || 'PDF Document'}</span>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 p-4 bg-slate-200/50 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[380px] max-h-[550px] overflow-hidden">
          {document.fileUrl ? (
            <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 bg-white flex flex-col">
              <iframe
                src={`${document.fileUrl}#toolbar=0&navpanes=0`}
                title="Legal Certificate Preview"
                className="w-full h-[450px] border-none"
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                PDF File Available for Download
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {document.fileName} ({document.fileSize || 'PDF'})
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Submitted for Training & Placement Office legal compliance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalDocViewerModal;
