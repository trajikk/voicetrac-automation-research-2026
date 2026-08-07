"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildAnswerLines, buildQuery, trades, type Trade } from "@/lib/aiDemo";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Phase = "query" | "thinking" | "answering" | "done";

type AIAnswerDemoProps = {
  variant?: "hero" | "full";
};

export function AIAnswerDemo({ variant = "hero" }: AIAnswerDemoProps) {
  const reduceMotion = useSafeReducedMotion();
  const [trade, setTrade] = useState<Trade>("Fencing Contractor");
  const [city, setCity] = useState("Denver, CO");
  const [businessName, setBusinessName] = useState("");
  const [playKey, setPlayKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("query");
  const [visibleLines, setVisibleLines] = useState(0);

  const query = buildQuery(trade, city || "your area");
  const answerLines = buildAnswerLines(trade, city || "your area", businessName.trim());

  // When the visitor prefers reduced motion, skip the timed sequence
  // entirely and show the settled end state.
  const displayPhase: Phase = reduceMotion ? "done" : phase;
  const displayVisibleLines = reduceMotion ? answerLines.length : visibleLines;

  useEffect(() => {
    if (reduceMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setPhase("query");
        setVisibleLines(0);
      }, 0)
    );
    timers.push(setTimeout(() => setPhase("thinking"), 700));
    timers.push(setTimeout(() => setPhase("answering"), 1500));

    answerLines.forEach((_, index) => {
      timers.push(
        setTimeout(() => setVisibleLines(index + 1), 1500 + (index + 1) * 480)
      );
    });

    timers.push(
      setTimeout(
        () => setPhase("done"),
        1500 + answerLines.length * 480 + 300
      )
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey, reduceMotion, trade, city, businessName]);

  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-5 sm:p-7">
      {variant === "full" && (
        <div className="mb-6 grid gap-3 border-b border-border-soft pb-6 sm:grid-cols-3">
          <label className="text-xs text-muted">
            Trade
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value as Trade)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-ember-line focus:outline-none"
            >
              {trades.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted">
            City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Denver, CO"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-2 focus:border-ember-line focus:outline-none"
            />
          </label>
          <label className="text-xs text-muted">
            Your business name (optional)
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Ridgeline Fencing"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-2 focus:border-ember-line focus:outline-none"
            />
          </label>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="mt-1 h-6 w-6 flex-none rounded-full bg-border-soft" aria-hidden="true" />
        <div className="rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-3 text-sm text-foreground/90">
          {query}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <div
          className="mt-1 grid h-6 w-6 flex-none place-items-center rounded-full border border-ember-line text-ember"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5L3.5 11 10 9l2-6.5Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="min-h-[7.5rem] flex-1 rounded-2xl rounded-tl-sm border border-ember-line/40 bg-ember-soft px-4 py-3.5">
          {displayPhase === "thinking" && (
            <div className="flex gap-1 py-1" aria-label="Generating response">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-ember"
                  animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}

          {(displayPhase === "answering" || displayPhase === "done") && (
            <ul className="space-y-2 font-mono-tech text-[13px] leading-relaxed text-foreground/90">
              <AnimatePresence>
                {answerLines.slice(0, displayVisibleLines).map((line, index) => {
                  const isLast = index === answerLines.length - 1;
                  return (
                    <motion.li
                      key={line}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className={isLast ? "font-semibold text-ember-bright" : undefined}
                    >
                      {line}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      {variant === "hero" && (
        <p className="mt-4 font-mono-tech text-xs tracking-wide text-muted">
          Illustrative example — this is the shape of the check we run for you, free.
        </p>
      )}

      {variant === "full" && (
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border-soft pt-5">
          <button
            type="button"
            onClick={() => setPlayKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-ember-line hover:text-ember-bright"
          >
            Run the check again
          </button>
          <p className="font-mono-tech text-xs text-muted">
            Illustrative demo — not a live query to ChatGPT or Perplexity. The real check we run for your business is free.
          </p>
        </div>
      )}
    </div>
  );
}
