"use client";

import Link from "next/link";
import type { BeddingConfig } from "./bedding-config";

export function BeddingDemoFooter({
  config: c,
  base,
  stickyCtaGap = false,
}: {
  config: BeddingConfig;
  base: string;
  /** Extra bottom padding when a fixed bottom bar (e.g. PDP) overlaps the footer. */
  stickyCtaGap?: boolean;
}) {
  return (
    <footer
      className={`border-t border-[var(--bedding-border)] bg-[var(--bedding-footer-bg)] pt-12 text-[var(--bedding-footer-text)] ${
        stickyCtaGap ? "pb-28 sm:pb-24 lg:pb-12" : "pb-10"
      }`}
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Shop</p>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            {c.packages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`${base}/${p.slug ?? ""}`}
                  className="hover:opacity-100 hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">About</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--bedding-muted)]">
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                Our story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                Sustainability
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                Stores
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Help</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--bedding-muted)]">
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                Shipping & returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--bedding-fg)]">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Newsletter</p>
          <p className="mt-4 text-sm text-[var(--bedding-muted)]">
            Demo only — no data is collected.
          </p>
          <div className="mt-4 flex border border-[var(--bedding-border)] bg-[var(--bedding-surface)]">
            <input
              type="email"
              placeholder="Email"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
              readOnly
            />
            <button
              type="button"
              className="px-4 text-[11px] font-bold uppercase tracking-wider text-[var(--bedding-fg)]"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap items-center justify-center gap-4 px-4 opacity-50 sm:px-6 lg:px-10">
        <span className="text-[10px] font-semibold uppercase tracking-wider">Visa</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider">Mastercard</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider">Amex</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider">Shop Pay</span>
      </div>
      <p className="mt-8 text-center text-xs text-[var(--bedding-muted)]">
        © {new Date().getFullYear()} {c.websiteName} — demo storefront for Kreatale.
      </p>
    </footer>
  );
}
