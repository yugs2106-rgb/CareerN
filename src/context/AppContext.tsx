import React, { createContext, useContext, useEffect, useState } from 'react';
import { Internship, Application, Event, User, RegisteredCompany, CompanyApprovalStatus } from '../types';
import { SAMPLE_COMPANIES_SEED } from '../utils/sampleLegalPdf';

interface AppContextType {
  internships: Internship[];
  applications: Application[];
  events: Event[];
  students: User[];
  companies: RegisteredCompany[];
  addInternship: (internship: Omit<Internship, 'id' | 'createdAt'>) => void;
  applyForInternship: (application: Omit<Application, 'id' | 'appliedAt'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  deleteInternship: (id: string) => void;
  withdrawApplication: (id: string) => void;
  approveCompany: (companyId: string, reviewedBy?: string) => void;
  rejectCompany: (companyId: string, reason: string, reviewedBy?: string) => void;
  registerCompany: (companyData: Omit<RegisteredCompany, 'id' | 'submittedAt' | 'approvalStatus'>) => RegisteredCompany;
  resubmitCompanyVerification: (companyId: string, updatedData: Partial<RegisteredCompany>) => void;
  getCompanyApprovalStatus: (companyIdOrName: string) => CompanyApprovalStatus;
  getCompanyById: (companyId: string) => RegisteredCompany | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock events
const initialEvents: Event[] = [
  { id: '1', title: 'Campus Drive 2026', description: 'Annual recruitment drive for final year students with verified corporate partners.', date: '2026-10-15', type: 'event' },
  { id: '2', title: 'New Employer Verification Mandate', description: 'All visiting recruitment partners must submit MCA/GST certificates for student safety.', date: '2026-09-01', type: 'update' },
  { id: '3', title: 'John Doe placed at Google', description: 'Congratulations for securing a package of 40 LPA!', date: '2026-08-20', type: 'achievement' },
  { id: '4', title: 'Message from Placement Dean', description: 'Welcome to the new academic year. Only verified companies are approved to post internships.', date: '2026-08-15', type: 'alumni' }
];

const initialInternships: Internship[] = [
  {
    id: 'i1',
    companyId: 'c1',
    companyName: 'TechCorp Solutions',
    title: 'Frontend Developer Intern',
    description: 'Join our team to build scalable web applications using React and Tailwind.',
    eligibility: 'B.Tech / MCA (3rd or 4th Year)',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
    stipend: '₹15,000 / month',
    deadline: '2026-10-01',
    createdAt: '2026-09-01',
    status: 'open',
    companyApprovalStatus: 'approved'
  },
  {
    id: 'i2',
    companyId: 'c2',
    companyName: 'DataWiz Analytics',
    title: 'Data Science Intern',
    description: 'Work on real-world datasets using Python and Machine Learning models.',
    eligibility: 'B.Tech / M.Sc Data Science',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
    stipend: '₹20,000 / month',
    deadline: '2026-09-25',
    createdAt: '2026-08-28',
    status: 'open',
    companyApprovalStatus: 'approved'
  },
  {
    id: 'i3',
    companyId: 'c3',
    companyName: 'CloudNet Inc.',
    title: 'Backend Engineering Intern',
    description: 'Help scale our backend microservices using Node.js and AWS.',
    eligibility: 'B.Tech CS/IT',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
    stipend: '₹18,000 / month',
    deadline: '2026-09-30',
    createdAt: '2026-09-02',
    status: 'open',
    companyApprovalStatus: 'pending'
  }
];

const mockStudents: User[] = [
  {
    id: 's1',
    email: 'rahul.s@college.edu',
    name: 'Rahul Shah',
    role: 'student',
    isVerified: true,
    isOnboarded: true,
    profile: {
      skills: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'],
      degree: 'B.Tech',
      branch: 'Computer Science',
      batch: '2025',
      semester: '6th',
      cgpa: '8.2',
      cvUrl: 'https://example.com/cv.pdf',
      github: 'https://github.com/rahul',
      linkedin: 'https://linkedin.com/in/rahul',
    }
  },
  {
    id: 's2',
    email: 'priya.m@college.edu',
    name: 'Priya Mishra',
    role: 'student',
    isVerified: true,
    isOnboarded: true,
    profile: {
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      degree: 'BCA',
      branch: 'Computer Applications',
      batch: '2026',
      semester: '4th',
      cgpa: '7.8'
    }
  },
  {
    id: 's3',
    email: 'amit.k@college.edu',
    name: 'Amit Kumar',
    role: 'student',
    isVerified: true,
    isOnboarded: true,
    profile: {
      skills: ['Python', 'SQL', 'Tableau'],
      degree: 'B.Sc',
      branch: 'Data Science',
      batch: '2024',
      semester: '8th',
      cgpa: '9.1'
    }
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<RegisteredCompany[]>(() => {
    const saved = localStorage.getItem('app_companies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing app_companies', e);
      }
    }
    return SAMPLE_COMPANIES_SEED;
  });

  const [internships, setInternships] = useState<Internship[]>(() => {
    const saved = localStorage.getItem('app_internships');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : initialInternships;
      } catch (e) {
        console.error('Error parsing app_internships', e);
      }
    }
    return initialInternships;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('app_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('app_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [students] = useState<User[]>(mockStudents);

  useEffect(() => {
    localStorage.setItem('app_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('app_internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('app_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('app_events', JSON.stringify(events));
  }, [events]);

  const approveCompany = (companyId: string, reviewedBy: string = 'Prof. V. Sharma (TPO)') => {
    const now = new Date().toISOString();
    
    // Find target company details from current state or storage
    const targetComp = companies.find(c => c.id === companyId || c.userId === companyId);
    const targetName = targetComp?.name || '';
    const targetEmail = targetComp?.email || '';
    const targetUserId = targetComp?.userId || '';

    setCompanies(prev => {
      const updated = prev.map(c => {
        const isMatch = c.id === companyId || (targetComp && c.id === targetComp.id) || (targetName && c.name.toLowerCase() === targetName.toLowerCase());
        if (isMatch) {
          return {
            ...c,
            approvalStatus: 'approved' as const,
            reviewedAt: now,
            reviewedBy,
            rejectionReason: undefined
          };
        }
        return c;
      });
      try {
        localStorage.setItem('app_companies', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting approved company', e);
      }
      return updated;
    });

    // Update any internships posted by this company to approved status
    setInternships(prev => {
      const updated = prev.map(i => {
        const isMatch =
          i.companyId === companyId ||
          (targetComp && i.companyId === targetComp.id) ||
          (targetUserId && i.companyId === targetUserId) ||
          (targetName && i.companyName.toLowerCase() === targetName.toLowerCase());
        return isMatch ? { ...i, companyApprovalStatus: 'approved' as const } : i;
      });
      try {
        localStorage.setItem('app_internships', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting approved internships', e);
      }
      return updated;
    });

    // Also sync the logged in user profile if it's the approved company
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        const isMatch =
          userObj.role === 'company' &&
          (userObj.id === companyId ||
            userObj.id === targetUserId ||
            (targetEmail && userObj.email?.toLowerCase() === targetEmail.toLowerCase()) ||
            (targetName && userObj.name?.toLowerCase() === targetName.toLowerCase()) ||
            (targetName && userObj.profile?.companyName?.toLowerCase() === targetName.toLowerCase()));

        if (isMatch) {
          userObj.companyApprovalStatus = 'approved';
          if (userObj.profile) {
            userObj.profile.approvalStatus = 'approved';
            userObj.profile.rejectionReason = undefined;
          }
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        }
      } catch (e) {
        console.error('Error updating auth_user on approve', e);
      }
    }

    window.dispatchEvent(
      new CustomEvent('company_status_updated', {
        detail: { companyId, status: 'approved', companyName: targetName }
      })
    );
  };

  const rejectCompany = (companyId: string, reason: string, reviewedBy: string = 'Prof. V. Sharma (TPO)') => {
    const now = new Date().toISOString();
    const targetComp = companies.find(c => c.id === companyId || c.userId === companyId);
    const targetName = targetComp?.name || '';
    const targetEmail = targetComp?.email || '';
    const targetUserId = targetComp?.userId || '';

    setCompanies(prev => {
      const updated = prev.map(c => {
        const isMatch = c.id === companyId || (targetComp && c.id === targetComp.id) || (targetName && c.name.toLowerCase() === targetName.toLowerCase());
        if (isMatch) {
          return {
            ...c,
            approvalStatus: 'rejected' as const,
            rejectionReason: reason || 'Legal verification documents did not meet university compliance standards.',
            reviewedAt: now,
            reviewedBy
          };
        }
        return c;
      });
      try {
        localStorage.setItem('app_companies', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting rejected company', e);
      }
      return updated;
    });

    setInternships(prev => {
      const updated = prev.map(i => {
        const isMatch =
          i.companyId === companyId ||
          (targetComp && i.companyId === targetComp.id) ||
          (targetUserId && i.companyId === targetUserId) ||
          (targetName && i.companyName.toLowerCase() === targetName.toLowerCase());
        return isMatch ? { ...i, companyApprovalStatus: 'rejected' as const } : i;
      });
      try {
        localStorage.setItem('app_internships', JSON.stringify(updated));
      } catch (e) {
        console.error('Error persisting rejected internships', e);
      }
      return updated;
    });

    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        const isMatch =
          userObj.role === 'company' &&
          (userObj.id === companyId ||
            userObj.id === targetUserId ||
            (targetEmail && userObj.email?.toLowerCase() === targetEmail.toLowerCase()) ||
            (targetName && userObj.name?.toLowerCase() === targetName.toLowerCase()) ||
            (targetName && userObj.profile?.companyName?.toLowerCase() === targetName.toLowerCase()));

        if (isMatch) {
          userObj.companyApprovalStatus = 'rejected';
          if (userObj.profile) {
            userObj.profile.approvalStatus = 'rejected';
            userObj.profile.rejectionReason = reason;
          }
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        }
      } catch (e) {
        console.error('Error updating auth_user on reject', e);
      }
    }

    window.dispatchEvent(
      new CustomEvent('company_status_updated', {
        detail: { companyId, status: 'rejected', companyName: targetName }
      })
    );
  };

  const registerCompany = (
    companyData: Omit<RegisteredCompany, 'id' | 'submittedAt' | 'approvalStatus'>
  ): RegisteredCompany => {
    const now = new Date().toISOString();
    let savedCompany: RegisteredCompany;

    setCompanies(prev => {
      const existingIdx = prev.findIndex(
        c =>
          (companyData.userId && (c.userId === companyData.userId || c.id === companyData.userId)) ||
          (companyData.email && c.email.toLowerCase() === companyData.email.toLowerCase()) ||
          c.name.toLowerCase() === companyData.name.toLowerCase()
      );

      if (existingIdx >= 0) {
        savedCompany = {
          ...prev[existingIdx],
          ...companyData,
          approvalStatus: 'pending',
          submittedAt: now,
          rejectionReason: undefined,
          reviewedAt: undefined,
          reviewedBy: undefined
        };
        const next = [...prev];
        next[existingIdx] = savedCompany;
        try {
          localStorage.setItem('app_companies', JSON.stringify(next));
        } catch (e) {}
        return next;
      } else {
        savedCompany = {
          ...companyData,
          id: companyData.userId || crypto.randomUUID(),
          submittedAt: now,
          approvalStatus: 'pending'
        };
        const next = [savedCompany, ...prev];
        try {
          localStorage.setItem('app_companies', JSON.stringify(next));
        } catch (e) {}
        return next;
      }
    });

    window.dispatchEvent(new CustomEvent('company_status_updated', { detail: { status: 'pending' } }));
    return savedCompany!;
  };

  const resubmitCompanyVerification = (
    companyId: string,
    updatedData: Partial<RegisteredCompany>
  ) => {
    setCompanies(prev => {
      const updated = prev.map(c =>
        c.id === companyId
          ? {
              ...c,
              ...updatedData,
              approvalStatus: 'pending' as const,
              submittedAt: new Date().toISOString(),
              rejectionReason: undefined,
              reviewedAt: undefined,
              reviewedBy: undefined
            }
          : c
      );
      try {
        localStorage.setItem('app_companies', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj.id === companyId || userObj.role === 'company') {
          userObj.companyApprovalStatus = 'pending';
          if (userObj.profile) {
            userObj.profile.approvalStatus = 'pending';
            userObj.profile.rejectionReason = undefined;
          }
          localStorage.setItem('auth_user', JSON.stringify(userObj));
        }
      } catch (e) {
        // ignore
      }
    }

    window.dispatchEvent(new CustomEvent('company_status_updated', { detail: { companyId, status: 'pending' } }));
  };

  const getCompanyApprovalStatus = (companyIdOrName: string): CompanyApprovalStatus => {
    const found = companies.find(
      c => c.id === companyIdOrName || c.name.toLowerCase() === companyIdOrName.toLowerCase()
    );
    return found ? found.approvalStatus : 'pending';
  };

  const getCompanyById = (companyId: string): RegisteredCompany | undefined => {
    return companies.find(c => c.id === companyId);
  };

  const addInternship = (internship: Omit<Internship, 'id' | 'createdAt'>) => {
    const compStatus = getCompanyApprovalStatus(internship.companyId || internship.companyName);
    const newInternship: Internship = {
      ...internship,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      companyApprovalStatus: compStatus
    };
    setInternships([newInternship, ...internships]);
  };

  const applyForInternship = (application: Omit<Application, 'id' | 'appliedAt'>) => {
    const newApplication: Application = {
      ...application,
      id: crypto.randomUUID(),
      appliedAt: new Date().toISOString()
    };
    setApplications([newApplication, ...applications]);
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(applications.map(app => (app.id === id ? { ...app, status } : app)));
  };

  const withdrawApplication = (id: string) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  const deleteInternship = (id: string) => {
    setInternships(internships.filter(i => i.id !== id));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID()
    };
    setEvents([newEvent, ...events]);
  };

  return (
    <AppContext.Provider
      value={{
        internships,
        applications,
        events,
        students,
        companies,
        addInternship,
        applyForInternship,
        updateApplicationStatus,
        addEvent,
        deleteInternship,
        withdrawApplication,
        approveCompany,
        rejectCompany,
        registerCompany,
        resubmitCompanyVerification,
        getCompanyApprovalStatus,
        getCompanyById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
