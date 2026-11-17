import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role, CompanyApprovalStatus } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role, name: string) => void;
  register: (email: string, role: Role, name: string) => void;
  completeOnboarding: (profile: any) => void;
  verifyEmail: () => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setCompanyApprovalStatus: (status: CompanyApprovalStatus) => void;
  syncCompanyApprovalStatus: (companyIdOrName: string, status: CompanyApprovalStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  // Real-time synchronization when companies are approved/rejected by Admin
  useEffect(() => {
    const handleStatusSync = (e?: Event) => {
      const savedCompanies = localStorage.getItem('app_companies');
      const savedUser = localStorage.getItem('auth_user');
      if (!savedCompanies || !savedUser) return;

      try {
        const currentUser = JSON.parse(savedUser);
        if (currentUser.role !== 'company') return;

        const comps = JSON.parse(savedCompanies);
        const matched = comps.find(
          (c: any) =>
            c.id === currentUser.id ||
            c.userId === currentUser.id ||
            c.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
            c.name?.toLowerCase() === currentUser.name?.toLowerCase() ||
            c.name?.toLowerCase() === currentUser.profile?.companyName?.toLowerCase()
        );

        if (matched && matched.approvalStatus !== currentUser.companyApprovalStatus) {
          const updated: User = {
            ...currentUser,
            companyApprovalStatus: matched.approvalStatus,
            profile: {
              ...currentUser.profile,
              approvalStatus: matched.approvalStatus,
              rejectionReason: matched.rejectionReason
            }
          };
          setUser(updated);
          localStorage.setItem('auth_user', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Error syncing company approval status', err);
      }
    };

    window.addEventListener('storage', handleStatusSync);
    window.addEventListener('company_status_updated', handleStatusSync);

    return () => {
      window.removeEventListener('storage', handleStatusSync);
      window.removeEventListener('company_status_updated', handleStatusSync);
    };
  }, []);

  const login = (email: string, role: Role, name: string) => {
    let initialApprovalStatus: CompanyApprovalStatus = 'pending';
    let hasCompletedVerification = role !== 'company'; // Students and admins proceed directly

    if (role === 'company') {
      try {
        const savedCompanies = localStorage.getItem('app_companies');
        if (savedCompanies) {
          const comps = JSON.parse(savedCompanies);
          const matched = comps.find(
            (c: any) =>
              c.email?.toLowerCase() === email.toLowerCase() ||
              c.name?.toLowerCase() === name.toLowerCase() ||
              c.userId === btoa(email)
          );
          if (matched) {
            initialApprovalStatus = matched.approvalStatus;
            // A company is onboarded if they already submitted legal proof
            hasCompletedVerification = !!matched.legalDocument?.fileUrl;
          } else {
            // Default demo company TechCorp is pre-approved and onboarded
            if (name.toLowerCase().includes('techcorp') || email.toLowerCase().includes('techcorp')) {
              initialApprovalStatus = 'approved';
              hasCompletedVerification = true;
            } else {
              // Any other company must submit legal proof document first
              initialApprovalStatus = 'pending';
              hasCompletedVerification = false;
            }
          }
        } else {
          if (name.toLowerCase().includes('techcorp') || email.toLowerCase().includes('techcorp')) {
            initialApprovalStatus = 'approved';
            hasCompletedVerification = true;
          } else {
            hasCompletedVerification = false;
          }
        }
      } catch (e) {
        hasCompletedVerification = false;
      }
    }

    const newUser: User = {
      id: typeof window !== 'undefined' ? btoa(email) : email,
      email,
      name,
      role,
      isVerified: true,
      isOnboarded: hasCompletedVerification,
      companyApprovalStatus: role === 'company' ? initialApprovalStatus : undefined,
      profile: {
        companyName: name,
        approvalStatus: initialApprovalStatus
      }
    };
    setUser(newUser);
  };

  const register = (email: string, role: Role, name: string) => {
    const newUser: User = {
      id: typeof window !== 'undefined' ? btoa(email) : email,
      email,
      name,
      role,
      isVerified: true,
      isOnboarded: false, // New users must complete verification / onboarding
      companyApprovalStatus: role === 'company' ? 'pending' : undefined,
      profile: {
        companyName: name,
        approvalStatus: 'pending'
      }
    };
    setUser(newUser);
  };

  const completeOnboarding = (profile: any) => {
    if (!user) return;
    const approvalStatus = profile.approvalStatus || (user.role === 'company' ? 'pending' : undefined);
    const updated: User = {
      ...user,
      isOnboarded: true,
      companyApprovalStatus: approvalStatus,
      profile: {
        ...user.profile,
        ...profile,
        approvalStatus
      }
    };
    setUser(updated);
    localStorage.setItem('auth_user', JSON.stringify(updated));
  };

  const setCompanyApprovalStatus = (status: CompanyApprovalStatus) => {
    if (!user || user.role !== 'company') return;
    const updated: User = {
      ...user,
      companyApprovalStatus: status,
      profile: {
        ...user.profile,
        approvalStatus: status
      }
    };
    setUser(updated);
    localStorage.setItem('auth_user', JSON.stringify(updated));
  };

  const syncCompanyApprovalStatus = (companyIdOrName: string, status: CompanyApprovalStatus) => {
    setUser(prev => {
      if (!prev || prev.role !== 'company') return prev;
      const isMatch =
        prev.id === companyIdOrName ||
        prev.name?.toLowerCase() === companyIdOrName.toLowerCase() ||
        prev.profile?.companyName?.toLowerCase() === companyIdOrName.toLowerCase();
      if (!isMatch) return prev;

      const updated: User = {
        ...prev,
        companyApprovalStatus: status,
        profile: {
          ...prev.profile,
          approvalStatus: status
        }
      };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  const verifyEmail = () => {
    if (!user) return;
    setUser({
      ...user,
      isVerified: true
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        completeOnboarding,
        verifyEmail,
        logout,
        updateUser,
        setCompanyApprovalStatus,
        syncCompanyApprovalStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
