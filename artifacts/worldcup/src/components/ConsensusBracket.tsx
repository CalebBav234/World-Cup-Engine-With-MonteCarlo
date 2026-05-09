import { TEAMS } from '../engine/teamData';

interface MonteCarloData {
  winner: string;
  count: number;
  total: number;
}

interface Props {
  source: '4sim' | 'montecarlo';
  data: Record<number, string> | Record<number, MonteCarloData>;
}

interface BracketSlot {
  matchId: number;
  label: string;
  round: string;
}

const BRACKET_STRUCTURE: BracketSlot[] = [
  // R16
  { matchId: 89, label: 'R16-1', round: 'R16' },
  { matchId: 90, label: 'R16-2', round: 'R16' },
  { matchId: 91, label: 'R16-3', round: 'R16' },
  { matchId: 92, label: 'R16-4', round: 'R16' },
  { matchId: 93, label: 'R16-5', round: 'R16' },
  { matchId: 94, label: 'R16-6', round: 'R16' },
  { matchId: 95, label: 'R16-7', round: 'R16' },
  { matchId: 96, label: 'R16-8', round: 'R16' },
  // QF
  { matchId: 97,  label: 'QF-1', round: 'QF' },
  { matchId: 98,  label: 'QF-2', round: 'QF' },
  { matchId: 99,  label: 'QF-3', round: 'QF' },
  { matchId: 100, label: 'QF-4', round: 'QF' },
  // SF
  { matchId: 101, label: 'SF-1', round: 'SF' },
  { matchId: 102, label: 'SF-2', round: 'SF' },
  // Final
  { matchId: 103, label: 'FINAL', round: 'Final' },
];

function teamName(id: string): string {
  return TEAMS.find(t => t.id === id)?.name ?? id;
}

export function ConsensusBracket({ source, data }: Props) {
  const rounds = ['R16', 'QF', 'SF', 'Final'];

  return (
    <div className="bracket-wrap">
      {rounds.map(round => {
        const slots = BRACKET_STRUCTURE.filter(s => s.round === round);
        return (
          <div key={round} className="bracket-round">
            <div className="bracket-round-label">{round}</div>
            <div className="bracket-matches">
              {slots.map(slot => {
                const entry = (data as Record<number, string | MonteCarloData>)[slot.matchId];
                if (!entry) {
                  return (
                    <div key={slot.matchId} className="bracket-match empty">
                      <span className="match-id">M{slot.matchId}</span>
                      <span className="match-tbd">TBD</span>
                    </div>
                  );
                }

                if (source === 'montecarlo' && typeof entry === 'object') {
                  const mc = entry as MonteCarloData;
                  return (
                    <div key={slot.matchId} className="bracket-match">
                      <span className="match-id">M{slot.matchId}</span>
                      <span className="match-winner">{teamName(mc.winner)}</span>
                      <span className="match-freq">{mc.count.toLocaleString()} / {mc.total.toLocaleString()}</span>
                    </div>
                  );
                }

                const winnerId = typeof entry === 'string' ? entry : (entry as MonteCarloData).winner;
                return (
                  <div key={slot.matchId} className="bracket-match">
                    <span className="match-id">M{slot.matchId}</span>
                    <span className="match-winner">{teamName(winnerId)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
