"use client";
import Link from "next/link";
import { QrCode, UserCheck, List, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllGuests } from "@/lib/firebase";
import Image from "next/image";

export default function Home() {
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const guests = await getAllGuests();
      setStats({
        total: guests.length,
        checkedIn: guests.filter((g) => g.checkedIn).length,
        pending: guests.filter((g) => !g.checkedIn).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const guests = await getAllGuests();

      const headers = [
        "Guest Name",
        "Ticket ID",
        "Checked In",
        "Created At",
        "Checked In At",
      ];
      const rows = guests.map((g) => [
        g.name,
        g.ticketId,
        g.checkedIn ? "Yes" : "No",
        new Date(g.createdAt).toLocaleString(),
        g.checkedIn ? new Date(g.checkedIn).toLocaleString() : "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wedding-guests-${Date.now()}.csv`;
      a.click();
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-10 h-screen flex flex-col justify-end">
      {/* <div className="text-center mb-12">
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-linear-to-br from-rose-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative border-2 border-rose-200/50 rounded-full p-8 flex items-center justify-center">
              <div className="text-8xl font-serif text-rose-100">TG</div>
            </div>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-serif text-rose-100 mb-3">
          Toluwani <span className="text-rose-300">&</span> Gbenga
        </h1>
        <p className="text-2xl text-rose-200/80 italic mb-2">#good&perfect</p>
        <div className="w-32 h-px bg-rose-300/50 mx-auto mb-8"></div>
        <p className="text-rose-100/70 text-lg max-w-2xl mx-auto mb-12">
          Welcome to our wedding management system. Manage invitations,
          check-ins, and celebrate with us!
        </p>
      </div> */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Link
          href="/add-guest"
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex ">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
                <QrCode className="text-rose-200" size={18} />
              </div>
            </div>
            <h3 className="text-md font-bold text-rose-100 mb-2">
              Generate Invitations
            </h3>
          </div>
          <p className="text-rose-200/70 text-sm">
            Create personalized QR code invitations for your guests
          </p>
        </Link>

        <Link
          href="/check-in"
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
                <UserCheck className="text-rose-200" size={18} />
              </div>
            </div>
            <h3 className="text-md font-bold text-rose-100 mb-2">
              Guest Check-in
            </h3>
          </div>
          <p className="text-rose-200/70 text-sm">
            Scan QR codes and check in guests at the venue
          </p>
        </Link>

        <Link
          href="/guest-list"
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
                <List className="text-rose-200" size={18} />
              </div>
            </div>
            <h3 className="text-md font-bold text-rose-100 mb-2">Guest List</h3>
          </div>
          <p className="text-rose-200/70 text-sm">
            View and manage all your wedding guests
          </p>
        </Link>

        <button
          onClick={handleExport}
          disabled={stats.total === 0}
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
                <Download className="text-rose-200" size={18} />
              </div>
            </div>
            <h3 className="text-md font-bold text-rose-100 mb-2">
              Export Data
            </h3>
          </div>
          <p className="text-rose-200/70">
            Download guest list as CSV spreadsheet
          </p>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-rose-200 mb-1">
            {loading ? "..." : stats.total}
          </div>
          <div className="text-sm text-rose-200/70">Total Guests</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-green-300 mb-1">
            {loading ? "..." : stats.checkedIn}
          </div>
          <div className="text-sm text-rose-200/70">Checked In</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-rose-300 mb-1">
            {loading ? "..." : stats.pending}
          </div>
          <div className="text-sm text-rose-200/70">Pending</div>
        </div>
      </div>
    </div>
  );
}
