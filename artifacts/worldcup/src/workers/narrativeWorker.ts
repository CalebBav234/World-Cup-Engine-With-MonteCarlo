import { runFullTournament } from '../engine/core';
import { TEAMS, GROUP_DRAW } from '../engine/teamData';
import type { NarrativeResult, TournamentResult } from '../engine/types';

const PER_RUN_CONFIG = {
  A: { forcedGroupExit: 'BEL', starOut: { player: 'Mbappe',       teamId: 'FRA', reason: 'injury'     as const } },
  B: { forcedGroupExit: 'GER', starOut: { player: 'Bellingham',    teamId: 'ENG', reason: 'suspension' as const } },
  C: { forcedGroupExit: 'NED', starOut: { player: 'Vinicius Jr.',  teamId: 'BRA', reason: 'injury'     as const } },
  D: { forcedGroupExit: 'POR', starOut: { player: 'Ronaldo',       teamId: 'POR', reason: 'suspension' as const } },
};

type SimId = 'A' | 'B' | 'C' | 'D';

function passesConstraints(
  result: TournamentResult,
  simId: SimId,
  previousRuns: NarrativeResult[],
  config: typeof PER_RUN_CONFIG[SimId]
): boolean {
  const { stageReached } = result;
  const qfTeams = stageReached.qf;

  const exitedInGroup = !stageReached.r32.includes(config.forcedGroupExit);
  if (!exitedInGroup) return false;

  const cinderellaQF = qfTeams.filter(id => {
    const t = TEAMS.find(t => t.id === id);
    return t && t.fifaRanking > 30;
  });
  if (cinderellaQF.length < 2) return false;

  const hosts = ['USA', 'CAN', 'MEX'];
  if (!hosts.some(h => stageReached.r16.includes(h))) return false;

  const topHalf  = ['ESP','ARG','FRA','ENG'].filter(id => {
    const matchEntry = Object.entries(result.bracket).find(
      ([k, v]) => [89,90,91,92].includes(+k) && (v.teamA === id || v.teamB === id)
    );
    return !!matchEntry;
  });
  const hasSameHalfPair = (a: string, b: string) => {
    const aTop = topHalf.includes(a); const bTop = topHalf.includes(b);
    return (aTop && bTop) || (!aTop && !bTop);
  };
  if (hasSameHalfPair('ESP','ARG')) return false;
  if (hasSameHalfPair('FRA','ENG')) return false;

  if (previousRuns.length > 0) {
    const prevQF = previousRuns[previousRuns.length - 1].stageReached.qf;
    const different = qfTeams.filter(id => !prevQF.includes(id)).length;
    if (different < 3) return false;
  }

  const cinderellaPool = ['MAR','SEN','JPN','KOR','ALG','COL'];
  const allQFSoFar = new Set([
    ...previousRuns.flatMap(r => r.stageReached.qf),
    ...qfTeams
  ]);
  const poolInQF = cinderellaPool.filter(id => allQFSoFar.has(id)).length;
  if (poolInQF < 2) return false;

  return true;
}

function applyNarrativeOverlays(
  result: TournamentResult,
  simId: SimId,
  config: typeof PER_RUN_CONFIG[SimId]
): NarrativeResult {
  const champion  = result.matchWinners[103] ?? '';
  const finalist  = result.bracket[103];
  const runnerUp  = finalist
    ? (finalist.winner === finalist.teamA ? finalist.teamB : finalist.teamA)
    : '';
  const cinderellaTeam = result.stageReached.qf.find(id => {
    const t = TEAMS.find(t => t.id === id);
    return t && t.fifaRanking > 30;
  }) ?? '';
  return {
    ...result,
    simId,
    champion,
    runnerUp,
    goldenBoot: { player: 'TBD', teamId: champion, goals: Math.floor(Math.random() * 4) + 5 },
    cinderellaTeam,
    biggestUpset: config.forcedGroupExit + ' eliminated in group stage',
    starPlayerOut: { ...config.starOut, matchId: 1 },
  };
}

self.onmessage = () => {
  const results: NarrativeResult[] = [];

  for (const simId of ['A','B','C','D'] as SimId[]) {
    const config = PER_RUN_CONFIG[simId];
    let result: NarrativeResult | null = null;
    let attempts = 0;

    while (!result && attempts < 100) {
      try {
        const raw = runFullTournament(TEAMS, GROUP_DRAW);
        if (passesConstraints(raw, simId, results, config)) {
          result = applyNarrativeOverlays(raw, simId, config);
        }
      } catch {
        // retry on error
      }
      attempts++;
    }

    if (!result) {
      // Run without constraints if all attempts fail
      try {
        const raw = runFullTournament(TEAMS, GROUP_DRAW);
        result = applyNarrativeOverlays(raw, simId, config);
      } catch (err) {
        self.postMessage({ type: 'error', simId, message: `Failed after 100 attempts: ${err}` });
        return;
      }
    }

    results.push(result);
    self.postMessage({ type: 'sim_complete', simId, result });
  }

  self.postMessage({ type: 'all_complete', results });
};
