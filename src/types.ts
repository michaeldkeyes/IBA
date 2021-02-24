export type Game = {
  gameId?: number;
  winner: { teamId: number; points: number };
  loser: { teamId: number; points: number };
  teams: TeamStats[];
  overtimes: number;
};

export interface Player {
  playerId?: number;
  position: string;
  overall: number;
  teamId: number;
  first: string;
  last: string;
  scoring: number;
  twoRate: number;
  threeRate: number;
  twoPercentage: number;
  threePercentage: number;
  freeRate: number;
  freePercentage: number;
  offensiveRebounding: number;
  defensiveRebounding: number;
  passing: number;
  stealing: number;
  blocking: number;
  stats: StatBase & PlayerStats;
  gameStats?: StatBase & PlayerStats;
}

export interface PlayerGameStats extends StatBase {
  playerId: number;
  name: string;
  min: number;
  pos: string;
  attr: {
    scoring: number;
    twoRate: number;
    twoPercentage: number;
    threeRate: number;
    threePercentage: number;
    freeRate: number;
    freePercentage: number;
    offensiveRebounding: number;
    defensiveRebounding: number;
    passing: number;
    stealing: number;
    blocking: number;
  };
}

export type Schedule = {
  gameId?: number;
  day?: number;
  homeTeamId: number;
  awayTeamId: number;
};

export interface StatBase {
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
}

export type PlayerStats = {
  gamesPlayed?: number;
  min: number;
};

export type Team = {
  teamId: number;
  name: string;
  conference: string;
  city: string;
  division: string;
};

export interface TeamStats extends StatBase {
  teamId?: number;
  wins: number;
  losses: number;
  players: PlayerGameStats[];
}

export type Meta = {
  day: number;
  season: number;
};
