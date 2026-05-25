export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias?: string;
  qrCodeData?: string;
  isActive: boolean;
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface ClickTrend {
  date: string;
  clicks: number;
}

export interface Distribution {
  name: string;
  value: number;
}

export interface AnalyticsSummary {
  totalClicks: number;
  uniqueVisitors: number;
  clickTrend: ClickTrend[];
  browserDistribution: Distribution[];
  deviceDistribution: Distribution[];
  osDistribution?: Distribution[];
  countryDistribution: Distribution[];
  referrerDistribution?: Distribution[];
}

export interface SecurityCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface SafetyResult {
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK';
  safe: boolean;
  warnings: string[];
  checks: SecurityCheck[];
}

export interface DashboardStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  qrCodesGenerated: number;
  spamLinksBlocked: number;
}

export interface BlacklistedDomain {
  id: number;
  domain: string;
  reason: string;
  createdAt: string;
}
