import { User } from '../types';

export interface ProfileAction {
  id: string;
  label: string;
  points: number;
  isComplete: boolean;
}

export function calculateProfileStrength(user: User | null): { score: number; actions: ProfileAction[] } {
  if (!user || user.role !== 'student') return { score: 0, actions: [] };
  const profile = user.profile || {};
  
  let score = 20; // Base score for having an account with Name and Email
  const actions: ProfileAction[] = [];

  const addAction = (id: string, label: string, points: number, isComplete: boolean) => {
    if (isComplete) score += points;
    actions.push({ id, label, points, isComplete });
  };

  addAction('about', 'Add About Me', 5, !!profile.aboutMe && profile.aboutMe.trim().length > 0);
  addAction('academic', 'Add College/Department & Year', 10, !!(profile.branch && profile.batch));
  addAction('degree', 'Add Degree & CGPA', 10, !!(profile.degree && profile.cgpa));
  addAction('cv', 'Add CV / Resume Link', 10, !!profile.cvUrl && profile.cvUrl.trim().length > 0);
  addAction('linkedin', 'Add LinkedIn Profile', 5, !!profile.linkedin && profile.linkedin.trim().length > 0);
  addAction('github', 'Add GitHub/Portfolio', 5, !!profile.github && profile.github.trim().length > 0);
  addAction('skills', 'Add at least 3 skills', 10, !!(profile.skills && profile.skills.length >= 3));
  addAction('projects', 'Add Projects', 10, !!profile.projects && profile.projects.trim().length > 0);
  addAction('experience', 'Add Work Exp / Internships', 10, !!((profile.workExperience && profile.workExperience.length > 0) || (profile.internshipsCompleted && profile.internshipsCompleted.length > 0)));
  addAction('extra', 'Add Extracurriculars / Awards', 5, !!((profile.extracurriculars && profile.extracurriculars.length > 0) || (profile.awards && profile.awards.length > 0) || (profile.certifications && profile.certifications.length > 0)));

  return { 
    score: Math.min(score, 100), 
    actions: actions.sort((a, b) => Number(a.isComplete) - Number(b.isComplete))
  };
}
