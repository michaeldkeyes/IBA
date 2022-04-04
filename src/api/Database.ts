import Dexie from "dexie";
import { Game, Player, Schedule, TeamStats } from "../types";

class League extends Dexie {
  players: Dexie.Table<Player>;
  teamStats: Dexie.Table<TeamStats>;
  schedule: Dexie.Table<Schedule>;
  games: Dexie.Table<Game>;
  //meta: Dexie.Table<{ day: number; season: number; id: number }, number>;

  constructor(name: string) {
    super(name);

    this.version(1).stores({
      players: "++playerId, teamId",
      teamStats: "++teamId",
      schedule: "++gameId",
      games: "",
      //meta: "id",
    });

    this.players = this.table("players");
    this.teamStats = this.table("teamStats");
    this.schedule = this.table("schedule");
    this.games = this.table("games");
    //this.meta = this.table("meta");
  }
}

//export const league: League = new League();
export default League;
