"use client";

import { motion } from "framer-motion";
import { Container } from "./Container";
import { LinkButton } from "./Button";
import { AIAnswerDemo } from "./AIAnswerDemo";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const easing = [0.19, 1, 0.22, 1] as const;

export function Hero() {
  const reduceMotion = useSafeReducedMotion();

  const item = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="top" className="relative overflow-hidden field-grid">
      <Container className="relative grid gap-14 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
        >
          <motion.div
            variants={item}
            transition={{ duration: 0.6, ease: easing }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 font-mono-tech text-xs uppercase tracking-widest text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            AI Visibility &amp; Web
          </motion.div>

          <motion.h1
            variants={item}
            transition={{ duration: 0.7, ease: easing }}
            className="font-display mt-6 max-w-xl text-[2.6rem] leading-[1.08] font-medium tracking-tight sm:text-6xl"
          >
            Someone just asked AI who to call.{" "}
            <span className="italic text-gradient-ember">Was your name in the answer?</span>
          </motion.h1>

          <motion.p
            variants={item}
            transition={{ duration: 0.6, ease: easing }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            Homeowners are asking ChatGPT and Perplexity for a contractor before
            they ever open Google. Origin makes sure you&apos;re the name that
            comes back — then builds you a site fast enough and sharp enough to
            close the job when they click through.
          </motion.p>

          <motion.div
            variants={item}
            transition={{ duration: 0.6, ease: easing }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <LinkButton href="#contact">Get Your Free AI Visibility Check</LinkButton>
            <LinkButton href="#process" variant="secondary">
              See How It Works
            </LinkButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: easing }}
        >
          <AIAnswerDemo variant="hero" />
        </motion.div>
      </Container>
    </section>
  );
}
