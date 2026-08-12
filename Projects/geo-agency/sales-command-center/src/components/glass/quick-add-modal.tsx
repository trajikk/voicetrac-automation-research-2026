"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Accent } from "@/lib/accent";
import type { Lead } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (lead: Lead) => void;
}

const accents: Accent[] = ["blue", "violet", "cyan", "emerald", "amber", "rose"];

const emptyForm = {
  company: "",
  niche: "",
  city: "",
  state: "",
  contactName: "",
  phone: "",
  email: "",
  website: "",
  background: "",
};

export function QuickAddModal({ open, onOpenChange, onAdd }: QuickAddModalProps) {
  const [form, setForm] = useState(emptyForm);

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim()) return;

    const lead: Lead = {
      id: `ld-${Date.now()}`,
      company: form.company.trim(),
      niche: form.niche.trim() || "Uncategorized",
      city: form.city.trim() || "—",
      state: form.state.trim() || "—",
      status: "New",
      exclusiveStatus: "Available",
      contactName: form.contactName.trim() || "Unknown",
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      competitors: [],
      background: form.background.trim(),
      notes: [],
      lastContact: new Date().toISOString().slice(0, 10),
      dealValue: 0,
      source: "Manual Entry",
      avatarAccent: accents[Math.floor(Math.random() * accents.length)],
    };

    onAdd(lead);
    setForm(emptyForm);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel-strong border-black/[0.144] dark:border-white/[0.09] sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue via-accent-violet to-accent-cyan">
              <Sparkles className="size-4 text-white" />
            </div>
            <DialogTitle>Quick Add Lead</DialogTitle>
            <DialogDescription>
              Add a new prospect to the pipeline. You can fill in the rest later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-5">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="company">Company name</Label>
              <Input
                id="company"
                required
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="e.g. Summit Ridge Dental"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                value={form.niche}
                onChange={(e) => update("niche", e.target.value)}
                placeholder="e.g. Dental"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactName">Contact name</Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                placeholder="e.g. Dr. Melissa Hart"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Austin"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                placeholder="e.g. TX"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(512) 555-0148"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="company.com"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="contact@company.com"
                className="border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="background">Background</Label>
              <Textarea
                id="background"
                value={form.background}
                onChange={(e) => update("background", e.target.value)}
                placeholder="Anything worth remembering about this lead…"
                className="min-h-20 border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] hover:opacity-90"
            >
              Add Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
