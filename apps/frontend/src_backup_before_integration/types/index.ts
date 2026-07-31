// Type definitions for the AI-Powered Smart Survey Tool

export type UserRole = 'admin' | 'supervisor' | 'enumerator' | 'citizen';

export type SurveyStatus = 'draft' | 'live' | 'closed' | 'upcoming';

export type QuestionType = 
  | 'short-text' 
  | 'long-text' 
  | 'number' 
  | 'date' 
  | 'single-choice' 
  | 'multi-choice' 
  | 'dropdown' 
  | 'rating' 
  | 'yes-no' 
  | 'consent' 
  | 'file-upload' 
  | 'location' 
  | 'household-roster' 
  | 'matrix';

export type DeliveryChannel = 'whatsapp' | 'sms' | 'ivr' | 'call' | 'ai-avatar' | 'web';

export type ResponseStatus = 'not-contacted' | 'contacted' | 'scheduled' | 'completed' | 'refused';

export type QualityFlagType = 'inconsistent' | 'too-fast' | 'gps-mismatch' | 'duplicate-device' | 'suspicious-pattern';

export type Language = 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  regionCodes: string[];
  lastActive?: Date;
  avatar?: string;
}

export interface Region {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  type: 'national' | 'state' | 'district' | 'local';
  parentCode?: string;
  lgdCode?: string;
}

export interface ConditionalLogic {
  questionId: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  value: string | number;
  action: 'show' | 'hide' | 'jump-to';
  targetBlockId?: string;
}

export interface Translation {
  en: string;
  hi: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: number | string;
  message: Translation;
}

export interface QuestionOption {
  id: string;
  label: Translation;
  value: string;
}

export interface SurveyBlock {
  id: string;
  type: QuestionType;
  label: Translation;
  helpText?: Translation;
  required: boolean;
  validations: ValidationRule[];
  options?: QuestionOption[];
  conditionalLogic?: ConditionalLogic[];
  isAISuggested?: boolean;
  isNewQuestion?: boolean;
  questionBankId?: string;
  order: number;
}

export interface SurveyAssignment {
  id: string;
  surveyId: string;
  regionCodes: string[];
  channels: DeliveryChannel[];
  startDate: Date;
  endDate: Date;
  reminderFrequency: number;
  targetResponses: number;
}

export interface Survey {
  id: string;
  title: Translation;
  description: Translation;
  objective: Translation;
  status: SurveyStatus;
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  blocks: SurveyBlock[];
  assignments: SurveyAssignment[];
  eligibilityCriteria?: Translation;
  faq?: { question: Translation; answer: Translation }[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: Record<string, any>;
  status: ResponseStatus;
  consentGiven: boolean;
  consentTimestamp?: Date;
  startedAt: Date;
  submittedAt?: Date;
  paradata: Paradata;
  qualityFlags: QualityFlag[];
}

export interface Paradata {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    deviceId: string;
  };
  networkStatus: 'online' | 'offline';
  revisionCount: number;
}

export interface QualityFlag {
  type: QualityFlagType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

export interface QuestionBankItem {
  id: string;
  category: string;
  standardCode: string;
  label: Translation;
  type: QuestionType;
  description: Translation;
  options?: QuestionOption[];
  usageCount: number;
  tags: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'assignment' | 'reminder' | 'quality-alert' | 'message';
  title: Translation;
  message: Translation;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface MessageTemplate {
  id: string;
  channel: DeliveryChannel;
  template: Translation;
  status: 'queued' | 'sent' | 'failed';
  sentAt?: Date;
}

export interface DashboardStats {
  totalSurveys: number;
  liveSurveys: number;
  responsesReceived: number;
  responsesPending: number;
  qualityFlags: number;
  avgCompletionTime: number;
}

export interface EnumeratorPerformance {
  enumeratorId: string;
  name: string;
  completedVisits: number;
  pendingCallbacks: number;
  avgCompletionTime: number;
  flaggedEntries: number;
  lastActive: Date;
}

export interface MapData {
  regionCode: string;
  regionName: string;
  completed: number;
  pending: number;
  flagged: number;
  completionRate: number;
  lastUpdated: Date;
}
