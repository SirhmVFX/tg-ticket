"use client";
import { useState } from "react";
import MessageAlert from "@/components/MessageAlert";
import { getGuestByTicketId, checkInGuest } from "@/lib/firebase";

export default function CheckIn() {
  const [scannedData, setScannedData] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!scannedData.trim()) {
      setMessage({ type: "error", text: "Please enter QR code data" });
      return;
    }

    if (!scannedData.startsWith("TG_WEDDING:")) {
      setMessage({ type: "error", text: "Invalid QR code format" });
      return;
    }

    const parts = scannedData.split(":");
    if (parts.length !== 3) {
      setMessage({ type: "error", text: "Invalid QR code format" });
      return;
    }

    const ticketId = parts[1];
    console.log(ticketId);
    setLoading(true);

    try {
      const guest = await getGuestByTicketId(ticketId);
      const result = await checkInGuest(guest.id);
      console.log(guest);

      if (result.error) {
        setMessage({
          type: "warning",
          text: `${result.name} has already checked in!`,
        });
      } else {
        setMessage({
          type: "success",
          text: `✓ ${result?.name} checked in successfully!`,
        });
        setScannedData("");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error processing check-in";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-32 h-screen">
      <div className="bg-white/10 backdrop-blur-md border border-rose-200/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-rose-100 mb-6">
          Guest Check-in
        </h2>

        <MessageAlert
          message={message}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        <p className="text-rose-200/80 mb-4">
          Scan the QR code or paste the code data to check in guests
        </p>

        <input
          type="text"
          placeholder="Paste QR code data (e.g., TG_WEDDING:...)"
          value={scannedData}
          onChange={(e) => setScannedData(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleScan()}
          disabled={loading}
          className="w-full p-4 bg-white/20 border-2 border-rose-200/50 rounded-lg mb-4 focus:outline-none focus:border-rose-300 text-rose-100 placeholder-rose-200/50 disabled:opacity-50"
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-rose-500 text-white py-4 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Process Check-in"}
        </button>

        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-rose-200/30">
          <p className="text-sm text-rose-200/80">
            💡 <strong>Tip:</strong> In production, integrate with a camera
            scanner library like html5-qrcode for automatic scanning.
          </p>
        </div>
      </div>
    </div>
  );
}
