export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';
export type VenueClimate  = 'altitude' | 'extreme_heat' | 'cool' | 'indoor_neutral';
export type Stage         = 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'trophy';
export type PressingStyle = 'high' | 'mid' | 'low';

export interface Team {
  id: string;
  name: string;
  groupId: string;
  fifaRanking: number;
  eloRating: number;
  xGPerMatch: number;
  xGAgainstPerMatch: number;
  confederation: Confederation;
  pressingStyle: PressingStyle;
  isHost: boolean;
  fairPlayScore: number;
  altitudeAcclimated: boolean;
  heatAcclimated: boolean;
}

export interface MatchContext {
  matchId: number;
  climate: VenueClimate;
  isKnockout: boolean;
  minute?: number;
  scoreA?: number;
  scoreB?: number;
}

export interface MatchResult {
  matchId: number;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  xGa: number;
  xGb: number;
  aet: boolean;
  penalties: boolean;
  penScoreA?: number;
  penScoreB?: number;
  winner: string;
  climate: VenueClimate;
}

export interface GroupRow {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  xGFor: number;
  xGAgainst: number;
  position: 1 | 2 | 3 | 4;
}

export interface ThirdPlaceTeam extends GroupRow {
  groupId: string;
}

export interface TournamentResult {
  groupTables: Record<string, GroupRow[]>;
  thirdPlaceRanking: ThirdPlaceTeam[];
  thirdPlaceAssignment: Record<number, string>;
  bracket: Record<number, MatchResult>;
  matchWinners: Record<number, string>;
  stageReached: Record<Stage, string[]>;
}

export interface NarrativeResult extends TournamentResult {
  simId: 'A' | 'B' | 'C' | 'D';
  champion: string;
  runnerUp: string;
  goldenBoot: { player: string; teamId: string; goals: number };
  cinderellaTeam: string;
  biggestUpset: string;
  starPlayerOut: { player: string; reason: 'suspension' | 'injury'; matchId: number };
}

export interface PathConfidenceScore {
  teamId: string;
  r32: number; r16: number; qf: number; sf: number; final: number; trophy: number;
}

export interface MonteCarloOutput {
  iterations: number;
  pathConfidence: PathConfidenceScore[];
  matchWinCounts: Record<number, Record<string, number>>;
  consensusBracket: Record<number, string>;
  coinFlipMatchIds: number[];
}

export interface GroupDraw {
  [groupId: string]: string[];
}
