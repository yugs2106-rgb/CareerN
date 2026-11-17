import { User, Internship } from '../types';

export function calculateMatchScore(student: User, internship: Internship) {
  if (!student.profile || !student.profile.skills) return { score: 0, matchedSkills: [] };
  
  const studentSkills = student.profile.skills.map((s: string) => s.toLowerCase());
  const required = internship.requiredSkills || [];
  const preferred = internship.preferredSkills || [];
  
  const allSkills = [...required, ...preferred];
  if (allSkills.length === 0) return { score: 0, matchedSkills: [] };

  const matchedSkills = allSkills.filter(skill => studentSkills.includes(skill.toLowerCase()));
  const score = Math.round((matchedSkills.length / allSkills.length) * 100);

  return { score, matchedSkills };
}
