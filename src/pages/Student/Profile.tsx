import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { format } from 'date-fns';
import { Clock, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateProfileStrength } from '../../lib/profileUtils';
import { Camera, MapPin, Mail, Phone, GraduationCap, Briefcase, Award, FileText, CheckCircle2, ChevronRight, Save, X, Edit, Settings as SettingsIcon } from 'lucide-react';
import { StudentProfile } from '../../types';

export default function StudentProfileView() {
  const { applications } = useAppContext();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      if (user.profile) setFormData(user.profile);
      if (user.name) setUserName(user.name);
    }
  }, [user]);

  if (!user) return null;

  const { score, actions } = calculateProfileStrength(user);
  const incompleteActions = actions.filter(a => !a.isComplete);
  const myApplications = applications.filter(app => app.studentId === user?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'rejected': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      default: return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }
  };


  
  
  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your CV/Resume.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cvUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) updateUser({ ...user, name: userName, profile: formData });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skills' ? value.split(',').map(s => s.trim()) : value
    }));
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl text-white bg-blue-600 font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-xs">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {formData.profilePhoto && <img src={formData.profilePhoto} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Languages</label>
                <input type="text" name="languages" value={formData.languages || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="English, Spanish" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">About Me</label>
                <textarea name="aboutMe" value={formData.aboutMe || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24" placeholder="Briefly describe yourself..." />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Academic Information</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">College / Department</label>
                <input type="text" name="branch" value={formData.branch || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Degree</label>
                <input type="text" name="degree" value={formData.degree || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Year / Batch</label>
                <input type="text" name="batch" value={formData.batch || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 2025" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Semester</label>
                <input type="text" name="semester" value={formData.semester || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 6th" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">CGPA</label>
                <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 8.5" />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Professional Profile</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">CV / Resume (PDF)</label>
                <div className="flex items-center gap-3">
                  {formData.cvUrl && formData.cvUrl.startsWith('data:application/pdf') ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> PDF Attached
                    </div>
                  ) : formData.cvUrl ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Link Attached
                    </div>
                  ) : null}
                  <input type="file" accept=".pdf,application/pdf" onChange={handleCvUpload} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills?.join(', ') || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="React, Node.js, Python" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Career Interests</label>
                <textarea name="careerInterests" value={formData.careerInterests || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="Software Engineering, Product Management..." />
              </div>
            </div>
          </div>

          {/* Experience & Projects */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Experience & Projects</h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Work Experience</label>
                <textarea name="workExperience" value={formData.workExperience || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-24" placeholder="Briefly describe your previous work roles..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Internships Completed</label>
                <textarea name="internshipsCompleted" value={formData.internshipsCompleted || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-24" placeholder="List your internships..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Projects</label>
                <textarea name="projects" value={formData.projects || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-24" placeholder="Describe key projects..." />
              </div>
            </div>
          </div>

          {/* Extras */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Achievements & Extras</h2>
            <div className="grid gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Certifications</label>
                <textarea name="certifications" value={formData.certifications || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Awards</label>
                <textarea name="awards" value={formData.awards || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Extracurricular Activities</label>
                <textarea name="extracurriculars" value={formData.extracurriculars || ''} onChange={handleChange} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-slate-50 dark:bg-slate-800 h-20" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // View Mode
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Profile Strength Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 overflow-hidden relative transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 dark:bg-blue-900/10 rounded-bl-full -z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Strength</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Profile {score}% complete</p>
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{score}%</div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${score}%` }}></div>
          </div>

          {incompleteActions.length > 0 ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Boost your score</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {incompleteActions.slice(0, 4).map(action => (
                  <button 
                    key={action.id} 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group text-left"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{action.label}</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-md shrink-0">+{action.points}%</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">Incredible! Your profile is 100% complete and ready for top companies.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Header */}
        <div className="h-32 bg-slate-900 dark:bg-slate-950 border-b border-slate-800"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end mb-6 -mt-12">
            <div className="flex items-end gap-5">
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt="Profile" className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 object-cover bg-white dark:bg-slate-900 shadow-sm" />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                  <Camera className="w-8 h-8" />
                </div>
              )}
              <div className="pb-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{formData.degree} {formData.branch && `in ${formData.branch}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors">
                <Edit className="w-4 h-4" /> <span className="hidden sm:inline">Edit Profile</span>
              </button>
              <button onClick={() => window.location.href = '/student/settings'} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors" title="Settings">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              
              <section>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">About Me</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {formData.aboutMe || <span className="text-slate-400 italic">No description added yet.</span>}
                </p>
              </section>

              {(formData.workExperience || formData.internshipsCompleted) && (
                <section>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Experience</h3>
                  <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                    {formData.workExperience && <div><span className="font-semibold text-slate-800 dark:text-slate-200">Work:</span><br/>{formData.workExperience}</div>}
                    {formData.internshipsCompleted && <div><span className="font-semibold text-slate-800 dark:text-slate-200">Internships:</span><br/>{formData.internshipsCompleted}</div>}
                  </div>
                </section>
              )}

              {formData.projects && (
                <section>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Projects</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">{formData.projects}</p>
                </section>
              )}

              <section>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Skills</h3>
                {formData.skills && formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 px-3 py-1 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm italic">No skills listed.</span>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Contact Info</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-400" /> <span className="truncate">{user.email}</span></li>
                  {formData.phone && <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-400" /> {formData.phone}</li>}
                  {formData.location && <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-400" /> {formData.location}</li>}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Academic</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3"><GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> 
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.degree || 'Degree not specified'}</p>
                      <p>{formData.branch}</p>
                      <p className="text-xs mt-1">Class of {formData.batch} &bull; Sem {formData.semester}</p>
                    </div>
                  </li>
                  {formData.cgpa && (
                    <li className="flex items-center gap-3"><Award className="w-4 h-4 text-slate-400 shrink-0" /> <span className="font-semibold text-slate-800 dark:text-slate-200">CGPA: {formData.cgpa}</span></li>
                  )}
                </ul>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Web Links</h3>
                <ul className="space-y-3 text-sm">
                  {formData.linkedin ? (
                    <li><a href={formData.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"><div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded flex items-center justify-center text-xs font-bold">in</div> LinkedIn Profile</a></li>
                  ) : <li className="text-slate-400 italic">No LinkedIn</li>}

                  {formData.cvUrl ? (
                    <li><a href={formData.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"><FileText className="w-4 h-4" /> Download Resume</a></li>
                  ) : <li className="text-slate-400 italic">No Resume Uploaded</li>}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden mt-6 transition-colors">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Applications</h2>
        </div>
        {myApplications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            You haven't applied to any internships yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myApplications.map(app => (
              <div key={app.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                    {app.internshipTitle.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{app.internshipTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Applied {format(new Date(app.appliedAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(app.status)}`}>
                  {getStatusIcon(app.status)}
                  <span>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
