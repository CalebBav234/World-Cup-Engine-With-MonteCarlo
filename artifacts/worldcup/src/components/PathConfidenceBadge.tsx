import type { PathConfidenceScore } from '../engine/types';
import { TEAMS } from '../engine/teamData';

interface Props {
  score: PathConfidenceScore;
}

function badgeColor(pct: number): string {
  if (pct < 5) return 'badge-gray';
  if (pct < 15) return 'badge-amber';
  if (pct < 30) return 'badge-blue';
  return 'badge-green';
}

export function PathConfidenceBadge({ score }: Props) {
  const team = TEAMS.find(t => t.id === score.teamId);
  const name = team?.name ?? score.teamId;
  const cls = badgeColor(score.trophy);

  return (
    <span className={`path-badge ${cls}`}>
      {name} — {score.trophy.toFixed(1)}% to win
    </span>
  );
}
