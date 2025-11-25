"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Download, Send } from "lucide-react";
import { getAllGuests } from "@/lib/firebase";

interface Guest {
  id: string;
  name: string;
  ticketId: string;
  qrData: string;
  qrUrl: string;
  checkedIn: boolean;
  createdAt: string;
  checkedInAt?: string;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await getAllGuests();
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (guest: Guest) => {
    const msg = `💝 *Toluwani & Gbenga Wedding Invitation* 💝%0A%0AHi ${guest.name}!%0A%0AYou're cordially invited to celebrate our special day!%0A%0A✨ Please save this QR code and present it at the entrance.%0A%0A#good&perfect%0A%0ATicket ID: ${guest.ticketId}%0A%0AWe can't wait to see you!`;
    const whatsappUrl = `https://wa.me/?text=${msg}%0A%0AYour QR Code: ${guest.qrUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const exportToCSV = () => {
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
      g.checkedInAt ? new Date(g.checkedInAt).toLocaleString() : "N/A",
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
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-32 h-screen">
      <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-rose-100">
            Guest List {loading ? "..." : `(${guests.length})`}
          </h2>
          <button
            onClick={exportToCSV}
            disabled={guests.length === 0}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50 flex items-center"
          >
            <Download className="mr-2" size={18} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-rose-200">
            Loading guests...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/20">
                  <th className="p-4 text-left text-rose-100">Guest Name</th>
                  <th className="p-4 text-left text-rose-100">Ticket ID</th>
                  <th className="p-4 text-center text-rose-100">Status</th>
                  <th className="p-4 text-center text-rose-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr
                    key={guest.id}
                    className={`border-b border-rose-200/20 ${
                      guest.checkedIn ? "bg-green-500/20" : "bg-white/5"
                    }`}
                  >
                    <td className="p-4 font-semibold text-rose-100">
                      {guest.name}
                    </td>
                    <td className="p-4 text-sm text-rose-200/80">
                      {guest.ticketId}
                    </td>
                    <td className="p-4 text-center">
                      {guest.checkedIn ? (
                        <span className="inline-flex items-center text-green-300">
                          <CheckCircle className="mr-1" size={18} /> Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-300">
                          <XCircle className="mr-1" size={18} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={guest.qrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-rose-500/30 text-rose-100 px-3 py-2 rounded mr-2 text-sm hover:bg-rose-500/50 transition inline-block"
                      >
                        View QR
                      </a>
                      <button
                        onClick={() => handleSendWhatsApp(guest)}
                        className="bg-green-500/30 text-green-100 px-3 py-2 rounded text-sm hover:bg-green-500/50 transition inline-flex items-center"
                      >
                        <Send size={14} className="mr-1" /> Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {guests.length === 0 && (
              <div className="text-center py-12 text-rose-200/60">
                No guests added yet. Start by adding your first guest!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
