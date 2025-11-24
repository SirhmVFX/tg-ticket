export interface Guest {
  id: string;
  name: string;
  qrData: string;
  qrUrl: string;
  checkedInAt: boolean;
  createdAt: string;
}

export interface QRCodeData {
  guest: Guest;
}

export interface Message {
  type: "success" | "error" | "warning" | "";
  text: string;
}

export interface PageProps {
  // Common props
  guests: Guest[];
  setCurrentRoute: (route: string) => void;

  // For AddGuestPage
  guestName?: string;
  setGuestName?: (name: string) => void;
  qrCode?: QRCodeData | null;
  setQrCode?: (data: QRCodeData | null) => void;
  message?: Message;
  setMessage?: (message: Message) => void;
  handleAddGuest?: () => void;
  handleSendWhatsApp?: (guest: Guest) => void;

  // For CheckInPage
  scannedData?: string;
  setScannedData?: (data: string) => void;
  handleScan?: () => void;

  // For GuestListPage
  setSelectedGuest?: (guest: Guest | null) => void;

  // For LandingPage
  exportToCSV?: () => void;
}

interface LandingPageProps {
  guests: Guest[];
  setCurrentRoute: (route: string) => void;
  exportToCSV: () => void;
}
