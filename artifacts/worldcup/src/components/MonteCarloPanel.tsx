import { useState, useRef, useEffect } from 'react';
import type { MonteCarloOutput } from '../engine/types';
import { ProbabilityHeatmap } from './ProbabilityHeatmap';
import { ConsensusBracket } from './ConsensusBracket';
import { TEAMS } from '../engine/teamData';

export function MonteCarloPanel({ autoRun }: { autoRun?: boolean }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<MonteCarloOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (autoRun) runMonteCarlo();
    return () => { workerRef.current?.terminate(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runMonteCarlo() {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setOutput(null);
    setError(null);

    const worker = new Worker(
      new URL('../workers/monteCarloWorker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        setProgress(msg.pct);
      } else if (msg.type === 'complete') {
        setOutput(msg.output);
        setRunning(false);
        setProgress(100);
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      setError(err.message);
      setRunning(false);
      worker.terminate();
    };

    worker.postMessage(null);
  }

  const consensusForBracket = output
    ? Object.fromEntries(
        Object.entries(output.matchWinCounts).map(([id, counts]) => {
          const total = Object.values(counts).reduce((s, n) => s + n, 0);
          const [winner, count] = Object.entries(counts).sort(([,a],[,b]) => b - a)[0];
          return [+id, { winner, count, total }];
        })
      )
    : {};

  return (
    <div className="mc-panel">
      <div className="mc-header">
        <h2 className="mc-title">Monte Carlo Engine</h2>
        <p className="mc-desc">10,000 unconstrained mathematical iterations — pure probability output.</p>
        <button
          className={`mc-run-btn ${running ? 'running' : ''}`}
          onClick={runMonteCarlo}
          disabled={running}
        >
          {running ? `Running… ${progress}%` : output ? 'Run Again' : 'Run Monte Carlo (10,000 iterations)'}
        </button>
      </div>

      {running && (
        <div className="mc-progress-wrap">
          <div className="mc-progress-bar" style={{ width: `${progress}%` }} />
          <span className="mc-progress-label">{progress}%</span>
        </div>
      )}

      {error && <div className="mc-error">Error: {error}</div>}

      {output && (
        <div className="mc-results">
          <div className="mc-stat-row">
            <div className="mc-stat">
              <span className="mc-stat-label">Iterations</span>
              <span className="mc-stat-value">{output.iterations.toLocaleString()}</span>
            </div>
            <div className="mc-stat">
              <span className="mc-stat-label">Coin-flip matches</span>
              <span className="mc-stat-value">{output.coinFlipMatchIds.length}</span>
            </div>
          </div>

          {output.coinFlipMatchIds.length > 0 && (
            <div className="coin-flip-section">
              <h3 className="section-subtitle">Coin-flip Matches (45–55%)</h3>
              <div className="coin-flip-list">
                {output.coinFlipMatchIds.map(id => {
                  const counts = output.matchWinCounts[id];
                  if (!counts) return null;
                  const total = Object.values(counts).reduce((s, n) => s + n, 0);
                  const entries = Object.entries(counts).sort(([,a],[,b]) => b - a);
                  const [w1, c1] = entries[0] ?? ['?', 0];
                  const [w2, c2] = entries[1] ?? ['?', 0];
                  const n1 = TEAMS.find(t => t.id === w1)?.name ?? w1;
                  const n2 = TEAMS.find(t => t.id === w2)?.name ?? w2;
                  return (
                    <div key={id} className="coin-flip-item">
                      <span className="coin-icon">⚖</span>
                      <span className="coin-label">M{id}: {n1} ({(c1/total*100).toFixed(1)}%) vs {n2} ({(c2/total*100).toFixed(1)}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mc-section">
            <h3 className="section-subtitle">Probability Heatmap — All 48 Teams</h3>
            <ProbabilityHeatmap data={output.pathConfidence} />
          </div>

          <div className="mc-section">
            <h3 className="section-subtitle">Consensus Bracket</h3>
            <ConsensusBracket source="montecarlo" data={consensusForBracket} />
          </div>

          {/* ── Trophy Odds ── */}
          <div className="mc-section">
            <h3 className="section-subtitle">Trophy Odds — Top 16 Teams</h3>
            <p className="mc-chart-desc">Championship probability across 10,000 simulations.</p>
            <div className="mc-trophy-bars">
              {(() => {
                const maxTrophy = output.pathConfidence.reduce((m, r) => Math.max(m, r.trophy), 0);
                return [...output.pathConfidence]
                .sort((a, b) => b.trophy - a.trophy)
                .slice(0, 16)
                .map(row => {
                  const team = TEAMS.find(t => t.id === row.teamId);
                  return (
                    <div key={row.teamId} className="mc-bar-row">
                      <span className="mc-bar-label">{team?.name ?? row.teamId}</span>
                      <div className="mc-bar-track">
                        <div
                          className="mc-bar-fill trophy-fill"
                          style={{ width: `${maxTrophy > 0 ? (row.trophy / maxTrophy) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="mc-bar-val">{row.trophy.toFixed(1)}%</span>
                    </div>
                  );
                })})()}
            </div>
          </div>

          {/* ── QF Contenders ── */}
          <div className="mc-section">
            <h3 className="section-subtitle">QF Contenders — Full Field</h3>
            <p className="mc-chart-desc">Quarter-final probability, showing all teams with QF% &gt; 30%.</p>
            <div className="mc-trophy-bars">
              {[...output.pathConfidence]
                .filter(r => r.qf >= 30)
                .sort((a, b) => b.qf - a.qf)
                .map(row => {
                  const team = TEAMS.find(t => t.id === row.teamId);
                  return (
                    <div key={row.teamId} className="mc-bar-row">
                      <span className="mc-bar-label">{team?.name ?? row.teamId}</span>
                      <div className="mc-bar-track">
                        <div
                          className="mc-bar-fill qf-fill"
                          style={{ width: `${row.qf}%` }}
                        />
                      </div>
                      <span className="mc-bar-val">{row.qf.toFixed(1)}%</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ── Confederation Breakdown ── */}
          <div className="mc-section">
            <h3 className="section-subtitle">Confederation Breakdown</h3>
            <p className="mc-chart-desc">Combined trophy probability and average QF rate per confederation.</p>
            <div className="mc-confed-table-wrap">
              <table className="mc-confed-table">
                <thead>
                  <tr>
                    <th>Confederation</th>
                    <th>Teams</th>
                    <th>Combined Win %</th>
                    <th>Best Team</th>
                    <th>Avg QF %</th>
                    <th>Avg R16 %</th>
                  </tr>
                </thead>
                <tbody>
                  {(['UEFA','CONMEBOL','CONCACAF','CAF','AFC','OFC'] as const).map(conf => {
                    const confTeams = TEAMS.filter(t => t.confederation === conf);
                    const confRows = output.pathConfidence.filter(r =>
                      confTeams.some(t => t.id === r.teamId)
                    );
                    const totalWin = confRows.reduce((s, r) => s + r.trophy, 0);
                    const avgQF   = confRows.length ? confRows.reduce((s, r) => s + r.qf,  0) / confRows.length : 0;
                    const avgR16  = confRows.length ? confRows.reduce((s, r) => s + r.r16, 0) / confRows.length : 0;
                    const best    = [...confRows].sort((a, b) => b.trophy - a.trophy)[0];
                    const bestTeam = TEAMS.find(t => t.id === best?.teamId);
                    return (
                      <tr key={conf} className="mc-confed-row">
                        <td className="mc-confed-name">{conf}</td>
                        <td>{confTeams.length}</td>
                        <td>
                          <div className="mc-confed-bar-wrap">
                            <div className="mc-confed-bar" style={{ width: `${Math.min(totalWin, 100)}%` }} />
                            <span>{totalWin.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td>{bestTeam?.name ?? '—'} <span className="mc-best-val">({best?.trophy.toFixed(1) ?? 0}%)</span></td>
                        <td>{avgQF.toFixed(1)}%</td>
                        <td>{avgR16.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Dark Horses ── */}
          <div className="mc-section">
            <h3 className="section-subtitle">Dark Horses — Overperformers</h3>
            <p className="mc-chart-desc">Teams with FIFA rank outside top 20 but QF probability above 30%.</p>
            <div className="mc-dark-horses">
              {[...output.pathConfidence]
                .filter(r => {
                  const t = TEAMS.find(t => t.id === r.teamId);
                  return t && t.fifaRanking > 20 && r.qf >= 30;
                })
                .sort((a, b) => b.qf - a.qf)
                .map(row => {
                  const team = TEAMS.find(t => t.id === row.teamId)!;
                  const expected = Math.max(0, 60 - team.fifaRanking * 1.1);
                  const overPerf = row.qf - expected;
                  return (
                    <div key={row.teamId} className="dh-card">
                      <div className="dh-header">
                        <span className="dh-name">{team.name}</span>
                        <span className="dh-rank">Ranked #{team.fifaRanking}</span>
                      </div>
                      <div className="dh-stats">
                        <div className="dh-stat">
                          <span className="dh-stat-label">QF%</span>
                          <span className="dh-stat-val">{row.qf.toFixed(1)}%</span>
                        </div>
                        <div className="dh-stat">
                          <span className="dh-stat-label">SF%</span>
                          <span className="dh-stat-val">{row.sf.toFixed(1)}%</span>
                        </div>
                        <div className="dh-stat">
                          <span className="dh-stat-label">Overperf.</span>
                          <span className="dh-stat-val over">{overPerf > 0 ? '+' : ''}{overPerf.toFixed(1)}%</span>
                        </div>
                        <div className="dh-stat">
                          <span className="dh-stat-label">Win%</span>
                          <span className="dh-stat-val">{row.trophy.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="dh-bar-row">
                        <div className="dh-bar-track">
                          <div className="dh-bar-fill" style={{ width: `${row.qf}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {output.pathConfidence.filter(r => {
                const t = TEAMS.find(t => t.id === r.teamId);
                return t && t.fifaRanking > 20 && r.qf >= 30;
              }).length === 0 && (
                <p className="mc-empty">No dark horses exceeded 30% QF probability in this run.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
