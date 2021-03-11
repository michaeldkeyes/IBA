export type Game = {
  gameId?: number;
  winner: { teamId: number; points: number };
  loser: { teamId: number; points: number };
  teams: TeamStats[];
  overtimes: number;
};

interface PlayerAttributes {
  scoring: number;
  twoRate: number;
  threeRate: number;
  twoPercentage: number;
  threePercentage: number;
  freeRate: number;
  freePercentage: number;
  rebounding: number;
  passing: number;
  stealing: number;
  blocking: number;
  ballHandling: number;
  offensiveAbility: number;
}

export interface Player extends PlayerAttributes {
  playerId?: number;
  position: string;
  overall: number;
  teamId: number;
  first: string;
  last: string;
  stats: StatBase & PlayerStats;
  gameStats?: StatBase & PlayerStats;
}

export interface PlayerGameStats extends StatBase {
  playerId: number;
  name: string;
  min: number;
  minutesToPlayThisQuarter: number;
  pos: string;
  attr: PlayerAttributes;
}

export type Schedule = {
  gameId?: number;
  day?: number;
  homeTeamId: number;
  awayTeamId: number;
};

interface StatBase {
  points: number;
  fga: number;
  fgm: number;
  threepa: number;
  threepm: number;
  fta: number;
  ftm: number;
  orb: number;
  drb: number;
  trb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
}

export type PlayerStats = {
  gamesPlayed?: number;
  min: number;
};

export type Team = {
  teamId: number;
  name: string;
  abbrev: string;
  conference: string;
  city: string;
  division: string;
};

export interface TeamStats extends StatBase {
  teamId?: number;
  abbrev?: string;
  wins: number;
  losses: number;
  oppPoints: number;
  oppFga: number;
  oppFgm: number;
  oppThreepa: number;
  oppThreepm: number;
  oppFta: number;
  oppFtm: number;
  oppOrb: number;
  oppDrb: number;
  oppTrb: number;
  oppAst: number;
  oppStl: number;
  oppBlk: number;
  oppTov: number;
  ptsThisQuarter?: number;
  ptsPerQuarter?: number[];
  players?: PlayerGameStats[];
}

export type Meta = {
  day: number;
  season: number;
};
