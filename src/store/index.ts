import { defineStore } from "pinia";
import { Game, Meta, Player, Schedule, Team, TeamStats } from "../types";

export const useLeagueStore = defineStore({
  id: "league",
  state: () => ({
    players: [] as Player[],
    schedule: [] as Schedule[],
    teams: [] as Team[],
    teamStats: [] as TeamStats[],
    games: [] as Game[],
    meta: {} as Meta,
    isReady: false,
  }),
  getters: {
    westernConference() {
      return this.teamStats
        .filter((team) => team.teamId! < 16)
        .sort((a, b) => {
          return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
            ? -1
            : 1;
        });
    },
    easternConference() {
      return this.teamStats
        .filter((team) => team.teamId! > 15)
        .sort((a, b) => {
          return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
            ? -1
            : 1;
        });
    },
  },
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
    increaseDay() {
      this.meta.day++;
    },
    increaseSeason() {
      this.meta.season++;
    },
    toggleIsReady() {
      this.isReady = !this.isReady;
    },
  },
});
