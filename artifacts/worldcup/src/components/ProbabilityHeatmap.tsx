import { useState } from 'react';
import type { PathConfidenceScore } from '../engine/types';
import { TEAMS } from '../engine/teamData';

interface Props {
  data: PathConfidenceScore[];
}

type SortKey = 'trophy' | 'fifaRanking' | 'groupId';

function heatColor(pct: number, max: number): string {
  if (max === 0) return '#f5f5f5';
  const ratio = pct / max;
  if (ratio >= 0.5) {
    const g = Math.round(180 + (1 - ratio) * 2 * 75);
    const r = Math.round(ratio * 2 * 255 * 0.3);
    return `rgb(${r}, ${g}, 80)`;
  } else {
    const r = Math.round(220 + ratio * 2 * 35);
    const g = Math.round(ratio * 2 * 180);
    const b = Math.round(ratio * 2 * 80);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function interpolate(pct: number): string {
  if (pct === 0) return '#f0f0f0';
  if (pct <= 5) return `hsl(0, 0%, ${95 - pct}%)`;
  if (pct <= 20) {
    const t = (pct - 5) / 15;
    const l = Math.round(90 - t * 20);
    return `hsl(45, 90%, ${l}%)`;
  }
  if (pct <= 50) {
    const t = (pct - 20) / 30;
    const h = Math.round(200 + t * 20);
    const l = Math.round(70 - t * 20);
    return `hsl(${h}, 80%, ${l}%)`;
  }
  const t = Math.min((pct - 50) / 50, 1);
  const l = Math.round(50 - t * 15);
  return `hsl(145, 70%, ${l}%)`;
}

export function ProbabilityHeatmap({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('trophy');

  const sorted = [...data].sort((a, b) => {
    if (sortKey === 'trophy') return b.trophy - a.trophy;
    const ta = TEAMS.find(t => t.id === a.teamId);
    const tb = TEAMS.find(t => t.id === b.teamId);
    if (sortKey === 'fifaRanking') return (ta?.fifaRanking ?? 99) - (tb?.fifaRanking ?? 99);
    if (sortKey === 'groupId') return (ta?.groupId ?? '').localeCompare(tb?.groupId ?? '');
    return 0;
  });

  const stages: Array<{ key: keyof PathConfidenceScore; label: string }> = [
    { key: 'r32', label: 'R32' },
    { key: 'r16', label: 'R16' },
    { key: 'qf',  label: 'QF' },
    { key: 'sf',  label: 'SF' },
    { key: 'final', label: 'Final' },
    { key: 'trophy', label: 'Trophy' },
  ];

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-controls">
        <span className="sort-label">Sort by:</span>
        {(['trophy','fifaRanking','groupId'] as SortKey[]).map(k => (
          <button
            key={k}
            className={`sort-btn ${sortKey === k ? 'active' : ''}`}
            onClick={() => setSortKey(k)}
          >
            {k === 'trophy' ? 'Win %' : k === 'fifaRanking' ? 'FIFA Rank' : 'Group'}
          </button>
        ))}
      </div>
      <div className="heatmap-scroll">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="heatmap-th team-col">Team</th>
              <th className="heatmap-th">Grp</th>
              {stages.map(s => (
                <th key={s.key} className="heatmap-th">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => {
              const team = TEAMS.find(t => t.id === row.teamId);
              return (
                <tr key={row.teamId} className="heatmap-row">
                  <td className="heatmap-td team-col">
                    <span className="team-name">{team?.name ?? row.teamId}</span>
                    <span className="team-id">{row.teamId}</span>
                  </td>
                  <td className="heatmap-td group-col">{team?.groupId}</td>
                  {stages.map(s => {
                    const val = row[s.key] as number;
                    const bg = interpolate(val);
                    const dark = val > 30;
                    return (
                      <td
                        key={s.key}
                        className="heatmap-td pct-col"
                        style={{ background: bg, color: dark ? '#fff' : '#222' }}
                      >
                        {val.toFixed(1)}%
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
