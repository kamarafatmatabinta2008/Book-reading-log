"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavAuthClient from "@/components/NavAuthClient";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
];

export default function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 text-lg shadow-sm shadow-slate-200/50 dark:shadow-black/20">
            📚
          </div>
          <div>
            <Link href="/" className="text-lg font-black tracking-tight text-slate-950 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950">
              REVO
            </Link>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Reading reimagined</p>
          </div>
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
          >
            Create account
          </Link>
          <div className="hidden lg:block">
            <NavAuthClient />
          </div>
        </div>

        <button
          ref={buttonRef}
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-900 transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-950 md:hidden"
        >
          <span className="sr-only">Toggle navigation menu</span>
          <span className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${isOpen ? "translate-y-1.5 rotate-45" : "-translate-y-1.5"}`} />
          <span className={`block h-0.5 w-6 rounded-full bg-current transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-6 rounded-full bg-current transition-transform duration-300 ${isOpen ? "-translate-y-1.5 -rotate-45" : "translate-y-1.5"}`} />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden" aria-hidden="true" />
        )}

        <div
          ref={menuRef}
          className={`fixed inset-x-0 top-0 z-50 mt-16 overflow-hidden bg-white/95 dark:bg-gray-950/95 pb-6 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-all duration-300 md:hidden ${isOpen ? "max-h-[100vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 pt-6 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-base font-semibold text-slate-900 transition duration-200 hover:border-slate-300 hover:bg-slate-100 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-3xl bg-blue-600 px-5 py-4 text-left text-base font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
            >
              Create account
            </Link>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-800 dark:bg-gray-900">
              <NavAuthClient />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
