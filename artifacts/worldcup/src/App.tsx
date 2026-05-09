import { useState, useEffect, useRef } from 'react';
import type { NarrativeResult, GroupRow, MatchResult } from './engine/types';
import { TEAMS } from './engine/teamData';
import { MonteCarloPanel } from './components/MonteCarloPanel';
import { ConsensusBracket } from './components/ConsensusBracket';

type SimId = 'A' | 'B' | 'C' | 'D';
type TabId = 'A' | 'B' | 'C' | 'D' | 'montecarlo';

interface SimState {
  A: NarrativeResult | null;
  B: NarrativeResult | null;
  C: NarrativeResult | null;
  D: NarrativeResult | null;
}

function teamName(id: string) {
  return TEAMS.find(t => t.id === id)?.name ?? id;
}

function stageBadge(stage: string) {
  const map: Record<string, string> = {
    r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', final: 'Final', trophy: 'Champion'
  };
  return map[stage] ?? stage;
}

function GroupTable({ rows }: { rows: GroupRow[] }) {
  return (
    <table className="group-table">
      <thead>
        <tr>
          <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>
          <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.teamId} className={i < 2 ? 'qualified' : i === 2 ? 'third-place' : ''}>
            <td>{i + 1}</td>
            <td className="team-cell">
              <span className="team-flag">{r.teamId}</span>
              <span>{teamName(r.teamId)}</span>
            </td>
            <td>{r.played}</td>
            <td>{r.wins}</td>
            <td>{r.draws}</td>
            <td>{r.losses}</td>
            <td>{r.gf}</td>
            <td>{r.ga}</td>
            <td className={r.gd > 0 ? 'pos' : r.gd < 0 ? 'neg' : ''}>{r.gd > 0 ? '+' : ''}{r.gd}</td>
            <td className="pts-cell">{r.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MatchCard({ match }: { match: MatchResult }) {
  return (
    <div className={`match-card ${match.penalties ? 'pens' : match.aet ? 'aet' : ''}`}>
      <span className={`match-team ${match.winner === match.teamA ? 'winner' : ''}`}>
        {teamName(match.teamA)}
      </span>
      <span className="match-score">
        {match.scoreA} – {match.scoreB}
        {match.aet && <sup>{match.penalties ? 'P' : 'AET'}</sup>}
      </span>
      <span className={`match-team right ${match.winner === match.teamB ? 'winner' : ''}`}>
        {teamName(match.teamB)}
      </span>
    </div>
  );
}

function NarrativeTab({ result, simId }: { result: NarrativeResult | null; simId: SimId }) {
  if (!result) {
    return (
      <div className="sim-loading">
        <div className="spinner" />
        <p>Running simulation {simId}…</p>
      </div>
    );
  }

  const groupIds = Object.keys(result.groupTables).sort();
  const bracketEntries = Object.entries(result.bracket)
    .map(([id, m]) => ({ id: +id, match: m }))
    .sort((a, b) => a.id - b.id);

  const r32 = bracketEntries.filter(e => e.id >= 74 && e.id <= 88);
  const r16 = bracketEntries.filter(e => e.id >= 89 && e.id <= 96);
  const qf  = bracketEntries.filter(e => e.id >= 97 && e.id <= 100);
  const sf  = bracketEntries.filter(e => e.id >= 101 && e.id <= 102);
  const fin = bracketEntries.filter(e => e.id === 103);

  const starTeam = TEAMS.find(t => t.id === result.starPlayerOut.teamId);

  return (
    <div className="narrative-tab">
      {/* Hero */}
      <div className="sim-hero">
        <div className="sim-hero-badge">Simulation {simId}</div>
        <div className="sim-champion-wrap">
          <span className="sim-champion-label">Champion</span>
          <span className="sim-champion">{teamName(result.champion)}</span>
        </div>
        <div className="sim-hero-details">
          <div className="hero-stat">
            <span className="hero-stat-label">Runner-up</span>
            <span className="hero-stat-val">{teamName(result.runnerUp)}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Golden Boot</span>
            <span className="hero-stat-val">{result.goldenBoot.player} ({result.goldenBoot.goals})</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-label">Cinderella</span>
            <span className="hero-stat-val">{teamName(result.cinderellaTeam)}</span>
          </div>
          <div className="hero-stat upset">
            <span className="hero-stat-label">Biggest Upset</span>
            <span className="hero-stat-val">{result.biggestUpset}</span>
          </div>
          <div className="hero-stat injury">
            <span className="hero-stat-label">{result.starPlayerOut.reason === 'injury' ? 'Injured' : 'Suspended'}</span>
            <span className="hero-stat-val">{result.starPlayerOut.player} ({starTeam?.name})</span>
          </div>
        </div>
      </div>

      {/* Group Stage */}
      <section className="sim-section">
        <h3 className="sim-section-title">Group Stage</h3>
        <div className="groups-grid">
          {groupIds.map(g => (
            <div key={g} className="group-block">
              <div className="group-header">Group {g}</div>
              <GroupTable rows={result.groupTables[g]} />
            </div>
          ))}
        </div>
      </section>

      {/* Knockout Bracket */}
      <section className="sim-section">
        <h3 className="sim-section-title">Knockout Bracket</h3>

        {r32.length > 0 && (
          <div className="bracket-stage">
            <div className="bracket-stage-label">Round of 32</div>
            <div className="matches-grid">{r32.map(e => <MatchCard key={e.id} match={e.match} />)}</div>
          </div>
        )}
        {r16.length > 0 && (
          <div className="bracket-stage">
            <div className="bracket-stage-label">Round of 16</div>
            <div className="matches-grid">{r16.map(e => <MatchCard key={e.id} match={e.match} />)}</div>
          </div>
        )}
        {qf.length > 0 && (
          <div className="bracket-stage">
            <div className="bracket-stage-label">Quarter-finals</div>
            <div className="matches-grid">{qf.map(e => <MatchCard key={e.id} match={e.match} />)}</div>
          </div>
        )}
        {sf.length > 0 && (
          <div className="bracket-stage">
            <div className="bracket-stage-label">Semi-finals</div>
            <div className="matches-grid">{sf.map(e => <MatchCard key={e.id} match={e.match} />)}</div>
          </div>
        )}
        {fin.length > 0 && (
          <div className="bracket-stage final-stage">
            <div className="bracket-stage-label">Final</div>
            <div className="matches-grid">{fin.map(e => <MatchCard key={e.id} match={e.match} />)}</div>
          </div>
        )}
      </section>

      {/* Consensus Bracket */}
      <section className="sim-section">
        <h3 className="sim-section-title">Bracket Summary</h3>
        <ConsensusBracket
          source="4sim"
          data={Object.fromEntries(Object.entries(result.matchWinners))}
        />
      </section>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('A');
  const [sims, setSims] = useState<SimState>({ A: null, B: null, C: null, D: null });
  const [simError, setSimError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [isRerunning, setIsRerunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    setSims({ A: null, B: null, C: null, D: null });
    setSimError(null);

    const worker = new Worker(
      new URL('./workers/narrativeWorker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'sim_complete') {
        const simId = msg.simId as SimId;
        setSims(prev => {
          const next = { ...prev, [simId]: msg.result };
          const allDone = (['A','B','C','D'] as SimId[]).every(s => next[s] !== null);
          if (allDone) setIsRerunning(false);
          return next;
        });
      } else if (msg.type === 'error') {
        setSimError(`Sim ${msg.simId}: ${msg.message}`);
        setIsRerunning(false);
      }
    };

    worker.onerror = (err) => {
      setSimError(err.message);
      setIsRerunning(false);
    };

    worker.postMessage(null);

    return () => {
      worker.terminate();
    };
  }, [runId]);

  function handleRerun() {
    workerRef.current?.terminate();
    setIsRerunning(true);
    setActiveTab('A');
    setRunId(prev => prev + 1);
  }

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'A', label: 'Sim A' },
    { id: 'B', label: 'Sim B' },
    { id: 'C', label: 'Sim C' },
    { id: 'D', label: 'Sim D' },
    { id: 'montecarlo', label: 'Monte Carlo' },
  ];

  const completedCount = ['A','B','C','D'].filter(s => sims[s as SimId] !== null).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-trophy">🏆</div>
            <div>
              <h1 className="header-title">2026 FIFA World Cup</h1>
              <p className="header-sub">Dual-Engine Simulation System</p>
            </div>
          </div>
          <div className="header-right">
            <div className="engine-pill narrative">
              <span className="engine-dot" />
              Narrative Engine {completedCount < 4 ? `(${completedCount}/4)` : '(4/4)'}
            </div>
            <div className="engine-pill mc">
              <span className="engine-dot" />
              Monte Carlo · 10k iterations
            </div>
            <button
              className={`rerun-btn ${isRerunning ? 'rerunning' : ''}`}
              onClick={handleRerun}
              disabled={isRerunning}
              title="Re-run all simulations with new random seeds"
            >
              {isRerunning ? (
                <>
                  <span className="rerun-spinner" />
                  Running…
                </>
              ) : (
                <>
                  <span className="rerun-icon">↺</span>
                  Re-run
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {simError && (
        <div className="sim-error-banner">{simError}</div>
      )}

      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id !== 'montecarlo' && sims[tab.id as SimId] && (
              <span className="tab-done">✓</span>
            )}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'montecarlo' ? (
          <MonteCarloPanel key={runId} autoRun />
        ) : (
          <NarrativeTab
            result={sims[activeTab as SimId]}
            simId={activeTab as SimId}
          />
        )}
      </main>
    </div>
  );
}
