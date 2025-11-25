"use client";
import Link from "next/link";
import { Home, QrCode, UserCheck, List, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-button")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close menu on route change

  const navLinks = [
    { href: "/", icon: <Home size={20} />, label: "Home" },
    { href: "/add-guest", icon: <QrCode size={20} />, label: "Add Guest" },
    { href: "/check-in", icon: <UserCheck size={20} />, label: "Check-in" },
    { href: "/guest-list", icon: <List size={20} />, label: "Guests" },
  ];

  return (
    <nav
      className={`fixed w-full transition-all duration-300 z-50 ${
        scrolled
          ? "bg-rose-900/90 backdrop-blur-md border-b border-rose-200/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-rose-100 font-bold text-xl shrink-0">
            T&G Wedding
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-rose-200 hover:text-rose-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <span className="hidden sm:inline">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hamburger-button inline-flex items-center justify-center p-2 rounded-md text-rose-200 hover:text-rose-100 hover:bg-rose-800/30 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="mobile-menu md:hidden bg-rose-900/95 backdrop-blur-lg border-t border-rose-200/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-rose-200 hover:bg-rose-800/30 hover:text-rose-100  px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
