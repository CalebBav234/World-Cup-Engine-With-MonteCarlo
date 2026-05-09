import { useMemo } from 'react';
import type { NarrativeResult, Stage } from '../engine/types';
import { TEAMS } from '../engine/teamData';

type SimId = 'A' | 'B' | 'C' | 'D';

function tName(id: string) { return TEAMS.find(t => t.id === id)?.name ?? id; }
function tRank(id: string) { return TEAMS.find(t => t.id === id)?.fifaRanking ?? 99; }

const STAGES: Stage[] = ['r32', 'r16', 'qf', 'sf', 'final', 'trophy'];
const STAGE_LABELS: Record<Stage, string> = { r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', final: 'Final', trophy: '🏆' };

const KO_STAGES: Array<{ label: string; ids: number[] }> = [
  { label: 'Round of 32', ids: [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88] },
  { label: 'Round of 16', ids: [89, 90, 91, 92, 93, 94, 95, 96] },
  { label: 'Quarter-finals', ids: [97, 98, 99, 100] },
  { label: 'Semi-finals', ids: [101, 102] },
  { label: 'Final', ids: [103] },
];

interface ConfBadgeProps { count: number; total: number }
function ConfBadge({ count, total }: ConfBadgeProps) {
  const cls = count === total ? 'conf-4' : count >= total * 0.75 ? 'conf-3' : 'conf-2';
  return (
    <span className={`conf-badge ${cls}`}>
      {count === 2 && total === 4 ? '⚖️ ' : ''}{count}/{total}
    </span>
  );
}

export function ConsensusTab({ sims }: { sims: Record<SimId, NarrativeResult> }) {
  const simList = useMemo(() => Object.values(sims) as NarrativeResult[], [sims]);

  const data = useMemo(() => {
    const sortByCount = ([ka, a]: [string, number], [kb, b]: [string, number]) =>
      b - a || tRank(ka) - tRank(kb);

    // ── Step 1: Group consensus ──
    const groups = Object.keys(simList[0].groupTables).sort();
    const groupConsensus = groups.map(g => {
      const f1: Record<string, number> = {}, f2: Record<string, number> = {};
      for (const s of simList) {
        const rows = s.groupTables[g] ?? [];
        if (rows[0]) f1[rows[0].teamId] = (f1[rows[0].teamId] ?? 0) + 1;
        if (rows[1]) f2[rows[1].teamId] = (f2[rows[1].teamId] ?? 0) + 1;
      }
      const [fId, fCnt] = Object.entries(f1).sort(sortByCount)[0] ?? ['?', 0];
      const [sId, sCnt] = Object.entries(f2).sort(sortByCount)[0] ?? ['?', 0];
      return { group: g, firstId: fId, firstCount: fCnt, secondId: sId, secondCount: sCnt };
    });

    // ── Step 2: Best thirds ──
    const thirdFreq: Record<string, number> = {};
    for (const s of simList) {
      for (const t of s.thirdPlaceRanking.slice(0, 8)) {
        thirdFreq[t.teamId] = (thirdFreq[t.teamId] ?? 0) + 1;
      }
    }
    const bestThirds = Object.entries(thirdFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id, count]) => ({ id, count }));

    // ── Step 3: Knockout consensus ──
    const allIds = [...new Set(simList.flatMap(s => Object.keys(s.bracket).map(Number)))].sort((a, b) => a - b);
    const knockout: Record<number, { winner: string; count: number; total: number; secondTeam?: string }> = {};
    for (const id of allIds) {
      const freq: Record<string, number> = {};
      for (const s of simList) {
        const w = s.matchWinners[id];
        if (w) freq[w] = (freq[w] ?? 0) + 1;
      }
      const entries = Object.entries(freq).sort(([, a], [, b]) => b - a);
      const [winner, count] = entries[0] ?? ['?', 0];
      knockout[id] = { winner, count, total: simList.length, secondTeam: entries[1]?.[0] };
    }

    // ── Step 4: Summary ──
    const champFreq: Record<string, number> = {};
    const rupFreq: Record<string, number> = {};
    const gbFreq: Record<string, { player: string; teamId: string; count: number }> = {};
    const stageFreq: Record<string, Partial<Record<Stage, number>>> = {};

    for (const s of simList) {
      champFreq[s.champion] = (champFreq[s.champion] ?? 0) + 1;
      rupFreq[s.runnerUp] = (rupFreq[s.runnerUp] ?? 0) + 1;
      const gbKey = s.goldenBoot.player;
      if (!gbFreq[gbKey]) gbFreq[gbKey] = { player: gbKey, teamId: s.goldenBoot.teamId, count: 0 };
      gbFreq[gbKey].count++;
      for (const stage of STAGES) {
        for (const tid of s.stageReached[stage] ?? []) {
          if (!stageFreq[tid]) stageFreq[tid] = {};
          stageFreq[tid][stage] = (stageFreq[tid][stage] ?? 0) + 1;
        }
      }
    }

    const topChamps = Object.entries(champFreq).sort(([, a], [, b]) => b - a);
    const topRunnerUps = Object.entries(rupFreq).sort(([, a], [, b]) => b - a);
    const topGB = Object.values(gbFreq).sort((a, b) => b.count - a.count);

    const coinFlips = Object.entries(knockout)
      .filter(([, v]) => v.count === 2 && v.total === 4 && v.secondTeam)
      .map(([id, v]) => ({ id: +id, team1: v.winner, team2: v.secondTeam! }));

    const topTeams = Object.entries(stageFreq)
      .map(([id, f]) => ({ id, ...f }))
      .sort((a, b) => (b.sf ?? 0) - (a.sf ?? 0) || (b.qf ?? 0) - (a.qf ?? 0) || (b.r16 ?? 0) - (a.r16 ?? 0))
      .slice(0, 16);

    const sfTeams = topTeams.filter(t => (t.sf ?? 0) > 0);

    return {
      groupConsensus, bestThirds, knockout,
      topChamps, topRunnerUps, topGB, stageFreq, topTeams, sfTeams, coinFlips,
      n: simList.length,
    };
  }, [simList]);

  const { groupConsensus, bestThirds, knockout, topChamps, topRunnerUps, topGB, stageFreq, topTeams, sfTeams, coinFlips, n } = data;

  return (
    <div className="consensus-tab">

      {/* ── STEP 1 ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">
          <span className="cs-step">Step 1</span>
          Consensus Group Stage
        </h3>
        <p className="cs-section-desc">Team finishing 1st / 2nd most often across all {n} simulations. Ties broken by FIFA ranking.</p>
        <div className="cg-grid">
          {groupConsensus.map(({ group, firstId, firstCount, secondId, secondCount }) => (
            <div key={group} className="cg-card">
              <div className="cg-header">Group {group}</div>
              <div className="cg-row first">
                <span className="cg-pos">1</span>
                <span className="cg-team">{tName(firstId)}</span>
                <ConfBadge count={firstCount} total={n} />
              </div>
              <div className="cg-row second">
                <span className="cg-pos">2</span>
                <span className="cg-team">{tName(secondId)}</span>
                <ConfBadge count={secondCount} total={n} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEP 2 ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">
          <span className="cs-step">Step 2</span>
          Consensus Best Third-Place Teams
        </h3>
        <p className="cs-section-desc">Teams appearing in the top-8 third-place bracket most often across simulations.</p>
        <div className="thirds-grid">
          {bestThirds.map(({ id, count }, i) => (
            <div key={id} className={`third-chip ${count === n ? 'third-sure' : ''}`}>
              <span className="third-rank">{i + 1}</span>
              <span className="third-name">{tName(id)}</span>
              <span className="third-group">{TEAMS.find(t => t.id === id)?.groupId}</span>
              <ConfBadge count={count} total={n} />
            </div>
          ))}
        </div>
      </section>

      {/* ── STEP 3 ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">
          <span className="cs-step">Step 3</span>
          Consensus Knockout Bracket
        </h3>
        <p className="cs-section-desc">
          Most frequent winner per match. <span className="coin-flip-label">⚖️ 2/4</span> = coin flip.
        </p>
        <div className="ko-stages">
          {KO_STAGES.map(({ label, ids }) => {
            const matchData = ids.map(id => knockout[id]).filter(Boolean);
            if (matchData.length === 0) return null;
            return (
              <div key={label} className="ko-stage">
                <div className="ko-stage-label">{label}</div>
                <div className={`ko-matches cols-${Math.min(ids.length, 4)}`}>
                  {ids.map((id) => {
                    const m = knockout[id];
                    if (!m) return null;
                    const isCoinFlip = m.count === 2 && m.total === 4;
                    return (
                      <div key={id} className={`ko-match ${isCoinFlip ? 'coin-flip' : ''}`}>
                        <span className="ko-mid">M{id}</span>
                        <span className="ko-winner">{tName(m.winner)}</span>
                        <ConfBadge count={m.count} total={m.total} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STEP 4 ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">
          <span className="cs-step">Step 4</span>
          Consensus Summary
        </h3>
        <div className="summary-table-wrap">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Most Likely Team(s)</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="summary-champion">
                <td>🏆 Champion</td>
                <td>{tName(topChamps[0]?.[0] ?? '?')}</td>
                <td><ConfBadge count={topChamps[0]?.[1] ?? 0} total={n} /></td>
              </tr>
              <tr>
                <td>🥈 Runner-Up</td>
                <td>{tName(topRunnerUps[0]?.[0] ?? '?')}</td>
                <td><ConfBadge count={topRunnerUps[0]?.[1] ?? 0} total={n} /></td>
              </tr>
              <tr>
                <td>👟 Golden Boot</td>
                <td>{topGB[0]?.player ?? 'TBD'}</td>
                <td><ConfBadge count={topGB[0]?.count ?? 0} total={n} /></td>
              </tr>
              <tr>
                <td>🎯 Semi-finalists</td>
                <td className="multi-teams">
                  {sfTeams.slice(0, 4).map(t => (
                    <span key={t.id} className="multi-team-chip">{tName(t.id)} <em>{t.sf}/{n}</em></span>
                  ))}
                </td>
                <td>
                  <span className="avg-conf">
                    avg {sfTeams.length > 0 ? (sfTeams.reduce((s, t) => s + (t.sf ?? 0), 0) / Math.max(sfTeams.length, 1)).toFixed(1) : '—'}/{n}
                  </span>
                </td>
              </tr>
              <tr>
                <td>⚽ Quarter-finalists</td>
                <td className="multi-teams">
                  {Object.entries(stageFreq)
                    .filter(([, f]) => (f.qf ?? 0) >= 3)
                    .sort(([, a], [, b]) => (b.qf ?? 0) - (a.qf ?? 0))
                    .slice(0, 8)
                    .map(([id, f]) => (
                      <span key={id} className="multi-team-chip">{tName(id)} <em>{f.qf}/{n}</em></span>
                    ))}
                </td>
                <td>
                  <span className="avg-conf">consistent</span>
                </td>
              </tr>
              {coinFlips.length > 0 && (
                <tr className="summary-coinflip">
                  <td>⚖️ Coin Flips</td>
                  <td className="multi-teams">
                    {coinFlips.map(cf => (
                      <span key={cf.id} className="coinflip-matchup">
                        M{cf.id}: {tName(cf.team1)} vs {tName(cf.team2)}
                      </span>
                    ))}
                  </td>
                  <td><span className="conf-badge conf-2">2/4 (50-50)</span></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CHART: Championship Frequency ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">Championship Frequency</h3>
        <p className="cs-section-desc">How many of {n} narrative simulations each team won.</p>
        <div className="champ-bars">
          {topChamps.filter(([, c]) => c > 0).map(([id, count]) => (
            <div key={id} className="champ-bar-row">
              <span className="champ-bar-label">{tName(id)}</span>
              <div className="champ-bar-track">
                <div
                  className="champ-bar-fill"
                  style={{ width: `${(count / n) * 100}%` }}
                />
              </div>
              <span className="champ-bar-val">{count}/{n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHART: Stage Advancement ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">Stage Advancement — Top Teams</h3>
        <p className="cs-section-desc">How many of {n} simulations each team reached each knockout stage.</p>
        <div className="sa-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Team</th>
                {STAGES.map(s => <th key={s}>{STAGE_LABELS[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {topTeams.map(({ id }) => {
                const f = stageFreq[id] ?? {};
                return (
                  <tr key={id}>
                    <td className="sa-team">{tName(id)}</td>
                    {STAGES.map(s => {
                      const cnt = f[s] ?? 0;
                      return (
                        <td key={s} className={`sa-cell sa-cnt-${cnt}`}>
                          {cnt > 0 ? `${cnt}/${n}` : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CHART: Correlation — who reaches SF together ── */}
      <section className="cs-section">
        <h3 className="cs-section-title">Semi-final Co-occurrence</h3>
        <p className="cs-section-desc">Which teams appeared in the semi-finals of the same simulation.</p>
        <div className="cooccur-grid">
          {sfTeams.slice(0, 8).map(({ id: idA }) => (
            <div key={idA} className="cooccur-row">
              <span className="cooccur-team">{tName(idA)}</span>
              <div className="cooccur-bars">
                {sfTeams.slice(0, 8).filter(({ id }) => id !== idA).map(({ id: idB }) => {
                  const count = simList.filter(s =>
                    s.stageReached.sf?.includes(idA) && s.stageReached.sf?.includes(idB)
                  ).length;
                  return (
                    <div key={idB} className="cooccur-item" title={`${tName(idA)} + ${tName(idB)}: ${count}/${n} sims`}>
                      <span className="cooccur-name">{tName(idB)}</span>
                      <div className="cooccur-bar-track">
                        <div className="cooccur-bar-fill" style={{ width: `${(count / n) * 100}%` }} />
                      </div>
                      <span className="cooccur-val">{count}/{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
