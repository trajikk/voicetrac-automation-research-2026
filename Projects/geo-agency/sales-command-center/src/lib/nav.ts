export interface NavItem {
  label: string;
  href: string;
  icon: "LayoutDashboard" | "Users" | "MapPinned" | "LayoutGrid";
  description: string;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
    description: "Overview & activity",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: "Users",
    description: "Pipeline & outreach",
  },
  {
    label: "Territories",
    href: "/territories",
    icon: "MapPinned",
    description: "Exclusive lockouts",
  },
  {
    label: "Tools Hub",
    href: "/tools",
    icon: "LayoutGrid",
    description: "Agency utilities",
  },
];
