"use client";

import ReactDiffViewer from "react-diff-viewer-continued";

interface VersionDiffProps {
  oldContent: string;
  newContent: string;
  oldVersion?: number;
  newVersion?: number;
}

export default function VersionDiff({
  oldContent,
  newContent,
  oldVersion,
  newVersion,
}: VersionDiffProps) {
  // Strip HTML tags for better diff view
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl overflow-hidden">
      <div className="bg-gray-800/50 px-6 py-3 border-b border-[#26a69a]/20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">
            {oldVersion && newVersion
              ? `Porównanie: Wersja ${oldVersion} → Wersja ${newVersion}`
              : "Porównanie wersji"}
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <ReactDiffViewer
          oldValue={stripHtml(oldContent)}
          newValue={stripHtml(newContent)}
          splitView={true}
          useDarkTheme={true}
          leftTitle={`Wersja ${oldVersion || "Stara"}`}
          rightTitle={`Wersja ${newVersion || "Nowa"}`}
          styles={{
            diffContainer: {
              fontSize: "14px",
              fontFamily: "monospace",
            },
            line: {
              padding: "8px 12px",
            },
          }}
        />
      </div>
    </div>
  );
}