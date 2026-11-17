export type Role = 'student' | 'company' | 'admin';

export type CompanyApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface LegalDocument {
  fileName: string;
  fileType: string;
  fileUrl: string; // Base64 Data URL or remote URL
  documentType: 'incorporation_certificate' | 'gst_tax_certificate' | 'business_license' | 'msme_certificate' | 'other';
  uploadedAt: string;
  fileSize?: string;
}

export interface RegisteredCompany {
  id: string;
  userId?: string;
  name: string;
  email: string;
  website: string;
  industry: string;
  headquarters: string;
  companySize?: string;
  foundedYear?: string;
  aboutCompany?: string;

  // Legitimacy & Legal Verification
  registrationNumber: string; // CIN / GSTIN / Tax ID / EIN
  taxIdType: 'CIN' | 'GSTIN' | 'EIN' | 'LLPIN' | 'Business Reg';
  incorporationDate?: string;
  officialEmailDomain: string;
  registeredAddress: string;

  // Legal Proof PDF Document
  legalDocument: LegalDocument;

  // Recruiter / Signatory details
  recruiterName: string;
  recruiterDesignation: string;
  recruiterPhone: string;
  recruiterLinkedin?: string;

  // Approval Lifecycle
  approvalStatus: CompanyApprovalStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  verificationNotes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  isOnboarded: boolean;
  companyApprovalStatus?: CompanyApprovalStatus;
  profile?: any; // Contains StudentProfile | CompanyProfile
}

export interface StudentProfile {
  studentId?: string; // Student ID / Enrollment Number
  phone?: string;
  branch?: string; // Department / Branch
  degree?: string; // Degree / Program
  batch?: string; // Current Year
  graduationYear?: string;
  
  profilePhoto?: string;
  cvUrl?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  
  aboutMe?: string;
  careerInterests?: string;
  skills?: string[];
  languages?: string;
  workExperience?: string;
  internshipsCompleted?: string;
  projects?: string;
  certifications?: string;
  achievements?: string;
  extracurriculars?: string;

  semester?: string;
  cgpa?: string;
  awards?: string;
}

export interface CompanyProfile {
  companyName: string;
  website: string;
  description?: string;

  // Legal & Verification fields
  legalName?: string;
  displayName?: string;
  registrationNumber?: string; // CIN / GSTIN / Tax ID / EIN
  taxIdType?: 'CIN' | 'GSTIN' | 'EIN' | 'LLPIN' | 'Business Reg';
  incorporationDate?: string;
  registeredAddress?: string;
  officialEmailDomain?: string;
  legalDocument?: LegalDocument;

  // Verification status
  approvalStatus?: CompanyApprovalStatus;
  approvalRemarks?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;

  // Profile info
  logo?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: string;
  headquarters?: string;
  operatingLocations?: string;
  linkedin?: string;
  aboutCompany?: string;
  companyCulture?: string;
  areasOfWork?: string;

  // Recruiter fields
  recruiterName?: string;
  recruiterDesignation?: string;
  recruiterPhone?: string;
  recruiterDepartment?: string;
  recruiterLinkedin?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  eligibility: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minCgpa?: number;
  stipend: string;
  deadline: string;
  createdAt: string;
  status: 'open' | 'closed';
  companyApprovalStatus?: CompanyApprovalStatus;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  studentId: string;
  studentName: string;
  studentSkills?: string[];
  studentCvUrl?: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  age?: string;
  collegeName?: string;
  course?: string;
  capabilities?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'event' | 'update' | 'achievement' | 'alumni';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
}
