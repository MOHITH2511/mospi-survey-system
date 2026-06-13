import { type LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = "#2563eb",
  iconBg = "#eff6ff",
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <div className="animate-card-enter rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                trend.direction === "up"
                  ? "text-emerald-600"
                  : trend.direction === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            >
              <TrendIcon className="h-3 w-3" />
              {trend.value}
            </span>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
