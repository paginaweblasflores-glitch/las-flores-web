import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { StatCardAccent } from "./StatCard";

const ACCENT_HEX: Record<StatCardAccent, string> = {
  eucalipto: "#3E5C4E",
  chilca: "#D9A441",
  cochinilla: "#A32638",
  cielo: "#5E85A8",
  pacay: "#7C9A5C",
};

interface TrendEntry {
  label: string;
  value: number;
  count: number;
}

interface SimpleTrendChartProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: StatCardAccent;
  entries: TrendEntry[];
  valuePrefix?: string;
  countLabel?: string;
  emptyMessage: string;
}

export function SimpleTrendChart({
  icon: Icon,
  title,
  subtitle,
  accent,
  entries,
  valuePrefix = "",
  countLabel = "pedidos",
  emptyMessage,
}: SimpleTrendChartProps) {
  const [hoveredBar, setHoveredBar] = useState<TrendEntry | null>(null);
  const color = ACCENT_HEX[accent];
  const maxVal = Math.max(...entries.map((e) => e.value), 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4 relative">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-serif text-sm font-bold text-[#231A14] flex items-center gap-2">
            <Icon size={18} style={{ color }} />
            {title}
          </h3>
          <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
        </div>

        {hoveredBar && (
          <div className="bg-[#2D473C] text-white px-3 py-1.5 rounded-xl text-xs shadow-md border border-[#D4AF37]/30">
            <span className="font-bold text-[#D4AF37]">{hoveredBar.label}:</span> {valuePrefix}
            {hoveredBar.value.toFixed(valuePrefix ? 2 : 0)} ({hoveredBar.count} {countLabel})
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
          {emptyMessage}
        </div>
      ) : (
        <div className="pt-6 pb-2 relative">
          <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-10 z-0">
            <div className="border-b border-gray-700 border-dashed w-full flex justify-end pr-2 text-xs font-mono">
              {valuePrefix}
              {maxVal.toFixed(0)}
            </div>
            <div className="border-b border-gray-700 border-dashed w-full flex justify-end pr-2 text-xs font-mono">
              {valuePrefix}
              {(maxVal / 2).toFixed(0)}
            </div>
            <div className="border-b border-gray-700 w-full" />
          </div>

          <div className="h-60 flex items-end justify-between gap-3 border-b border-gray-100 pb-2 relative z-10 pt-4">
            {entries.map((entry) => {
              const heightPercent = Math.max(Math.round((entry.value / maxVal) * 100), 8);
              return (
                <div
                  key={entry.label}
                  onMouseEnter={() => setHoveredBar(entry)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-1 group cursor-pointer"
                >
                  <span className="text-xs font-mono font-extrabold text-[#231A14] group-hover:scale-110 transition-transform">
                    {valuePrefix}
                    {entry.value.toFixed(0)}
                  </span>
                  <div className="w-full flex-1 max-h-[170px] flex items-end bg-gray-50 rounded-t-xl p-0.5 border border-gray-100">
                    <div
                      style={{ height: `${heightPercent}%`, background: `linear-gradient(to top, ${color}, ${color}cc)` }}
                      className="w-full rounded-t-lg transition-all shadow-md group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-bold truncate w-full text-center tracking-tight">
                    {entry.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
