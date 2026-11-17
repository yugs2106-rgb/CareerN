import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ApplicationModal({ internship, user, onClose, onApply }: any) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    collegeName: '',
    course: user?.profile?.degree || '',
    capabilities: '',
    acceptedTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      return;
      return;
    }
    onApply(internship, formData);
  };

  if (!internship) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl relative my-8">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Apply for {internship.title}</h2>
            <p className="text-yellow-600 font-medium">{internship.companyName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Age *</label>
                <input 
                  required
                  type="number" 
                  min="16"
                  max="100"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">College Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={formData.collegeName}
                  onChange={e => setFormData({...formData, collegeName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Course *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={formData.course}
                  onChange={e => setFormData({...formData, course: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">What makes you a suitable candidate for this job? *</label>
              <textarea 
                required
                rows={4}
                placeholder="Highlight your skills, projects, and why you are a good fit for this role..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                value={formData.capabilities}
                onChange={e => setFormData({...formData, capabilities: e.target.value})}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded cursor-pointer checked:border-yellow-400 checked:bg-yellow-400 transition-colors"
                    checked={formData.acceptedTerms}
                    onChange={e => setFormData({...formData, acceptedTerms: e.target.checked})}
                  />
                  <CheckCircle2 className="w-4 h-4 text-black absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I accept the <a href="#" className="text-yellow-600 font-bold hover:underline">Terms and Conditions</a> and confirm that the information provided above is accurate. I understand my profile and CV will be shared with the company.
                </div>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!formData.acceptedTerms}
                className="px-8 py-2.5 rounded-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm disabled:opacity-50 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
