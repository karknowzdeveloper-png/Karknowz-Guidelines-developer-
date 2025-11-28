export interface AppListing {
  appName: string;
  shortDescription: string;
  fullDescription: string;
  iconUrl?: string;
  category: string;
  keywords: string[];
}

export interface OptimizationResult {
  title: string;
  shortDescription: string;
  fullDescription: string;
  reasoning: string;
}

export interface AuditIssue {
  severity: 'low' | 'medium' | 'high';
  field: 'title' | 'shortDescription' | 'fullDescription' | 'general';
  message: string;
  suggestion: string;
}

export enum AppSection {
  METADATA = 'metadata',
  ICON = 'icon',
  AUDIT = 'audit',
  PREVIEW = 'preview'
}

export interface GeminiState {
  isLoading: boolean;
  error: string | null;
}
