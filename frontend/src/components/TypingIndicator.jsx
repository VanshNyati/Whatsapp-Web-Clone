// src/components/TypingIndicator.jsx
export default function TypingIndicator({ who }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="w-8 h-4 bg-gray-200 rounded-full animate-pulse" />
      <div>{who || "typing..."}</div>
    </div>
  );
}
