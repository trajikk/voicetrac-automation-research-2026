"use client";

import { useState } from "react";
import { PhoneMissed, Voicemail, Sparkles, CalendarClock, CornerDownLeft } from "lucide-react";
import type { Lead } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LeadNotesPanelProps {
  lead: Lead;
  onAddNote: (leadId: string, body: string) => void;
}

const quickTags = [
  { label: "No Answer", icon: PhoneMissed },
  { label: "Left Voicemail", icon: Voicemail },
  { label: "Interested", icon: Sparkles },
  { label: "Follow-up Needed", icon: CalendarClock },
] as const;

export function LeadNotesPanel({ lead, onAddNote }: LeadNotesPanelProps) {
  const [draft, setDraft] = useState("");

  const sortedNotes = [...lead.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const visibleNotes = sortedNotes.slice(0, 5);

  function applyTag(label: string) {
    setDraft((prev) => (prev.trim() ? `${prev.trim()} — ${label}. ` : `${label}. `));
  }

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddNote(lead.id, trimmed);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quick tags */}
      <div className="flex flex-wrap gap-1.5">
        {quickTags.map((tag) => {
          const Icon = tag.icon;
          return (
            <button
              key={tag.label}
              type="button"
              onClick={() => applyTag(tag.label)}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-accent-blue/30 hover:bg-accent-blue/10 hover:text-accent-blue"
            >
              <Icon className="size-3.5" />
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Composer */}
      <div className="relative">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Log what happened on the call…"
          className="min-h-[4.5rem] resize-none border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] pr-4 text-sm focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground/70 sm:flex">
            <CornerDownLeft className="size-3" />
            ⌘/Ctrl + Enter to add
          </span>
          <Button
            type="button"
            size="sm"
            onClick={submit}
            disabled={!draft.trim()}
            className="ml-auto bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_16px_-6px_var(--accent-violet)] hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
          >
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes list */}
      {visibleNotes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/[0.128] dark:border-white/[0.08] px-4 py-5 text-center text-xs text-muted-foreground">
          No notes yet — add one after your first call.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleNotes.map((note, i) => (
            <div
              key={note.id}
              className={cn(
                "glass-panel glass-edge rounded-xl px-3.5 py-3",
                i === 0 && "border-accent-blue/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground/85">{note.body}</p>
                <span className="shrink-0 text-[11px] whitespace-nowrap text-muted-foreground">
                  {formatRelativeDate(note.createdAt)}
                </span>
              </div>
            </div>
          ))}
          {sortedNotes.length > 5 && (
            <p className="text-center text-[11px] text-muted-foreground/70">
              Showing 5 of {sortedNotes.length} notes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
