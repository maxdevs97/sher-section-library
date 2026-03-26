import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { HOMEPAGE_HEROES, SIDEBAR_SECTIONS } from "./data/sections";
import Sidebar from "./components/Sidebar";
import VariantCard from "./components/VariantCard";
import EmptyState from "./components/EmptyState";

const FIGMA_FILE_URL = "https://www.figma.com/design/zR55u8MPPZ5tV51OhvNKhp";

const SECTION_DATA = {
  "homepage-heroes": HOMEPAGE_HEROES,
};

function getHeaderTitle(id, sections) {
  const s = sections.find((s) => s.id === id);
  return s ? s.label : "";
}

export default function App() {
  const [activeSection, setActiveSection] = useState("homepage-heroes");
  const [search, setSearch] = useState("");

  const activeData = SECTION_DATA[activeSection] || [];
  const activeSectionMeta = SIDEBAR_SECTIONS.find((s) => s.id === activeSection);
  const isPending = activeSectionMeta?.status === "pending";

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeData;
    return activeData.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tone.toLowerCase().includes(q) ||
        s.bestFor.some((b) => b.toLowerCase().includes(q)) ||
        s.layout.toLowerCase().includes(q)
    );
  }, [activeData, search]);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar
        sections={SIDEBAR_SECTIONS}
        activeId={activeSection}
        onSelect={(id) => {
          setActiveSection(id);
          setSearch("");
        }}
      />

      <main className="flex-1 overflow-y-auto bg-gray-950">
        {isPending ? (
          <EmptyState label={activeSectionMeta?.label || "this section"} />
        ) : (
          <>
            {/* Header bar */}
            <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-6 py-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-white text-2xl font-bold">
                  {getHeaderTitle(activeSection, SIDEBAR_SECTIONS)} Sections
                </h1>
                <span className="bg-gray-800 text-gray-400 text-sm rounded-full px-3 py-1">
                  {activeSectionMeta?.count ?? filtered.length} variants
                </span>
                <a
                  href={FIGMA_FILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Open in Figma →
                </a>
              </div>

              {/* Search */}
              <div className="relative mt-3 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, tone, use case…"
                  className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {filtered.length === 0 ? (
                <div className="col-span-2 text-center py-16 text-gray-500">
                  No results for "{search}"
                </div>
              ) : (
                filtered.map((section) => (
                  <VariantCard key={section.id} section={section} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
