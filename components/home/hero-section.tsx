"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

const SPOTLIGHT_HREF = "/tests/husband-score-check";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-brand-purple/25 blur-3xl" />
        <div className="absolute -right-10 top-24 h-64 w-64 rounded-full bg-brand-pink/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-72 rounded-full bg-amber-100/70 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col justify-center px-4 py-12 sm:min-h-[70vh] sm:px-6 sm:py-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl leading-tight text-brand-purple-deep sm:text-5xl md:text-6xl"
        >
          趣味测评
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 max-w-xl text-xl font-medium leading-snug text-ink sm:text-2xl"
        >
          首推卖老公：五维打分，短板劝退
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-4 max-w-md text-sm leading-relaxed text-ink/60 sm:text-base"
        >
          体贴、听劝、家务、仪式感、靠谱——最短板决定人设，趣味玩梗可分享。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button asChild variant="soft" size="lg">
            <Link href={SPOTLIGHT_HREF}>去测卖老公</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/#featured">浏览更多测评</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-[#f3e8ff] via-[#ffe4f1] to-[#fff4e0] p-1 shadow-lift"
        >
          <Link
            href={SPOTLIGHT_HREF}
            className="relative block h-40 rounded-[1.75rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(244,114,182,0.28),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(167,139,250,0.35),transparent_45%)] sm:h-48"
          >
            <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-widest text-ink/45">本周首推</p>
                <p className="mt-1 font-display text-lg text-ink/80">
                  卖老公五维打分 · 短板定罪
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 px-3 py-2 text-xs text-ink/60 backdrop-blur">
                全过线才续约（趣味）
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
