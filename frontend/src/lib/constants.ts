// VisaGuardian AI Constants

export const APP_NAME = 'VisaGuardian AI';
export const APP_TAGLINE = 'Intelligent Immigration Processing';

export const TRUST_BADGES = [
  { icon: 'shield-check', label: 'FedRAMP Authorized' },
  { icon: 'shield', label: 'SOC 2 Type II' },
  { icon: 'award', label: 'USCIS Partner' },
];

export const SECURITY_NOTICE = {
  message: 'This is an official U.S. Government information system. Unauthorized access is prohibited. All activities are monitored and recorded.',
};

export const CASE_STATUSES = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  'pending-review': { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
  'rfe-issued': { label: 'RFE Issued', color: 'bg-purple-100 text-purple-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  denied: { label: 'Denied', color: 'bg-red-100 text-red-700' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700' },
} as const;

export const VISA_TYPES = {
  'H-1B': { label: 'H-1B', description: 'Specialty Occupation', color: 'bg-blue-600 text-white' },
  'O-1A': { label: 'O-1A', description: 'Extraordinary Ability (Sciences/Business)', color: 'bg-amber-500 text-white' },
  'O-1B': { label: 'O-1B', description: 'Extraordinary Ability (Arts)', color: 'bg-amber-500 text-white' },
  'EB-1A': { label: 'EB-1A', description: 'Priority Workers', color: 'bg-green-600 text-white' },
  'EB-1B': { label: 'EB-1B', description: 'Outstanding Professors/Researchers', color: 'bg-green-600 text-white' },
  'EB-2': { label: 'EB-2', description: 'Advanced Degree', color: 'bg-green-600 text-white' },
  'EB-2 NIW': { label: 'EB-2 NIW', description: 'National Interest Waiver', color: 'bg-green-600 text-white' },
  'L-1A': { label: 'L-1A', description: 'Intracompany Transferee (Manager)', color: 'bg-purple-600 text-white' },
  'L-1B': { label: 'L-1B', description: 'Intracompany Transferee (Specialized)', color: 'bg-purple-600 text-white' },
} as const;

export const PROCESSING_STAGES = {
  'form-validation': { label: 'Form Validation', order: 1 },
  'evidence-review': { label: 'Evidence Review', order: 2 },
  'policy-matching': { label: 'Policy Matching', order: 3 },
  'risk-assessment': { label: 'Risk Assessment', order: 4 },
  'draft-generation': { label: 'Draft Generation', order: 5 },
} as const;

export const CHART_COLORS = {
  primary: '#0A2647',
  secondary: '#1E5AA8',
  success: '#2E7D32',
  warning: '#F9A825',
  error: '#C62828',
  info: '#1976D2',
  approved: '#2E7D32',
  denied: '#C62828',
  pending: '#1976D2',
  rfe: '#F9A825',
} as const;
