<template>
  <div class="container">
    <button @click="createDb">Create League</button>
    <button @click="simGames(1)">Simulate Day</button>
    <button @click="simGames(7)">Simulate Week</button>
    <button @click="simGames(30)">Simulate Month</button>
    <button @click="simGames(163)">Simulate Season</button>
    <button @click="clearDb">Clear Db</button>
    <div>
      <router-link :to="{ name: 'Home' }">Home</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { db } from "./api/Database";
import teams from "./data/teams";
import generatePlayers from "./generators/generatePlayers";
import generateSchedule from "./generators/generateSchedule";
import generateTeamStats from "./generators/generateTeamStats";
import simulate from "./simulate";
import { Game, Player, TeamStats } from "./types";
import { defineComponent } from "vue";
import { useLeagueStore } from "./store/index";

export default defineComponent({
  name: "App",
  setup() {
    const store = useLeagueStore();

    const createDb = async () => {
      try {
        console.log("Generating league...");
        await db.players.bulkAdd(generatePlayers());
        await db.schedule.bulkAdd(generateSchedule());
        await db.teamStats.bulkAdd(generateTeamStats());
        await db.meta.add({ day: 1, season: 2022, id: 1 });
        await db.players.toArray().then((players) => store.setPlayers(players));
        await db.schedule
          .toArray()
          .then((schedule) => store.setSchedule(schedule));
        await db.teamStats.toArray().then((teams) => store.setTeamStats(teams));
        await db.meta
          .toArray()
          .then((meta) => store.setMeta(meta[0].day, meta[0].season));
        store.setTeams(teams);
        store.toggleIsReady();
        console.log("Done!");
      } catch (error) {
        console.error(error);
      }
    };

    const simGames = async (numDays: number) => {
      while (numDays > 0) {
        const gamesToSim = store.schedule.filter(
          (game) => game.day === store.meta.day
        );
        const keysToDelete: number[] = gamesToSim.map((game) => {
          return game.gameId!;
        });
        const gameKeys: number[] = gamesToSim.map((game) => game.gameId!);
        let gameResults: Game[] = [];
        let players: Player[] = [];
        let teams: TeamStats[] = [];

        gamesToSim.map((game) => {
          const homePlayers = store.players
            .filter((player) => player.teamId === game.homeTeamId)
            .sort((a, b) => {
              return a.overall > b.overall ? -1 : 1;
            });
          const homeTeam = store.teamStats[game.homeTeamId];
          const awayPlayers = store.players
            .filter((player) => player.teamId === game.awayTeamId)
            .sort((a, b) => {
              return a.overall > b.overall ? -1 : 1;
            });
          const awayTeam = store.teamStats[game.awayTeamId];

          const gameResult = simulate(
            homePlayers,
            homeTeam,
            awayPlayers,
            awayTeam
          );
          gameResult.gameId = game.gameId;

          gameResults = [...gameResults, gameResult];
          players = players.concat(homePlayers).concat(awayPlayers);
          teams = teams.concat(homeTeam).concat(awayTeam);
        });
        try {
          console.log("Saving game results to database...");
          store.increaseDay();
          await db.games.bulkAdd(
            JSON.parse(JSON.stringify(gameResults)),
            gameKeys
          );
          await db.players.bulkPut(JSON.parse(JSON.stringify(players)));
          await db.teamStats.bulkPut(JSON.parse(JSON.stringify(teams)));
          await db.schedule.bulkDelete(keysToDelete);
          await db.meta.update(1, { day: store.meta.day });
          await db.players
            .toArray()
            .then((players) => store.setPlayers(players));
          await db.teamStats
            .toArray()
            .then((teams) => store.setTeamStats(teams));
          await db.games.toArray().then((games) => store.setGames(games));
          console.log("Saved!");
          numDays--;
        } catch (error) {
          console.error(error);
        }
      }
    };

    const clearDb = async () => {
      try {
        console.log("Clearing database...");
        await db.games.clear();
        await db.players.clear();
        await db.schedule.clear();
        await db.teamStats.clear();
        await db.meta.clear();
        console.log("All clear");
        location.reload();
      } catch (error) {
        console.error(error);
      }
    };

    return {
      clearDb,
      createDb,
      simGames,
    };
  },
});
</script>

<style>
#nav {
  margin-bottom: 10px;
}

a {
  margin-right: 10px;
}
</style>
