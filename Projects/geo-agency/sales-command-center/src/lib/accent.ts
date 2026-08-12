export type Accent = "blue" | "violet" | "cyan" | "emerald" | "amber" | "rose";

interface AccentClasses {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  ring: string;
  dot: string;
  gradient: string;
}

const accentMap: Record<Accent, AccentClasses> = {
  blue: {
    text: "text-accent-blue",
    bg: "bg-accent-blue",
    bgSoft: "bg-accent-blue/12",
    border: "border-accent-blue/30",
    ring: "ring-accent-blue/40",
    dot: "bg-accent-blue shadow-[0_0_10px_var(--accent-blue)]",
    gradient: "from-accent-blue/25 via-accent-blue/5 to-transparent",
  },
  violet: {
    text: "text-accent-violet",
    bg: "bg-accent-violet",
    bgSoft: "bg-accent-violet/12",
    border: "border-accent-violet/30",
    ring: "ring-accent-violet/40",
    dot: "bg-accent-violet shadow-[0_0_10px_var(--accent-violet)]",
    gradient: "from-accent-violet/25 via-accent-violet/5 to-transparent",
  },
  cyan: {
    text: "text-accent-cyan",
    bg: "bg-accent-cyan",
    bgSoft: "bg-accent-cyan/12",
    border: "border-accent-cyan/30",
    ring: "ring-accent-cyan/40",
    dot: "bg-accent-cyan shadow-[0_0_10px_var(--accent-cyan)]",
    gradient: "from-accent-cyan/25 via-accent-cyan/5 to-transparent",
  },
  emerald: {
    text: "text-accent-emerald",
    bg: "bg-accent-emerald",
    bgSoft: "bg-accent-emerald/12",
    border: "border-accent-emerald/30",
    ring: "ring-accent-emerald/40",
    dot: "bg-accent-emerald shadow-[0_0_10px_var(--accent-emerald)]",
    gradient: "from-accent-emerald/25 via-accent-emerald/5 to-transparent",
  },
  amber: {
    text: "text-accent-amber",
    bg: "bg-accent-amber",
    bgSoft: "bg-accent-amber/12",
    border: "border-accent-amber/30",
    ring: "ring-accent-amber/40",
    dot: "bg-accent-amber shadow-[0_0_10px_var(--accent-amber)]",
    gradient: "from-accent-amber/25 via-accent-amber/5 to-transparent",
  },
  rose: {
    text: "text-accent-rose",
    bg: "bg-accent-rose",
    bgSoft: "bg-accent-rose/12",
    border: "border-accent-rose/30",
    ring: "ring-accent-rose/40",
    dot: "bg-accent-rose shadow-[0_0_10px_var(--accent-rose)]",
    gradient: "from-accent-rose/25 via-accent-rose/5 to-transparent",
  },
};

export function getAccent(accent: Accent): AccentClasses {
  return accentMap[accent];
}
