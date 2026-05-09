import { runFullTournament, setRng } from '../engine/core';
import { TEAMS, GROUP_DRAW } from '../engine/teamData';
import type { Stage, MonteCarloOutput } from '../engine/types';
import { mulberry32, randomSeed } from '../engine/rng';

self.onmessage = (e: MessageEvent<{ seed?: number } | null>) => {
  const seed = e.data?.seed ?? randomSeed();
  setRng(mulberry32(seed));
  const N = 10_000;
  const STAGES: Stage[] = ['r32','r16','qf','sf','final','trophy'];

  const counters: Record<string, Record<Stage, number>> = {};
  TEAMS.forEach(t => { counters[t.id] = { r32:0, r16:0, qf:0, sf:0, final:0, trophy:0 }; });

  const matchWinCounts: Record<number, Record<string, number>> = {};

  for (let i = 0; i < N; i++) {
    try {
      const result = runFullTournament(TEAMS, GROUP_DRAW);

      for (const stage of STAGES) {
        for (const teamId of (result.stageReached[stage] ?? [])) {
          if (counters[teamId]) {
            counters[teamId][stage]++;
          }
        }
      }
      for (const [id, winner] of Object.entries(result.matchWinners)) {
        if (!matchWinCounts[+id]) matchWinCounts[+id] = {};
        matchWinCounts[+id][winner] = (matchWinCounts[+id][winner] ?? 0) + 1;
      }
    } catch {
      // skip failed iterations
    }

    if (i % 500 === 0) {
      self.postMessage({ type: 'progress', pct: Math.round((i / N) * 100) });
    }
  }

  const pathConfidence = TEAMS.map(t => ({
    teamId: t.id,
    r32:    +(counters[t.id].r32    / N * 100).toFixed(1),
    r16:    +(counters[t.id].r16    / N * 100).toFixed(1),
    qf:     +(counters[t.id].qf     / N * 100).toFixed(1),
    sf:     +(counters[t.id].sf     / N * 100).toFixed(1),
    final:  +(counters[t.id].final  / N * 100).toFixed(1),
    trophy: +(counters[t.id].trophy / N * 100).toFixed(1),
  }));

  const consensusBracket: Record<number, string> = {};
  for (const [id, counts] of Object.entries(matchWinCounts)) {
    consensusBracket[+id] = Object.entries(counts).sort(([,a],[,b]) => b - a)[0][0];
  }

  const coinFlipMatchIds = Object.entries(matchWinCounts)
    .filter(([, counts]) => {
      const total = Object.values(counts).reduce((s, n) => s + n, 0);
      const top   = Math.max(...Object.values(counts));
      const pct   = top / total;
      return pct >= 0.45 && pct <= 0.55;
    })
    .map(([id]) => Number(id));

  const output: MonteCarloOutput = {
    iterations: N, pathConfidence, matchWinCounts, consensusBracket, coinFlipMatchIds
  };
  self.postMessage({ type: 'complete', output });
};
