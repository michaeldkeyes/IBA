import Dexie from "dexie";
import { Game, Player, Schedule, TeamStats } from "./types";

class League extends Dexie {
  players: Dexie.Table<Player, number>;
  teamStats: Dexie.Table<TeamStats, number>;
  schedule: Dexie.Table<Schedule, number>;
  games: Dexie.Table<Game, number>;
  meta: Dexie.Table<{ day: number; season: number; id: number }, number>;

  constructor() {
    super("League");

    this.version(1).stores({
      players: "++playerId, teamId",
      teamStats: "++teamId",
      schedule: "++gameId",
      games: "",
      meta: "id",
    });

    this.players = this.table("players");
    this.teamStats = this.table("teamStats");
    this.schedule = this.table("schedule");
    this.games = this.table("games");
    this.meta = this.table("meta");
  }
}

export const db: League = new League();
