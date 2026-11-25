"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "@/components/cms/EImage";
import { ArrowUpRight, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import E from "@/components/cms/E";

// Top navigation of the BOLT 3.0 website.
export default function BoltNavbar({ icetiteUrl, technextUrl = "" }: { icetiteUrl: string; technextUrl?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => setLoggedIn(/(?:^|;\s*)bolt_logged_in=1/.test(document.cookie)), []);

  const links = [
    { label: "Home", href: "/#hero" },
    { label: "About BOLT", href: "/#about" },
    { label: "Domains & Tracks", href: "/#domains" },
    { label: "BOLT 2.0 Gallery", href: "/#gallery" },
    { label: "Register", href: "/#register" },
    { label: "Events", href: "/events" },
  ];
  const account = { href: loggedIn ? "/dashboard" : "/login", label: loggedIn ? "Dashboard" : "Login" };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-primary border-b border-white/15 shadow-xl backdrop-blur-md">
      <nav className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4" aria-label="BOLT 3.0 Navigation">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-8 sm:h-9 w-28 sm:w-36">
            <Image src="/logos/bolt-logo-white.png" alt="BOLT 3.0 Hackathon" fill sizes="(max-width: 640px) 112px, 144px" className="object-contain object-left" priority />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-semibold text-white/85 hover:text-[#CCFF00] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
              <E f="c.BoltNavbar">{link.label}</E>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={account.href}
            className="inline-flex items-center justify-center gap-1.5 h-9 rounded-full bg-[#CCFF00] px-4 text-sm font-bold text-brand-primary shadow-sm hover:brightness-95 transition-all shrink-0"
          >
            {loggedIn ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            <span className="hidden sm:inline">{account.label}</span>
          </Link>
          <a
            href={icetiteUrl}
            title="ic-ETITE'28 conference website"
            className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-105 shrink-0"
          >
            <div className="relative h-4 sm:h-5 w-20 sm:w-24">
              <Image src="/logos/ic-etite28-cropped-transparent.png" alt="ic-ETITE'28 Conference" fill sizes="96px" className="object-contain" priority />
            </div>
          </a>
          {technextUrl && (
            <a
              href={technextUrl}
              title="TechNext '28 National Industrial Expo"
              className="hidden md:inline-flex items-center justify-center h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#F37021]/80 shadow-[0_0_12px_rgba(243,112,33,0.25)] transition-all hover:scale-105 shrink-0"
            >
              <div className="relative h-4 sm:h-5 w-16 sm:w-22">
                <Image src="/logos/technext-logo.png" alt="TechNext '28 Expo" fill sizes="100px" className="object-contain" priority />
              </div>
            </a>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
            aria-label="Toggle BOLT menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#CCFF00]" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-brand-primary-dark border-t border-[#CCFF00]/30 px-6 py-5 shadow-2xl space-y-3">
          <div className="flex flex-col gap-1">
            <Link href={account.href} onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-lg text-sm font-bold text-[#CCFF00] hover:bg-white/10">
              {account.label}
            </Link>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-white hover:text-[#CCFF00] hover:bg-white/10"
              >
                <E f="c.BoltNavbar">{link.label}</E>
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 space-y-2">
            <a href={icetiteUrl} className="w-full py-2.5 px-4 rounded-xl bg-brand-secondary text-white font-bold text-sm flex items-center justify-center gap-2">
              <div className="relative h-5 w-20 shrink-0">
                <Image src="/logos/ic-etite28-cropped-transparent.png" alt="ic-ETITE'28" fill sizes="80px" className="object-contain" />
              </div>
              <span>
                <E f="c.BoltNavbar">{"ic-ETITE'28 conference"}</E>
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#CCFF00]" />
            </a>
            {technextUrl && (
              <a href={technextUrl} className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 border border-[#F37021]/50">
                <div className="relative h-5 w-24 shrink-0">
                  <Image src="/logos/technext-logo.png" alt="TechNext '28" fill sizes="96px" className="object-contain" />
                </div>
                <span>
                  <E f="c.BoltNavbar">{"TechNext '28 expo"}</E>
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#84E320]" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
