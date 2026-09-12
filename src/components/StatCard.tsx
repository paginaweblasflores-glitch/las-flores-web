import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StatCardAccent = "eucalipto" | "chilca" | "cochinilla" | "cielo" | "pacay";

const ACCENT_STYLES: Record<StatCardAccent, { chipBg: string; chipText: string; chipBorder: string; value: string; activeBorder: string }> = {
  eucalipto: {
    chipBg: "bg-[#3E5C4E]/10",
    chipText: "text-[#3E5C4E]",
    chipBorder: "border-[#3E5C4E]/25",
    value: "text-[#3E5C4E]",
    activeBorder: "border-t-[#3E5C4E]",
  },
  chilca: {
    chipBg: "bg-[#D9A441]/15",
    chipText: "text-[#8a6a1f]",
    chipBorder: "border-[#D9A441]/35",
    value: "text-[#8a6a1f]",
    activeBorder: "border-t-[#D9A441]",
  },
  cochinilla: {
    chipBg: "bg-[#A32638]/10",
    chipText: "text-[#A32638]",
    chipBorder: "border-[#A32638]/25",
    value: "text-[#A32638]",
    activeBorder: "border-t-[#A32638]",
  },
  cielo: {
    chipBg: "bg-[#5E85A8]/10",
    chipText: "text-[#5E85A8]",
    chipBorder: "border-[#5E85A8]/25",
    value: "text-[#436281]",
    activeBorder: "border-t-[#5E85A8]",
  },
  pacay: {
    chipBg: "bg-[#7C9A5C]/10",
    chipText: "text-[#5f7a44]",
    chipBorder: "border-[#7C9A5C]/25",
    value: "text-[#5f7a44]",
    activeBorder: "border-t-[#7C9A5C]",
  },
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent: StatCardAccent;
  sublabel?: ReactNode;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  sublabel,
  badge,
  active,
  onClick,
  className = "",
}: StatCardProps) {
  const styles = ACCENT_STYLES[accent];
  const isInteractive = typeof onClick === "function";
  const Tag = isInteractive ? "button" : "div";

  return (
    <Tag
      type={isInteractive ? "button" : undefined}
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border bg-white transition-all shadow-2xs font-sans w-full ${
        isInteractive ? "cursor-pointer hover:shadow-md" : ""
      } ${
        active
          ? `border-t-4 ${styles.activeBorder} border-x border-b border-gray-200 shadow-md scale-[1.01]`
          : "border-gray-200/90 hover:shadow-md"
      } ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${styles.chipBg} ${styles.chipText} ${styles.chipBorder}`}
        >
          <Icon size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-sans font-extrabold uppercase tracking-wider text-gray-500 truncate">
              {label}
            </span>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${styles.chipBg} ${styles.chipText}`}>
                {badge}
              </span>
            )}
          </div>
          <span className={`font-sans text-2xl font-black tracking-tight tabular-nums block truncate ${styles.value}`}>
            {value}
          </span>
          {sublabel && <p className="text-xs mt-0.5 font-medium text-gray-500 truncate">{sublabel}</p>}
        </div>
      </div>
    </Tag>
  );
}
