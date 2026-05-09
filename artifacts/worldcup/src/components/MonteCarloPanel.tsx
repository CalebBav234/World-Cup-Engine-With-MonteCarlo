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
        </div>
      )}
    </div>
  );
}
