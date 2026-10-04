import { Target, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RoleMatch } from "@/lib/resume/match-schema";

function scoreTone(score: number): { text: string; bar: string } {
  if (score >= 75) return { text: "text-emerald-600", bar: "bg-emerald-500" };
  if (score >= 50) return { text: "text-amber-600", bar: "bg-amber-500" };
  return { text: "text-zinc-500", bar: "bg-zinc-400" };
}

function MatchCard({ match, rank }: { match: RoleMatch; rank: number }) {
  const tone = scoreTone(match.score);
  const width = Math.max(0, Math.min(100, match.score));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500">
            {rank}
          </span>
          <h3 className="truncate text-base font-semibold text-zinc-900">
            {match.jobTitle}
          </h3>
        </div>
        <div className="flex shrink-0 items-baseline gap-1">
          <span className={`text-2xl font-bold tabular-nums ${tone.text}`}>
            {match.score}
          </span>
          <span className="text-xs text-zinc-400">/ 100</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full ${tone.bar} transition-all duration-500`}
          style={{ width: `${width}%` }}
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-600">
        {match.reasoning}
      </p>

      {match.matchedSkills.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Target className="size-3.5 text-emerald-500" />
            Matched skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {match.gaps.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <TrendingUp className="size-3.5 text-amber-500" />
            Skills to grow
          </div>
          <div className="flex flex-wrap gap-1.5">
            {match.gaps.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="border-amber-200 bg-amber-50 text-xs text-amber-700"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MatchResults({ matches }: { matches: RoleMatch[] }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-10 text-center">
        <Sparkles className="size-7 text-zinc-300" />
        <p className="text-sm text-zinc-500">
          No open roles to match against right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match, i) => (
        <MatchCard key={match.jobId} match={match} rank={i + 1} />
      ))}
    </div>
  );
}
