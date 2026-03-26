export default function Sidebar({ sections, activeId, onSelect }) {
  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-800">
        <span className="text-white font-bold text-lg">Section Library</span>
        <span className="bg-blue-900 text-blue-300 text-xs rounded px-1.5 py-0.5 font-medium">Beta</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const isAnnotated = section.status === "annotated";
          const isAiAnnotated = section.status === "ai-annotated";

          return (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-1 transition-colors ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
              }`}
            >
              {/* Status dot */}
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isAnnotated
                    ? "bg-green-500"
                    : isAiAnnotated
                    ? "bg-blue-400 opacity-75"
                    : "bg-gray-600"
                }`}
              />

              {/* Label */}
              <span
                className={`flex-1 text-sm ${
                  isActive || isAnnotated || isAiAnnotated ? "text-white" : "text-gray-500"
                }`}
              >
                {section.label}
              </span>

              {/* Count badge */}
              {section.count !== null && section.count !== undefined ? (
                <span className="text-xs text-gray-400 bg-gray-700/60 rounded px-1.5 py-0.5">
                  {section.count}
                </span>
              ) : (
                <span className="text-xs text-gray-600">(pending)</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer legend */}
      <div className="px-4 py-3 border-t border-gray-800 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          Manually annotated
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-blue-400 opacity-75 flex-shrink-0" />
          AI annotated
        </div>
      </div>
    </aside>
  );
}
