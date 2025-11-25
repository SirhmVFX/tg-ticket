"use client";
import { useState, useEffect, useRef } from "react";
import MessageAlert from "@/components/MessageAlert";
import { getGuestByTicketId, checkInGuest } from "@/lib/firebase";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, Scan, X } from "lucide-react";

export default function CheckIn() {
  const [scannedData, setScannedData] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("scanner");
      scannerRef.current = scanner;

      // Get available cameras and use the back camera by default
      const devices = await Html5Qrcode.getCameras();
      if (devices.length === 0) {
        setMessage({ type: "error", text: "No cameras found" });
        return;
      }

      const backCamera =
        devices.find((d) => d.label.toLowerCase().includes("back")) ||
        devices[0];
      setCameraId(backCamera.id);

      await scanner.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (decodedText) {
            setScannedData(decodedText);
            stopScanner();
            processScannedData(decodedText);
          }
        },
        (errorMessage) => {
          // Handle scan errors
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setMessage({ type: "error", text: "Failed to start camera" });
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleScanner = () => {
    if (isScanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  const processScannedData = async (data: string) => {
    if (!data.trim()) {
      setMessage({ type: "error", text: "No QR code data found" });
      return;
    }

    if (!data.startsWith("TG_WEDDING:")) {
      setMessage({ type: "error", text: "Invalid QR code format" });
      return;
    }

    const parts = data.split(":");
    if (parts.length !== 3) {
      setMessage({ type: "error", text: "Invalid QR code format" });
      return;
    }

    const ticketId = parts[1];
    setLoading(true);

    try {
      const guest = await getGuestByTicketId(ticketId);
      const result = await checkInGuest(guest.id);

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

        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <p className="text-rose-200/80">
            Scan the QR code or paste the code data to check in guests
          </p>
          <button
            onClick={toggleScanner}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              isScanning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white/10 hover:bg-white/20 text-rose-100 border border-rose-200/30"
            }`}
            disabled={loading}
          >
            {isScanning ? (
              <>
                <X size={18} /> Stop Scanning
              </>
            ) : (
              <>
                <Camera size={18} /> Scan with Camera
              </>
            )}
          </button>
        </div> */}

        {isScanning && (
          <div className="relative w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden bg-black/50 border-2 border-rose-200/30">
            <div
              id="scanner"
              ref={scannerContainerRef}
              className="w-full aspect-square"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-rose-400 rounded-lg relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-rose-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-rose-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-rose-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-rose-400 rounded-br-lg" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2 text-sm">
              <Scan className="inline-block mr-2" size={16} />
              Point your camera at a QR code
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Paste QR code data (e.g., TG_WEDDING:...)"
          value={scannedData}
          onChange={(e) => setScannedData(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            !loading &&
            scannedData &&
            processScannedData(scannedData)
          }
          disabled={loading}
          className="w-full p-4 bg-white/20 border-2 border-rose-200/50 rounded-lg mb-4 focus:outline-none focus:border-rose-300 text-rose-100 placeholder-rose-200/50 disabled:opacity-50"
        />
        <button
          onClick={() => scannedData && processScannedData(scannedData)}
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
