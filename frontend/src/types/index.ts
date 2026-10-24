export type Language = 'qu' | 'es';

export type QuechuaBranch = 'sureno' | 'central' | 'norteno' | 'amazonico';

export type QuechuaDialect =
  | 'quechua_chanka'
  | 'quechua_cusco_collao'
  | 'quechua_central_ancash'
  | 'quechua_central_huanuco_pasco'
  | 'quechua_central_junin_lima'
  | 'quechua_norteno_cajamarca'
  | 'quechua_norteno_inkawasi'
  | 'quechua_amazonico_lamas'
  | 'quechua_amazonico_napo';

export interface VariantInfo {
  id: QuechuaDialect;
  branch: QuechuaBranch;
  label: string;
  iso: string;
  regions: string[];
  features: string;
}

export interface BranchInfo {
  id: QuechuaBranch;
  label: string;
  regions: string[];
  description: string;
  variants: VariantInfo[];
}

export interface TranslationInfo {
  language: string;
  dialect?: string | null;
  branch?: string | null;
  text: string | null;
  validated: boolean;
  notes?: string;
}

export interface SourceCitation {
  document_id: string;
  title: string;
  issuer: string;
  article: string;
  article_content?: string;
  official_url: string;
  publication_date?: string;
}

export interface ReferralService {
  name: string;
  phone: string;
  description: string;
  official_url: string;
  is_urgent: boolean;
}

export interface ChatResponse {
  status: 'answered' | 'insufficient_evidence' | 'off_topic' | 'unethical' | 'urgent_violence' | 'detention';
  input_language: string;
  detected_dialect?: string;
  normalized_query_es?: string;
  answer: string;
  translation: TranslationInfo;
  sources: SourceCitation[];
  limitations: string[];
  requires_human_review: boolean;
  next_steps: string[];
  referral_service?: ReferralService;
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  language: 'qu' | 'es';
  timestamp: string;
  chatResponse?: ChatResponse;
}

export interface LegalServiceInfo {
  id: string;
  name: string;
  phone: string;
  channel: string;
  languages: string[];
  coverage: string;
  description: string;
  official_url: string;
}

export interface QualityMetrics {
  status: string;
  benchmark_summary: {
    total_test_cases: number;
    citations_precision: number;
    legal_fidelity: number;
    linguistic_quality: number;
    correct_abstention_rate: number;
    avg_latency_seconds: number;
  };
  dialect_distribution: Record<string, number>;
  corpus_stats: {
    verified_articles: number;
    official_issuers: string[];
    pending_reviews: number;
    approved_reviews: number;
  };
}
