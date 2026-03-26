import { useState } from "react";
import { ExternalLink } from "lucide-react";

const FIGMA_FILE_KEY = "zR55u8MPPZ5tV51OhvNKhp";
const FIGMA_BASE = `https://www.figma.com/design/${FIGMA_FILE_KEY}?node-id=`;

function getToneBadgeClass(tone) {
  const t = tone.toLowerCase();
  if (t.includes("authoritative") || t.includes("confident")) return "bg-purple-900 text-purple-300";
  if (t.includes("trust") || t.includes("compliance")) return "bg-blue-900 text-blue-300";
  if (t.includes("premium") || t.includes("editorial") || t.includes("restrained")) return "bg-yellow-900 text-yellow-300";
  if (t.includes("retail") || t.includes("ecommerce") || t.includes("deal")) return "bg-green-900 text-green-300";
  if (t.includes("saas") || t.includes("enterprise")) return "bg-cyan-900 text-cyan-300";
  if (t.includes("niche") || t.includes("mission")) return "bg-orange-900 text-orange-300";
  return "bg-gray-700 text-gray-300";
}

const TABS = ["Overview", "Choose When", "Avoid When", "Assets"];

const FEEDBACK_ENDPOINT = "https://openclaw-tools-6mff3.ondigitalocean.app/section-library/feedback";

export default function VariantCard({ section }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleFeedbackSubmit() {
    if (!feedbackText.trim() || sending) return;
    setSending(true);
    try {
      await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName: section.name,
          nodeId: section.nodeId,
          feedback: feedbackText.trim(),
        }),
      });
      setSent(true);
      setFeedbackText("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Feedback submit failed:", err);
    } finally {
      setSending(false);
    }
  }

  function copyNodeId() {
    navigator.clipboard.writeText(section.nodeId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
      {/* Screenshot */}
      <img
        src={`/screenshots/${section.screenshot}`}
        alt={section.name}
        className="w-full object-contain bg-white cursor-pointer"
        style={{ aspectRatio: '16/9' }}
        onClick={() => window.open(`/screenshots/${section.screenshot}`, "_blank")}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      {/* Fallback if no image */}
      <div
        className="w-full bg-gray-800 items-center justify-center text-gray-600 text-sm hidden" style={{ aspectRatio: '16/9' }}
        style={{ display: "none" }}
      >
        No screenshot
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + node + tone row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white font-semibold text-base leading-tight">{section.name}</h3>
            <button
              onClick={copyNodeId}
              className="mt-1 flex items-center gap-1 group"
              title="Copy node ID"
            >
              <code className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono group-hover:text-gray-200 transition-colors">
                {section.nodeId}
              </code>
              <span className="text-xs">{copied ? "✅ Copied!" : "📋"}</span>
            </button>
          </div>
          <span className={`text-xs rounded-full px-2.5 py-1 flex-shrink-0 font-medium ${getToneBadgeClass(section.tone)}`}>
            {section.tone.split(",")[0].trim()}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-white -mb-px"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[100px]">
          {activeTab === "Overview" && (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">{section.layout}</p>
              <ul className="space-y-1 mt-2">
                {section.keyElements.map((el, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                    {el}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "Choose When" && (
            <ul className="space-y-1.5">
              {section.chooseWhen.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="flex-shrink-0 mt-0.5">✅</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "Avoid When" && (
            <ul className="space-y-1.5">
              {section.avoidWhen.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="flex-shrink-0 mt-0.5">❌</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "Assets" && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Conversion: </span>
                <span className="text-gray-300">{section.conversion}</span>
              </p>
              <p>
                <span className="text-gray-500">Assets required: </span>
                <span className="text-gray-300">{section.assetsRequired}</span>
              </p>
            </div>
          )}
        </div>

        {/* Best For pills */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {section.bestFor.map((item, i) => (
            <span
              key={i}
              className="bg-gray-800 text-gray-300 text-xs rounded-full px-2.5 py-1"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Footer: Figma link */}
        <div className="flex justify-end mt-auto pt-1">
          <a
            href={`${FIGMA_BASE}${section.nodeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Figma
          </a>
        </div>

        {/* Feedback section */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Send feedback on this section... (e.g. 'Use this for luxury real estate', 'Update the Figma link')"
            className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim() || sending}
              className="text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {sending ? 'Sending...' : sent ? '✓ Sent' : 'Send Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
