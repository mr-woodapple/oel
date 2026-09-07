import { Star } from "lucide-react";

type RatingProps = {
  value: number;
  compact?: boolean;
};

export function Rating({ value, compact = false }: RatingProps) {
  const roundedValue = Math.round(value);

  return (
    <div className="flex items-center gap-2" aria-label={`${value} von 5 Sternen`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${compact ? "size-3.5" : "size-4"} ${star <= roundedValue ? "fill-primary text-primary" : "text-border"}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold tabular-nums text-foreground">{value.toFixed(1)}</span>
    </div>
  );
}
