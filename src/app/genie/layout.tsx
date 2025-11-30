"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DM_Serif_Display } from "next/font/google";

const playfair = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const DISCOVER_SECTIONS = [
  { href: "/genie", label: "Discover" },
  { href: "/genie/chat", label: "Chat" },
  { href: "/genie/preferences", label: "Preferences" },
] as const;

export default function DiscoverLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = DISCOVER_SECTIONS.map((item) => {
    const isActive =
      item.href === "/genie"
        ? pathname === "/genie" || pathname?.startsWith("/genie/students")
        : pathname?.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "transition-colors",
          isActive
            ? "text-[#254031] font-medium"
            : "text-[#455B50] hover:text-[#254031]",
        )}
        onClick={() => setMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <div className="min-h-screen bg-white text-[#254031]">
      <header className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 pb-2">
        <div className="flex w-full max-w-5xl flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm sm:rounded-full sm:px-6">
          {/* Mobile row: logo + hamburger */}
          <div className="flex items-center justify-between sm:hidden">
            <Link
              href="/"
              className={`${playfair.className} text-md font-semibold text-[#254031] hover:text-[#1c3125]`}
            >
              Genius
            </Link>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(69,91,80,0.16)] text-[#254031]"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation menu</span>
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[2px] w-4 rounded-full bg-[#254031]" />
                <span className="block h-[2px] w-4 rounded-full bg-[#254031]" />
                <span className="block h-[2px] w-4 rounded-full bg-[#254031]" />
              </span>
            </button>
          </div>

          {/* Desktop row: logo left, nav centered, profile right */}
          <div className="hidden items-center gap-8 sm:flex">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className={`${playfair.className} text-md font-semibold text-[#254031] hover:text-[#1c3125]`}
              >
                Genius
              </Link>
            </div>

            <nav className="flex flex-1 items-center justify-center gap-6 text-sm">
              {navLinks}
            </nav>

            <button
              type="button"
              aria-label="Open profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#254031] text-white text-xs font-medium shadow-sm hover:bg-[#1c3125] transition-colors"
            >
              P
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen ? (
            <div className="mt-2 flex flex-col gap-2 sm:hidden">
              <nav className="flex flex-col gap-2 text-sm">
                {navLinks}
              </nav>
              <button
                type="button"
                aria-label="Open profile"
                className="mt-1 flex h-9 w-full items-center justify-center rounded-full bg-[#254031] text-white text-xs font-medium shadow-sm hover:bg-[#1c3125] transition-colors"
              >
                P
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="pt-24">
        <div className="mx-auto max-w-6xl px-4 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
