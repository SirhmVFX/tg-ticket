"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import MessageAlert from "@/components/MessageAlert";
import { addGuest } from "@/lib/firebase";
import Image from "next/image";

interface Guest {
  name: string;
  ticketId: string;
  qrData: string;
  qrUrl: string;
  checkedIn: boolean;
  checkedInAt: null | Date;
  createdAt: string;
}

interface QRCode {
  id: string;
  name: string;
  ticketId: string;
  qrData: string;
  qrUrl: string;
  checkedIn: boolean;
  checkedInAt: null | Date;
  createdAt: string;
}

export default function AddGuest() {
  const [guestName, setGuestName] = useState("");
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleAddGuest = async () => {
    if (!guestName.trim()) {
      setMessage({ type: "error", text: "Please enter a guest name" });
      return;
    }

    setLoading(true);
    try {
      const ticketId = `TG-${Date.now()}`;
      const qrData = `TG_WEDDING:${ticketId}:${guestName}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        qrData
      )}`;

      const guestData = {
        name: guestName,
        ticketId: ticketId,
        qrData: qrData,
        qrUrl: qrUrl,
        checkedIn: false,
        checkedInAt: null,
        createdAt: new Date().toISOString(),
      };

      const guest = await addGuest(guestData);
      setQrCode({
        ...guest,
        checkedIn: false,
        checkedInAt: null,
      });
      setGuestName("");

      setMessage({ type: "success", text: "Guest added successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add guest" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (guest: Guest) => {
    const msg = `💝 *Toluwani & Gbenga Wedding Invitation* 💝%0A%0AHi ${guest.name}!%0A%0AYou're cordially invited to celebrate our special day!%0A%0A✨ Please save this QR code and present it at the entrance.%0A%0A#good&perfect%0A%0ATicket ID: ${guest.ticketId}%0A%0AWe can't wait to see you!`;
    const whatsappUrl = `https://wa.me/?text=${msg}%0A%0AYour QR Code: ${guest.qrUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-32 h-screen">
      <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-rose-100 mb-6">
          Generate Guest Invitation
        </h2>

        <MessageAlert
          message={message}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        <input
          type="text"
          placeholder="Enter guest name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleAddGuest()}
          disabled={loading}
          className="w-full p-4 bg-white/20 border-2 border-rose-200/50 rounded-lg mb-4 focus:outline-none focus:border-rose-300 text-rose-100 placeholder-rose-200/50 disabled:opacity-50"
        />
        <button
          onClick={handleAddGuest}
          disabled={loading}
          className="w-full bg-rose-500 text-white py-4 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50"
        >
          {loading ? "Adding Guest..." : "Generate Invitation"}
        </button>

        {qrCode && (
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {qrCode.name}
            </h3>
            <Image
              src={qrCode?.qrUrl}
              alt="QR Code"
              width={256}
              height={256}
              className="w-64 h-64 mx-auto mb-4 border-4 border-rose-200 rounded-lg"
            />
            <p className="text-sm text-gray-600 mb-4 text-center">
              Ticket ID: {qrCode.ticketId}
            </p>
            <button
              onClick={() => handleSendWhatsApp(qrCode)}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center"
            >
              <Send className="mr-2" size={20} /> Send via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
