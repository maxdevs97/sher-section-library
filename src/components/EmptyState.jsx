import { Clock } from "lucide-react";

export default function EmptyState({ label }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950 min-h-screen">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Clock className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Not yet annotated</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Annotations for <strong className="text-gray-400">{label}</strong> are coming soon.
        </p>
      </div>
    </div>
  );
}
