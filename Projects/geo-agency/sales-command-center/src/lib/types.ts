export type LeadStatus =
  | "New"
  | "Contacted"
  | "Demo Scheduled"
  | "Negotiating"
  | "Closed Won"
  | "Closed Lost";

export type ExclusiveStatus = "Exclusive Locked" | "Available" | "Pending Lock";

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
  notes: string;
  lastContact: string; // ISO date
  dealValue: number; // MRR in USD
  source: string;
  avatarAccent: "blue" | "violet" | "cyan" | "emerald" | "amber" | "rose";
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
