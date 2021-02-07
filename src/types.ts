export type Game = {
  gameId?: number;
  winner: { teamId: number; points: number };
  loser: { teamId: number; points: number };
  teams: TeamStats[];
  overtimes: number;
};

export type Player = {
  playerId?: number;
  teamId: number;
  first: string;
  last: string;
  twoPercentage: number;
  stats: StatBase & PlayerStats;
  gameStats?: StatBase & PlayerStats;
};

export type Schedule = {
  gameId?: number;
  day?: number;
  homeTeamId: number;
  awayTeamId: number;
};

export type StatBase = {
  points: number;
  fga: number;
  fgm: number;
};

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

export type TeamStats = {
  teamId?: number;
  points: number;
  fga: number;
  fgm: number;
  wins: number;
  losses: number;
  players?: PlayerGameStats[];
};

export type PlayerGameStats = {
  playerId: number;
  name: string;
  points: number;
  fga: number;
  fgm: number;
  min: number;
  attr: {
    twoPercentage: number;
  };
};
