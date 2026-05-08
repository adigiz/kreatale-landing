"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  MAXIMA_PLAY_LEARN_GROW,
  MAXIMA_PROCESS,
  MAXIMA_SERVICES,
} from "./maxima-data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.055, duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function MaximaSections() {
  const reduce = useReducedMotion();

  return (
    <>
      <section
        id="services"
        className="relative z-20 bg-[var(--color-beige)] px-5 py-20 lg:px-[3.125rem] lg:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="text-center text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--color-blue)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            Child Development Services
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 max-w-3xl text-center text-lg font-semibold leading-relaxed text-neutral-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.45 }}
          >
            We bring fun and curiosity to therapy, supporting each child&apos;s
            unique path to growth.
          </motion.p>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {MAXIMA_SERVICES.map((s, i) => (
              <motion.article
                key={s.title}
                className="rounded-[1.75rem] bg-[var(--color-white)] p-8 shadow-md transition-shadow hover:shadow-lg"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                variants={fadeUp}
              >
                <h3 className="text-xl font-extrabold text-[var(--color-red)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-neutral-800">
                  {s.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden bg-[var(--color-blue-moss)] px-5 py-16 lg:py-24">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-1 gap-y-2 lg:gap-x-2">
          {MAXIMA_PLAY_LEARN_GROW.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block text-[clamp(2.25rem,8vw,5rem)] font-extrabold lowercase leading-none text-[var(--color-blue)]"
              initial={{ opacity: 0, y: reduce ? 0 : 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: reduce ? 0 : i * 0.035,
                duration: reduce ? 0.01 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
      </section>

      <section
        id="early-intervention"
        className="relative z-20 bg-[var(--color-yellow)] px-5 py-20 lg:px-16 lg:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--color-black)]">
              About Maxima
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--color-black)]">
              The First Years Matter Most
            </h2>
          </motion.div>
          <motion.p
            className="text-base font-semibold leading-relaxed text-[var(--color-black)] lg:text-lg"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Our Early Intervention Program supports children in reaching key
            milestones across all areas of development. Early Intervention
            specialists and specialized therapists provide evidence-based
            supports in natural learning environments while giving families the
            tools and guidance to help their child thrive.
          </motion.p>
        </div>
      </section>

      <section
        id="areas"
        className="relative z-20 bg-[var(--color-white)] px-5 py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-[var(--color-blue)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Service Areas
          </motion.h2>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-xl font-bold leading-snug text-[var(--color-black)]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            We understand this can be a big step, but we made the process as
            quick, easy, and stress-free as possible.
          </motion.p>
          <motion.div
            className="mt-14 grid gap-8 text-left md:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {MAXIMA_PROCESS.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                className="rounded-[1.5rem] border border-[var(--color-gray-200)] bg-[var(--color-beige)] p-6"
              >
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-red)]">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-[var(--color-black)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-neutral-800">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <button
              type="button"
              className="rounded-[3.125rem] bg-[var(--color-red)] px-10 py-3.5 text-lg font-bold text-[var(--color-white)] shadow-sm transition-transform hover:scale-[1.02]"
            >
              Get started
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 bg-[var(--color-green-pale)] px-5 py-16 lg:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-black)]">
            Next stop
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-[var(--color-black)]">
            Adaptive Skills Training
          </h2>
          <Link
            href="#program-services"
            className="text-lg font-extrabold text-[var(--color-blue)] underline-offset-4 hover:underline"
          >
            Explore Ages 3-18
          </Link>
        </div>
      </section>

      <section className="relative z-20 bg-[var(--color-turquoise)] px-5 py-20 text-[var(--color-white)] lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            className="text-[clamp(1.5rem,4vw,2.75rem)] font-extrabold leading-snug"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            See life from{" "}
            <span className="whitespace-nowrap">a different angle</span>
            <span className="mt-5 block text-[clamp(1.1rem,2.8vw,1.65rem)] font-bold leading-snug">
              We don&apos;t treat disabilities.
              <br />
              We support differences, from birth to golden age.
            </span>
          </motion.p>
        </div>
      </section>

      <footer
        id="contact"
        className="relative z-20 bg-[var(--color-black)] px-5 py-14 text-[var(--color-light-gray)] lg:px-12"
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold text-[var(--color-white)]">
              Maxima Therapy
            </p>
            <p className="mt-2 text-sm leading-relaxed opacity-90">
              Next.js recreation for internal review — not affiliated with the
              live clinic.
            </p>
          </div>
          <div>
            <p className="font-bold text-[var(--color-white)]">Programs</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Early Intervention
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Adaptive Skills
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Workforce
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Residential
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-[var(--color-white)]">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Shop
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-[var(--color-white)]">Connect</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[var(--color-white)]">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="#areas" className="hover:text-[var(--color-white)]">
                  Service Areas
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 text-center text-xs text-neutral-500">
          Reference:{" "}
          <Link
            href="https://maximatherapy.com/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            maximatherapy.com
          </Link>
        </p>
      </footer>
    </>
  );
}
