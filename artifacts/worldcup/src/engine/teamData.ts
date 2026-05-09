import type { Team } from './types';

export const TEAMS: Team[] = [
  // Group A
  { id:'MEX', name:'Mexico',         groupId:'A', fifaRanking:15, eloRating:1680, xGPerMatch:1.45, xGAgainstPerMatch:1.20, confederation:'CONCACAF', pressingStyle:'mid',  isHost:true,  fairPlayScore:8,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'RSA', name:'South Africa',   groupId:'A', fifaRanking:68, eloRating:1256, xGPerMatch:0.85, xGAgainstPerMatch:1.55, confederation:'CAF',      pressingStyle:'low',  isHost:false, fairPlayScore:8,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'KOR', name:'South Korea',    groupId:'A', fifaRanking:22, eloRating:1624, xGPerMatch:1.35, xGAgainstPerMatch:1.25, confederation:'AFC',      pressingStyle:'high', isHost:false, fairPlayScore:5,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'CZE', name:'Czechia',        groupId:'A', fifaRanking:37, eloRating:1504, xGPerMatch:1.20, xGAgainstPerMatch:1.30, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  // Group B
  { id:'CAN', name:'Canada',         groupId:'B', fifaRanking:16, eloRating:1672, xGPerMatch:1.50, xGAgainstPerMatch:1.15, confederation:'CONCACAF', pressingStyle:'high', isHost:true,  fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'SUI', name:'Switzerland',    groupId:'B', fifaRanking:20, eloRating:1640, xGPerMatch:1.40, xGAgainstPerMatch:1.10, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:4,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'QAT', name:'Qatar',          groupId:'B', fifaRanking:58, eloRating:1336, xGPerMatch:0.90, xGAgainstPerMatch:1.50, confederation:'AFC',      pressingStyle:'low',  isHost:false, fairPlayScore:11, altitudeAcclimated:false, heatAcclimated:true  },
  { id:'BIH', name:'Bosnia & Herz.', groupId:'B', fifaRanking:55, eloRating:1360, xGPerMatch:1.05, xGAgainstPerMatch:1.40, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:false },
  // Group C
  { id:'BRA', name:'Brazil',         groupId:'C', fifaRanking:6,  eloRating:1752, xGPerMatch:1.85, xGAgainstPerMatch:0.95, confederation:'CONMEBOL', pressingStyle:'high', isHost:false, fairPlayScore:9,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'MAR', name:'Morocco',        groupId:'C', fifaRanking:13, eloRating:1696, xGPerMatch:1.30, xGAgainstPerMatch:0.85, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:5,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'HAI', name:'Haiti',          groupId:'C', fifaRanking:82, eloRating:1144, xGPerMatch:0.65, xGAgainstPerMatch:1.80, confederation:'CONCACAF', pressingStyle:'low',  isHost:false, fairPlayScore:10, altitudeAcclimated:false, heatAcclimated:true  },
  { id:'SCO', name:'Scotland',       groupId:'C', fifaRanking:39, eloRating:1488, xGPerMatch:1.25, xGAgainstPerMatch:1.35, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  // Group D
  { id:'USA', name:'USA',            groupId:'D', fifaRanking:14, eloRating:1688, xGPerMatch:1.55, xGAgainstPerMatch:1.20, confederation:'CONCACAF', pressingStyle:'high', isHost:true,  fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'PAR', name:'Paraguay',       groupId:'D', fifaRanking:62, eloRating:1304, xGPerMatch:0.95, xGAgainstPerMatch:1.45, confederation:'CONMEBOL', pressingStyle:'low',  isHost:false, fairPlayScore:13, altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'AUS', name:'Australia',      groupId:'D', fifaRanking:24, eloRating:1608, xGPerMatch:1.30, xGAgainstPerMatch:1.25, confederation:'AFC',      pressingStyle:'high', isHost:false, fairPlayScore:5,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'TUR', name:'Turkiye',        groupId:'D', fifaRanking:29, eloRating:1568, xGPerMatch:1.35, xGAgainstPerMatch:1.30, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:9,  altitudeAcclimated:false, heatAcclimated:false },
  // Group E
  { id:'GER', name:'Germany',        groupId:'E', fifaRanking:9,  eloRating:1728, xGPerMatch:1.75, xGAgainstPerMatch:1.10, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:5,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'CUW', name:'Curacao',        groupId:'E', fifaRanking:88, eloRating:1096, xGPerMatch:0.60, xGAgainstPerMatch:1.90, confederation:'CONCACAF', pressingStyle:'low',  isHost:false, fairPlayScore:12, altitudeAcclimated:false, heatAcclimated:true  },
  { id:'CIV', name:'Ivory Coast',    groupId:'E', fifaRanking:47, eloRating:1424, xGPerMatch:1.15, xGAgainstPerMatch:1.35, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:8,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'ECU', name:'Ecuador',        groupId:'E', fifaRanking:43, eloRating:1456, xGPerMatch:1.20, xGAgainstPerMatch:1.30, confederation:'CONMEBOL', pressingStyle:'mid',  isHost:false, fairPlayScore:7,  altitudeAcclimated:true,  heatAcclimated:true  },
  // Group F
  { id:'NED', name:'Netherlands',    groupId:'F', fifaRanking:7,  eloRating:1744, xGPerMatch:1.80, xGAgainstPerMatch:1.05, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'JPN', name:'Japan',          groupId:'F', fifaRanking:11, eloRating:1712, xGPerMatch:1.55, xGAgainstPerMatch:1.00, confederation:'AFC',      pressingStyle:'high', isHost:false, fairPlayScore:2,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'SWE', name:'Sweden',         groupId:'F', fifaRanking:25, eloRating:1600, xGPerMatch:1.35, xGAgainstPerMatch:1.20, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:4,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'TUN', name:'Tunisia',        groupId:'F', fifaRanking:30, eloRating:1560, xGPerMatch:1.10, xGAgainstPerMatch:1.35, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:true  },
  // Group G
  { id:'BEL', name:'Belgium',        groupId:'G', fifaRanking:8,  eloRating:1736, xGPerMatch:1.70, xGAgainstPerMatch:1.10, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'EGY', name:'Egypt',          groupId:'G', fifaRanking:34, eloRating:1528, xGPerMatch:1.15, xGAgainstPerMatch:1.25, confederation:'CAF',      pressingStyle:'low',  isHost:false, fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'IRN', name:'Iran',           groupId:'G', fifaRanking:21, eloRating:1632, xGPerMatch:1.10, xGAgainstPerMatch:1.20, confederation:'AFC',      pressingStyle:'mid',  isHost:false, fairPlayScore:10, altitudeAcclimated:false, heatAcclimated:false },
  { id:'NZL', name:'New Zealand',    groupId:'G', fifaRanking:91, eloRating:1072, xGPerMatch:0.70, xGAgainstPerMatch:1.75, confederation:'OFC',      pressingStyle:'mid',  isHost:false, fairPlayScore:12, altitudeAcclimated:false, heatAcclimated:false },
  // Group H
  { id:'ESP', name:'Spain',          groupId:'H', fifaRanking:2,  eloRating:1816, xGPerMatch:2.10, xGAgainstPerMatch:0.80, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:3,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'CPV', name:'Cape Verde',     groupId:'H', fifaRanking:74, eloRating:1208, xGPerMatch:0.80, xGAgainstPerMatch:1.60, confederation:'CAF',      pressingStyle:'low',  isHost:false, fairPlayScore:12, altitudeAcclimated:false, heatAcclimated:true  },
  { id:'KSA', name:'Saudi Arabia',   groupId:'H', fifaRanking:56, eloRating:1352, xGPerMatch:1.00, xGAgainstPerMatch:1.45, confederation:'AFC',      pressingStyle:'low',  isHost:false, fairPlayScore:9,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'URU', name:'Uruguay',        groupId:'H', fifaRanking:10, eloRating:1720, xGPerMatch:1.50, xGAgainstPerMatch:1.05, confederation:'CONMEBOL', pressingStyle:'mid',  isHost:false, fairPlayScore:11, altitudeAcclimated:true,  heatAcclimated:true  },
  // Group I
  { id:'FRA', name:'France',         groupId:'I', fifaRanking:1,  eloRating:1824, xGPerMatch:2.05, xGAgainstPerMatch:0.85, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'SEN', name:'Senegal',        groupId:'I', fifaRanking:18, eloRating:1656, xGPerMatch:1.40, xGAgainstPerMatch:1.10, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'NOR', name:'Norway',         groupId:'I', fifaRanking:26, eloRating:1592, xGPerMatch:1.60, xGAgainstPerMatch:1.25, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:3,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'IRQ', name:'Iraq',           groupId:'I', fifaRanking:63, eloRating:1296, xGPerMatch:0.85, xGAgainstPerMatch:1.55, confederation:'AFC',      pressingStyle:'low',  isHost:false, fairPlayScore:12, altitudeAcclimated:false, heatAcclimated:true  },
  // Group J
  { id:'ARG', name:'Argentina',      groupId:'J', fifaRanking:3,  eloRating:1808, xGPerMatch:1.95, xGAgainstPerMatch:0.90, confederation:'CONMEBOL', pressingStyle:'mid',  isHost:false, fairPlayScore:10, altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'ALG', name:'Algeria',        groupId:'J', fifaRanking:36, eloRating:1512, xGPerMatch:1.15, xGAgainstPerMatch:1.30, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:8,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'AUT', name:'Austria',        groupId:'J', fifaRanking:28, eloRating:1576, xGPerMatch:1.45, xGAgainstPerMatch:1.20, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:5,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'JOR', name:'Jordan',         groupId:'J', fifaRanking:77, eloRating:1184, xGPerMatch:0.70, xGAgainstPerMatch:1.65, confederation:'AFC',      pressingStyle:'low',  isHost:false, fairPlayScore:12, altitudeAcclimated:false, heatAcclimated:true  },
  // Group K
  { id:'POR', name:'Portugal',       groupId:'K', fifaRanking:5,  eloRating:1760, xGPerMatch:1.90, xGAgainstPerMatch:0.95, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:8,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'UZB', name:'Uzbekistan',     groupId:'K', fifaRanking:71, eloRating:1232, xGPerMatch:0.85, xGAgainstPerMatch:1.55, confederation:'AFC',      pressingStyle:'mid',  isHost:false, fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'COL', name:'Colombia',       groupId:'K', fifaRanking:12, eloRating:1704, xGPerMatch:1.65, xGAgainstPerMatch:1.05, confederation:'CONMEBOL', pressingStyle:'high', isHost:false, fairPlayScore:9,  altitudeAcclimated:true,  heatAcclimated:true  },
  { id:'COD', name:'DR Congo',       groupId:'K', fifaRanking:48, eloRating:1416, xGPerMatch:1.05, xGAgainstPerMatch:1.40, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:10, altitudeAcclimated:false, heatAcclimated:true  },
  // Group L
  { id:'ENG', name:'England',        groupId:'L', fifaRanking:4,  eloRating:1784, xGPerMatch:1.90, xGAgainstPerMatch:0.95, confederation:'UEFA',     pressingStyle:'high', isHost:false, fairPlayScore:6,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'CRO', name:'Croatia',        groupId:'L', fifaRanking:10, eloRating:1720, xGPerMatch:1.40, xGAgainstPerMatch:1.10, confederation:'UEFA',     pressingStyle:'mid',  isHost:false, fairPlayScore:5,  altitudeAcclimated:false, heatAcclimated:false },
  { id:'GHA', name:'Ghana',          groupId:'L', fifaRanking:53, eloRating:1376, xGPerMatch:1.10, xGAgainstPerMatch:1.40, confederation:'CAF',      pressingStyle:'mid',  isHost:false, fairPlayScore:8,  altitudeAcclimated:false, heatAcclimated:true  },
  { id:'PAN', name:'Panama',         groupId:'L', fifaRanking:49, eloRating:1408, xGPerMatch:1.00, xGAgainstPerMatch:1.45, confederation:'CONCACAF', pressingStyle:'low',  isHost:false, fairPlayScore:7,  altitudeAcclimated:false, heatAcclimated:true  },
];

export const GROUP_DRAW: Record<string, string[]> = TEAMS.reduce((acc, t) => {
  if (!acc[t.groupId]) acc[t.groupId] = [];
  acc[t.groupId].push(t.id);
  return acc;
}, {} as Record<string, string[]>);
