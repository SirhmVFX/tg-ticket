"use client";
import Link from "next/link";
import { Home, QrCode, UserCheck, List } from "lucide-react";

export default function Navigation() {
  return (
    <nav className=" border-b border-rose-200/30 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-rose-100 font-bold text-xl">
            T&G Wedding
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-rose-200 hover:text-rose-100 flex items-center gap-1"
            >
              <Home size={20} /> Home
            </Link>
            <Link
              href="/add-guest"
              className="text-rose-200 hover:text-rose-100 flex items-center gap-1"
            >
              <QrCode size={20} /> Add Guest
            </Link>
            <Link
              href="/check-in"
              className="text-rose-200 hover:text-rose-100 flex items-center gap-1"
            >
              <UserCheck size={20} /> Check-in
            </Link>
            <Link
              href="/guest-list"
              className="text-rose-200 hover:text-rose-100 flex items-center gap-1"
            >
              <List size={20} /> Guests
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
