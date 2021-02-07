import { defineStore } from "pinia";
import { Game, Player, Schedule, Team, TeamStats } from "../types";

export const useLeagueStore = defineStore({
  id: "league",
  state: () => ({
    players: [] as Player[],
    schedule: [] as Schedule[],
    teams: [] as Team[],
    teamStats: [] as TeamStats[],
    games: [] as Game[],
    meta: {},
  }),
  getters: {},
  actions: {
    setPlayers(players: Player[]) {
      this.players = players;
    },
    setSchedule(schedule: Schedule[]) {
      this.schedule = schedule;
    },
    setTeams(teams: Team[]) {
      this.teams = teams;
      //console.table(this.teams);
    },
    setTeamStats(teams: TeamStats[]) {
      this.teamStats = teams;
    },
    setGames(games: Game[]) {
      this.games = games;
    },
    setMeta(day: number, season: number) {
      this.meta = {
        day,
        season,
      };
    },
  },
});
