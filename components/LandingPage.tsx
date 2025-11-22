import { Download, List, UserCheck, QrCode } from "lucide-react";
import { PageProps } from "@/types/guest";
import Image from "next/image";

const LandingPage = ({ guests, setCurrentRoute, exportToCSV }: PageProps) => (
  <div className="relative min-h-screen bg-linear-to-b from-[#8B4049] via-[#6B2F36] to-[#2C1215] flex items-center justify-center p-4">
    <div className=" absolute top-0 left-0 bottom-0 right-0"></div>
    <div className="max-w-4xl w-full">
      {/* Logo and Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-linear-to-br from-rose-200/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative border-2 border-rose-200/50 rounded-full p-8 flex items-center justify-center">
              <div className="text-8xl font-serif text-rose-100">TG</div>
            </div>
            <div className="absolute -top-4 -right-4">
              <svg className="w-24 h-24 text-rose-200/70" viewBox="0 0 100 100">
                <path
                  d="M20,40 Q30,20 40,30 L50,20 Q60,30 65,25"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                />
                <circle cx="25" cy="35" r="8" fill="currentColor" />
                <circle cx="45" cy="25" r="6" fill="currentColor" />
              </svg>
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
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => setCurrentRoute("add-guest")}
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left hover:scale-105"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
              <QrCode className="text-rose-200" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-100 mb-2">
            Generate Invitations
          </h3>
          <p className="text-rose-200/70">
            Create personalized QR code invitations for your guests
          </p>
        </button>

        <button
          onClick={() => setCurrentRoute("check-in")}
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left hover:scale-105"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
              <UserCheck className="text-rose-200" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-100 mb-2">
            Guest Check-in
          </h3>
          <p className="text-rose-200/70">
            Scan QR codes and check in guests at the venue
          </p>
        </button>

        <button
          onClick={() => setCurrentRoute("guest-list")}
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left hover:scale-105"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
              <List className="text-rose-200" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-100 mb-2">Guest List</h3>
          <p className="text-rose-200/70">
            View and manage all your wedding guests
          </p>
        </button>

        <button
          onClick={exportToCSV}
          disabled={!guests || guests.length === 0}
          className="group bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-rose-500/20 p-4 rounded-xl group-hover:bg-rose-500/30 transition">
              <Download className="text-rose-200" size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-100 mb-2">Export Data</h3>
          <p className="text-rose-200/70">
            Download guest list as CSV spreadsheet
          </p>
        </button>
      </div>

      {/* Stats */}
      {guests && guests.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-rose-200 mb-1">
              {guests.length}
            </div>
            <div className="text-sm text-rose-200/70">Total Guests</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-300 mb-1">
              {guests.filter((g) => g.checkedInAt).length}
            </div>
            <div className="text-sm text-rose-200/70">Checked In</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-rose-300 mb-1">
              {guests.filter((g) => !g.checkedInAt).length}
            </div>
            <div className="text-sm text-rose-200/70">Pending</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default LandingPage;
