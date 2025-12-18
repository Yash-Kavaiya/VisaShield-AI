// VisaGuardian AI Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'attorney' | 'paralegal' | 'officer' | 'admin';
  avatar?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  applicantName: string;
  applicantNameRedacted: string;
  aNumber?: string;
  visaType: VisaType;
  status: CaseStatus;
  aiConfidence: number;
  assignedAttorney: string;
  assignedAttorneyId: string;
  filedDate: string;
  priorityDate?: string;
  lastUpdated: string;
  employer?: string;
  jobTitle?: string;
  country: string;
}

export type VisaType = 'H-1B' | 'O-1A' | 'O-1B' | 'EB-1A' | 'EB-1B' | 'EB-2' | 'EB-2 NIW' | 'L-1A' | 'L-1B';

export type CaseStatus = 
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'pending-review'
  | 'rfe-issued'
  | 'approved'
  | 'denied'
  | 'withdrawn';

export interface CaseDetail extends Case {
  applicantInfo: ApplicantInfo;
  petitionDetails: PetitionDetails;
  documents: Document[];
  aiAnalysis?: AIAnalysis;
  timeline: TimelineEvent[];
  notes: Note[];
}

export interface ApplicantInfo {
  fullName: string;
  dateOfBirth: string;
  countryOfBirth: string;
  countryOfCitizenship: string;
  passportNumber?: string;
  currentStatus?: string;
  previousVisas?: string[];
  photo?: string;
}

export interface PetitionDetails {
  employerName: string;
  employerAddress: string;
  employerEIN?: string;
  jobTitle: string;
  socCode: string;
  wageLevel: number;
  offeredWage: number;
  workLocation: string;
  startDate: string;
  endDate?: string;
  fullTime: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  status: 'pending' | 'verified' | 'rejected' | 'missing';
  uploadDate?: string;
  fileUrl?: string;
  notes?: string;
}

export type DocumentType = 'pdf' | 'image' | 'form' | 'other';

export type DocumentCategory = 
  | 'forms'
  | 'evidence'
  | 'correspondence'
  | 'ai-reports';

export interface AIAnalysis {
  overallScore: number;
  recommendation: 'likely-approvable' | 'requires-review' | 'high-risk';
  criteriaResults: CriteriaResult[];
  chainOfThought: ChainOfThoughtStep[];
  citations: Citation[];
  riskFactors: RiskFactor[];
  hallucationCheckPassed: boolean;
  processingTime: number;
  modelVersion: string;
  generatedAt: string;
}

export interface CriteriaResult {
  criterionName: string;
  criterionDescription: string;
  status: 'pass' | 'fail' | 'partial' | 'pending';
  confidence: number;
  evidence: string[];
  reasoning: string;
}

export interface ChainOfThoughtStep {
  stepNumber: number;
  action: string;
  evidenceReferenced: string[];
  conclusion: string;
  confidence: number;
}

export interface Citation {
  id: string;
  source: string;
  reference: string;
  relevanceScore: number;
  verified: boolean;
  url?: string;
}

export interface RiskFactor {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  type: 'filed' | 'received' | 'processing' | 'review' | 'decision' | 'rfe' | 'response';
  actor?: string;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  isPrivate: boolean;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  caseId?: string;
  read: boolean;
}

export interface Metric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: string;
  color?: string;
}

export interface ProcessingQueueItem {
  caseId: string;
  caseNumber: string;
  visaType: VisaType;
  stage: ProcessingStage;
  progress: number;
  elapsedTime: number;
  estimatedTime?: number;
}

export type ProcessingStage = 
  | 'form-validation'
  | 'evidence-review'
  | 'policy-matching'
  | 'risk-assessment'
  | 'draft-generation';

export interface AnalyticsData {
  processingVolume: TimeSeriesData[];
  hallucationHeatmap: HeatmapData[];
  costByCategory: CategoryData[];
  outcomeDistribution: DistributionData[];
  monitors: Monitor[];
  eventStream: LogEvent[];
}

export interface TimeSeriesData {
  date: string;
  approved: number;
  denied: number;
  pending: number;
  rfe: number;
}

export interface HeatmapData {
  visaType: string;
  period: string;
  rate: number;
}

export interface CategoryData {
  category: string;
  cost: number;
  volume: number;
}

export interface DistributionData {
  name: string;
  value: number;
  color: string;
}

export interface Monitor {
  id: string;
  name: string;
  status: 'ok' | 'alert' | 'warn' | 'no-data';
  lastCheck: string;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  service: string;
  caseId?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  children?: NavItem[];
  badge?: number;
}
