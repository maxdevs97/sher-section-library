import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { HOMEPAGE_HEROES } from "./data/sections";
import allSections from "./data/allSections.json";
import Sidebar from "./components/Sidebar";
import VariantCard from "./components/VariantCard";
import EmptyState from "./components/EmptyState";

const FIGMA_FILE_URL = "https://www.figma.com/design/zR55u8MPPZ5tV51OhvNKhp";

// Group allSections by pageName
const sectionsByPage = allSections.reduce((acc, s) => {
  if (!acc[s.pageName]) acc[s.pageName] = [];
  acc[s.pageName].push(s);
  return acc;
}, {});

// Define page order for sidebar
const PAGE_ORDER = [
  { id: "homepage-heroes", label: "Homepage Heroes", data: HOMEPAGE_HEROES, status: "annotated" },
  { id: "interior-hero-sections", label: "Interior Heroes", pageName: "Interior Hero Sections" },
  { id: "navbar", label: "Navbar", pageName: "Navbar" },
  { id: "logos-section", label: "Logos / Trust Bar", pageName: "Logos Section" },
  { id: "service-sections", label: "Service Sections", pageName: "Service Sections" },
  { id: "credibility-stats-sections", label: "Stats / Credibility", pageName: "Credibility Stats Sections" },
  { id: "how-it-works-sections", label: "How It Works", pageName: "How it Works / Process Sections" },
  { id: "content-sections", label: "Content Sections", pageName: "Content Sections" },
  { id: "cta-banners", label: "CTA Banners", pageName: "CTA Banners" },
  { id: "faqs", label: "FAQs", pageName: "FAQs" },
  { id: "video-testimonials", label: "Video Testimonials", pageName: "Video Testimonials" },
  { id: "written-testimonials", label: "Written Testimonials", pageName: "Written Testimonials" },
  { id: "case-studies", label: "Case Studies", pageName: "Case Studies" },
  { id: "thought-leadership", label: "Thought Leadership", pageName: "Thought Leadership" },
  { id: "pricing", label: "Pricing", pageName: "Pricing" },
  { id: "gallery", label: "Gallery", pageName: "Gallery" },
  { id: "team", label: "Team", pageName: "Team" },
  { id: "locations", label: "Location(s)", pageName: "Location(s)" },
  { id: "contact", label: "Contact", pageName: "Contact" },
  { id: "funnel-sections", label: "Funnel Sections", pageName: "Funnel Sections" },
  { id: "footer", label: "Footer", pageName: "Footer" },
  { id: "ecommerce-sections", label: "E-Commerce Sections", pageName: "E-Commerce Sections" },
  { id: "ecommerce-catalog", label: "E-Commerce Catalog", pageName: "E-Commerce Catalog Page" },
  { id: "ecommerce-product", label: "E-Commerce Product", pageName: "E-Commerce Product Pages" },
  { id: "utility-pages", label: "Utility Pages", pageName: "Utility Pages" },
  { id: "cms-archive", label: "CMS Archive Pages", pageName: "CMS Archive Pages" },
  { id: "cms-single", label: "CMS Single Pages", pageName: "CMS Single Pages" },
];

// Build sidebar sections and section data map dynamically
const SECTION_DATA = {};
const SIDEBAR_SECTIONS = PAGE_ORDER
  .map((page) => {
    const data = page.data || sectionsByPage[page.pageName] || [];
    if (data.length === 0 && !page.data) return null; // skip empty pages
    SECTION_DATA[page.id] = data;
    return {
      id: page.id,
      label: page.label,
      count: data.length,
      status: page.status || "ai-annotated",
    };
  })
  .filter(Boolean);

function getHeaderTitle(id) {
  const s = SIDEBAR_SECTIONS.find((s) => s.id === id);
  return s ? s.label : "";
}

export default function App() {
  const [activeSection, setActiveSection] = useState("homepage-heroes");
  const [search, setSearch] = useState("");

  const activeData = SECTION_DATA[activeSection] || [];
  const activeSectionMeta = SIDEBAR_SECTIONS.find((s) => s.id === activeSection);
  const isAnnotated = activeSectionMeta?.status === "annotated";

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeData;
    return activeData.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.tone?.toLowerCase().includes(q) ||
        s.bestFor?.some((b) => b.toLowerCase().includes(q)) ||
        s.layout?.toLowerCase().includes(q)
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
        <>
          {/* Header bar */}
          <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 px-6 py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-white text-2xl font-bold">
                {getHeaderTitle(activeSection)}
              </h1>
              <span className="bg-gray-800 text-gray-400 text-sm rounded-full px-3 py-1">
                {activeSectionMeta?.count ?? filtered.length} variants
              </span>
              {/* Annotation status badge */}
              {isAnnotated ? (
                <span className="flex items-center gap-1.5 text-xs bg-green-900/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Manually Annotated
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs bg-blue-900/30 text-blue-400 border border-blue-800/40 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  AI Annotated
                </span>
              )}
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
            {activeData.length === 0 ? (
              <EmptyState label={activeSectionMeta?.label || "this section"} />
            ) : filtered.length === 0 ? (
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
      </main>
    </div>
  );
}
