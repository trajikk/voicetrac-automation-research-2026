export type LeadStatus =
  | "New"
  | "Contacted"
  | "Demo Scheduled"
  | "Negotiating"
  | "Closed Won"
  | "Closed Lost";

export type ExclusiveStatus = "Exclusive Locked" | "Available" | "Pending Lock";

export interface LeadNote {
  id: string;
  body: string;
  createdAt: string; // ISO datetime
}

export interface Lead {
  id: string;
  company: string;
  niche: string;
  city: string;
  state: string;
  status: LeadStatus;
  exclusiveStatus: ExclusiveStatus;
  contactName: string;
  phone: string;
  email: string;
  website: string;
  competitors: string[];
  background: string;
  notes: LeadNote[];
  lastContact: string; // ISO date
  dealValue: number; // MRR in USD
  source: string;
  avatarAccent: "blue" | "violet" | "cyan" | "emerald" | "amber" | "rose";
  /** Consecutive unanswered call attempts since the last time they picked up. Resets to 0 on answer. */
  callAttempts: number;
  /** ISO date this lead is next due for a call — set by the no-answer cadence. Unset once answered or burned. */
  nextCallDate?: string;
}

export type TerritoryStatus = "Locked" | "Available" | "Reserved";

export interface Territory {
  id: string;
  niche: string;
  city: string;
  state: string;
  status: TerritoryStatus;
  lockedBy?: string;
  lockedSince?: string;
  monthlyValue?: number;
  population: string;
  competitionLevel: "Low" | "Medium" | "High";
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: "blue" | "violet" | "cyan" | "emerald" | "amber" | "rose";
  status: "active" | "coming-soon";
  href: string;
}

export type ActivityType =
  | "call"
  | "email"
  | "demo"
  | "note"
  | "status"
  | "territory"
  | "contract";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO date
  leadCompany?: string;
}
