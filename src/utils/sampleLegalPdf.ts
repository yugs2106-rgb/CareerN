// Generates a mock or real printable PDF Data URI / Preview payload for legal registration documents
export function generateSampleLegalPdf(companyName: string, cin: string): string {
  // A clean minimal valid PDF representation encoded in base64
  // When viewed or embedded, it creates a readable Certificate of Incorporation
  const pdfHeader = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 18 Tf
70 700 Td
(GOVERNMENT REGISTRATION & INCORPORATION CERTIFICATE) Tj
/F1 12 Tf
0 -40 Td
(This certifies that ${companyName || 'TECHCORP SOLUTIONS'} is legally registered.) Tj
0 -25 Td
(Corporate Registration / CIN: ${cin || 'U72200KA2016PTC098765'}) Tj
0 -25 Td
(Authorized under the Companies Act for Campus Recruitment Operations.) Tj
0 -25 Td
(Status: Active & Verified Legitimacy) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000224 00000 n 
0000000535 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
605
%%EOF`;

  return `data:application/pdf;base64,${btoa(pdfHeader)}`;
}

export const SAMPLE_COMPANIES_SEED = [
  {
    id: 'c1',
    name: 'TechCorp Solutions',
    email: 'recruiter@techcorp.com',
    website: 'https://techcorp.com',
    industry: 'Enterprise Software & Cloud Systems',
    headquarters: 'Bengaluru, Karnataka, India',
    companySize: '500-1000 employees',
    foundedYear: '2016',
    aboutCompany: 'Global software engineering consultancy specializing in enterprise web applications and scalable cloud architecture.',
    registrationNumber: 'U72200KA2016PTC098765',
    taxIdType: 'CIN' as const,
    incorporationDate: '2016-04-12',
    officialEmailDomain: 'techcorp.com',
    registeredAddress: 'TechCorp Tower, Outer Ring Road, Bellandur, Bengaluru - 560103',
    legalDocument: {
      fileName: 'TechCorp_Certificate_of_Incorporation_MCA.pdf',
      fileType: 'application/pdf',
      fileUrl: generateSampleLegalPdf('TechCorp Solutions', 'U72200KA2016PTC098765'),
      documentType: 'incorporation_certificate' as const,
      uploadedAt: '2026-08-15T10:30:00.000Z',
      fileSize: '1.4 MB'
    },
    recruiterName: 'Sarah Connor',
    recruiterDesignation: 'Head of Campus Recruitment',
    recruiterPhone: '+91 98765 43210',
    recruiterLinkedin: 'https://linkedin.com/in/sarah-connor-hr',
    approvalStatus: 'approved' as const,
    submittedAt: '2026-08-15T10:30:00.000Z',
    reviewedAt: '2026-08-16T14:20:00.000Z',
    reviewedBy: 'Prof. V. Sharma (TPO)',
    verificationNotes: 'Valid MCA registration verified against Ministry of Corporate Affairs database. Official domain techcorp.com confirmed.'
  },
  {
    id: 'c2',
    name: 'DataWiz Analytics',
    email: 'careers@datawiz.io',
    website: 'https://datawiz.io',
    industry: 'Data Science & Predictive AI',
    headquarters: 'Hyderabad, Telangana, India',
    companySize: '250-500 employees',
    foundedYear: '2019',
    aboutCompany: 'Specialized predictive analytics and data science engineering firm building financial intelligence algorithms.',
    registrationNumber: '36AABCD1234F1Z8',
    taxIdType: 'GSTIN' as const,
    incorporationDate: '2019-09-08',
    officialEmailDomain: 'datawiz.io',
    registeredAddress: 'Plot 42, HITEC City, Madhapur, Hyderabad - 500081',
    legalDocument: {
      fileName: 'DataWiz_GSTIN_Tax_Registration.pdf',
      fileType: 'application/pdf',
      fileUrl: generateSampleLegalPdf('DataWiz Analytics', '36AABCD1234F1Z8'),
      documentType: 'gst_tax_certificate' as const,
      uploadedAt: '2026-08-20T11:15:00.000Z',
      fileSize: '890 KB'
    },
    recruiterName: 'Ananya Roy',
    recruiterDesignation: 'Lead Technical Recruiter',
    recruiterPhone: '+91 98450 11223',
    recruiterLinkedin: 'https://linkedin.com/in/ananya-roy',
    approvalStatus: 'approved' as const,
    submittedAt: '2026-08-20T11:15:00.000Z',
    reviewedAt: '2026-08-21T09:45:00.000Z',
    reviewedBy: 'Prof. V. Sharma (TPO)',
    verificationNotes: 'GSTIN verified active on official Goods and Services Tax portal.'
  },
  {
    id: 'c3',
    name: 'CloudNet Inc.',
    email: 'hiring@cloudnet.co',
    website: 'https://cloudnet.co',
    industry: 'DevOps & Cloud Infrastructure',
    headquarters: 'Pune, Maharashtra, India',
    companySize: '100-250 employees',
    foundedYear: '2022',
    aboutCompany: 'High-performance cloud consulting and container orchestration services for fintech startups.',
    registrationNumber: 'U72900MH2022PTC384920',
    taxIdType: 'CIN' as const,
    incorporationDate: '2022-02-18',
    officialEmailDomain: 'cloudnet.co',
    registeredAddress: 'Tower B, Cyber City, Magarpatta, Pune - 411028',
    legalDocument: {
      fileName: 'CloudNet_MCA_Certificate_Incorporation.pdf',
      fileType: 'application/pdf',
      fileUrl: generateSampleLegalPdf('CloudNet Inc.', 'U72900MH2022PTC384920'),
      documentType: 'incorporation_certificate' as const,
      uploadedAt: '2026-09-17T16:00:00.000Z',
      fileSize: '1.2 MB'
    },
    recruiterName: 'Vikram Mehta',
    recruiterDesignation: 'Talent Acquisition Partner',
    recruiterPhone: '+91 97654 32109',
    recruiterLinkedin: 'https://linkedin.com/in/vikram-mehta-hr',
    approvalStatus: 'pending' as const,
    submittedAt: '2026-09-17T16:00:00.000Z',
    verificationNotes: 'Pending TPO verification of registered address and official business license.'
  },
  {
    id: 'c4',
    name: 'Apex Quantum Dynamics',
    email: 'hr@apexquantum.xyz',
    website: 'https://apexquantum.xyz',
    industry: 'Crypto & High Frequency Trading',
    headquarters: 'Road Town, Tortola, BVI',
    companySize: '10-20 employees',
    foundedYear: '2024',
    aboutCompany: 'Algorithmic trading network.',
    registrationNumber: 'BVI-883920-UNVERIFIED',
    taxIdType: 'Business Reg' as const,
    incorporationDate: '2024-01-10',
    officialEmailDomain: 'apexquantum.xyz',
    registeredAddress: 'PO Box 144, Road Town, Tortola',
    legalDocument: {
      fileName: 'Offshore_Trading_Permit_Scan.pdf',
      fileType: 'application/pdf',
      fileUrl: generateSampleLegalPdf('Apex Quantum Dynamics', 'BVI-883920-UNVERIFIED'),
      documentType: 'business_license' as const,
      uploadedAt: '2026-09-10T09:00:00.000Z',
      fileSize: '650 KB'
    },
    recruiterName: 'John Doe',
    recruiterDesignation: 'HR Consultant',
    recruiterPhone: '+1 408 555 0199',
    approvalStatus: 'rejected' as const,
    submittedAt: '2026-09-10T09:00:00.000Z',
    reviewedAt: '2026-09-11T12:00:00.000Z',
    reviewedBy: 'Prof. V. Sharma (TPO)',
    rejectionReason: 'Illegible Certificate of Registration. Company lacks physical domestic office and official domain apexquantum.xyz does not resolve.'
  }
];
