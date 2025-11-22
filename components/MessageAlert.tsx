"use client";

export default function MessageAlert({
  message,
  onClose,
}: {
  message: { text: string; type: string };
  onClose: () => void;
}) {
  if (!message.text) return null;

  const bgColor =
    {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
    }[message.type] || "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white p-4 rounded-lg mb-6 flex justify-between items-center`}
    >
      <span>{message.text}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  );
}
