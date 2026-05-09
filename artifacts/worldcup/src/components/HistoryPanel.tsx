import { TEAMS } from '../engine/teamData';

export interface HistoryEntry {
  runId: number;
  simId: string;
  champion: string;
}

function teamName(id: string) {
  return TEAMS.find(t => t.id === id)?.name ?? id;
}

export function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">📊</div>
        <p className="history-empty-heading">No history yet</p>
        <p className="history-empty-sub">
          Press <strong>Re-run</strong> to generate new simulations — each run adds 4 results to this log.
        </p>
      </div>
    );
  }

  const totalSims = history.length;
  const totalRuns = Math.ceil(totalSims / 4);

  const freq: Record<string, number> = {};
  const lastWon: Record<string, number> = {};

  for (const e of history) {
    freq[e.champion] = (freq[e.champion] ?? 0) + 1;
    lastWon[e.champion] = Math.max(lastWon[e.champion] ?? 0, e.runId + 1);
  }

  const rows = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .map(([teamId, wins]) => ({
      teamId,
      wins,
      pct: (wins / totalSims) * 100,
      lastRun: lastWon[teamId],
    }));

  const maxWins = rows[0]?.wins ?? 1;

  return (
    <div className="history-panel">
      <div className="history-header">
        <div>
          <h2 className="history-title">Champion History</h2>
          <p className="history-meta">
            {totalSims} simulation{totalSims !== 1 ? 's' : ''} across{' '}
            {totalRuns} re-run{totalRuns !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="history-runs-badge">{totalRuns} run{totalRuns !== 1 ? 's' : ''}</div>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Titles</th>
              <th>Win %</th>
              <th>Last Won</th>
              <th className="col-bar">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.teamId} className={i === 0 ? 'history-leader' : ''}>
                <td className="rank-cell">
                  {i === 0 ? '🏆' : i + 1}
                </td>
                <td className="team-cell">
                  <span className="team-flag">{row.teamId}</span>
                  <span>{teamName(row.teamId)}</span>
                </td>
                <td className="wins-cell">{row.wins}</td>
                <td className="pct-cell">{row.pct.toFixed(1)}%</td>
                <td className="last-cell">Run {row.lastRun}</td>
                <td className="bar-cell">
                  <div className="freq-bar-track">
                    <div
                      className="freq-bar-fill"
                      style={{ width: `${(row.wins / maxWins) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-log">
        <h3 className="history-log-title">Full Log</h3>
        <div className="history-log-list">
          {[...history].reverse().map((e, i) => (
            <div key={i} className="history-log-entry">
              <span className="log-run">Run {e.runId + 1}</span>
              <span className="log-sim">Sim {e.simId}</span>
              <span className="log-champ">{teamName(e.champion)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
