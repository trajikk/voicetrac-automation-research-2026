"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "./icons";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Isn't this just SEO with a new name?",
    answer:
      "No — and we won't pretend it is. Traditional SEO is still the foundation; AI visibility is what's built on top of it. If a company tells you SEO is dead, that's a sales pitch, not the truth. We do both, because you actually need both.",
  },
  {
    question: "Can you guarantee I'll show up in AI answers?",
    answer:
      "No, and anyone who tells you they can is not being straight with you — nobody can guarantee inclusion in a system they don't control, including Google or OpenAI themselves. What we can do is show you exactly where the gaps are, close them properly, and prove — with real data, not a promise — whether it's working.",
  },
  {
    question: "I already have a website. Why do I need this?",
    answer:
      "Different question than you're used to being asked. It's not “is your website good” — it's “does it show up when someone asks an AI who to call.” Those are two different problems, and a nice-looking site can still lose both.",
  },
  {
    question: "Why should I go with a newer agency instead of an established one?",
    answer:
      "Because you'll talk to the person doing the actual work, every time — not an account manager relaying updates from a team you never meet. Twenty-five years of real sales experience went into building this, not a stock agency playbook.",
  },
  {
    question: "What if I'm not ready to commit to a full site rebuild?",
    answer:
      "Start with the free check. There's no obligation attached to finding out where you stand.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useSafeReducedMotion();

  return (
    <div className="divide-y divide-border-soft border-y border-border-soft">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-lg font-medium tracking-tight sm:text-xl">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="grid h-8 w-8 flex-none place-items-center rounded-full border border-border text-ember"
              >
                <PlusIcon className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.19, 1, 0.22, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 text-base leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
