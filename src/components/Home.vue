<template>
  <button @click="createDb">Create League</button>
  <button @click="simGames(1)">Simulate Day</button>
  <button @click="simGames(7)">Simulate Week</button>
  <button @click="simGames(30)">Simulate Month</button>
  <h1>{{ store.meta.season }} Season</h1>
  <h2>Day {{ store.meta.day }}</h2>
  <div class="d-flex">
    <div>
      <h1>Western Conference</h1>
      <li v-for="team in westernConference" :key="team.teamId">
        <router-link :to="{ name: 'Roster', params: { teamId: team.teamId } }">
          {{ store.teams.find((team2) => team.teamId === team2.teamId).city }}
          {{ store.teams.find((team2) => team.teamId === team2.teamId).name }}
        </router-link>
        <span> {{ team.wins }} - {{ team.losses }} </span>
      </li>
    </div>
    <div>
      <h1>Eastern Conference</h1>
      <li v-for="team in easternConference" :key="team.teamId">
        <router-link :to="{ name: 'Roster', params: { teamId: team.teamId } }">
          {{ store.teams.find((team2) => team.teamId === team2.teamId).city }}
          {{ store.teams.find((team2) => team.teamId === team2.teamId).name }}
        </router-link>
        <span>{{ team.wins }} - {{ team.losses }} </span>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { db } from "../Database";
import { Game, Player, TeamStats } from "../types";

import { useLeagueStore } from "../store/index";

import teams from "../data/teams";
import generatePlayers from "../generators/generatePlayers";
import generateSchedule from "../generators/generateSchedule";
import generateTeamStats from "../generators/generateTeamStats";
import simulate from "../simulate";

export default defineComponent({
  setup() {
    const store = useLeagueStore();
    const westernConference = store.teamStats
      .filter((team) => team.teamId! < 16)
      .sort((a, b) => {
        return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
          ? -1
          : 1;
      });
    const easternConference = store.teamStats
      .filter((team) => team.teamId! > 15)
      .sort((a, b) => {
        return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
          ? -1
          : 1;
      });

    const createDb = async () => {
      try {
        console.log("Generating league...");
        await db.players.bulkAdd(generatePlayers());
        await db.schedule.bulkAdd(generateSchedule());
        await db.teamStats.bulkAdd(generateTeamStats());
        await db.meta.add({ day: 1, season: 2021, id: 1 });
        await db.players.toArray().then((players) => store.setPlayers(players));
        await db.schedule
          .toArray()
          .then((schedule) => store.setSchedule(schedule));
        await db.teamStats.toArray().then((teams) => store.setTeamStats(teams));
        await db.meta
          .toArray()
          .then((meta) => store.setMeta(meta[0].day, meta[0].season));
        store.setTeams(teams);
        console.log("Done!");
      } catch (error) {
        console.error(error);
      }
    };

    const simGames = async (numDays: number) => {
      while (numDays > 0) {
        const dayToSim = await db.meta.toArray();
        const gamesToSim = store.schedule.filter(
          (game) => game.day === dayToSim![0].day
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
            .sort(function (a, b) {
              return a.twoPercentage > b.twoPercentage ? -1 : 1;
            });
          const homeTeam = store.teamStats[game.homeTeamId];
          const awayPlayers = store.players
            .filter((player) => player.teamId === game.awayTeamId)
            .sort(function (a, b) {
              return a.twoPercentage > b.twoPercentage ? -1 : 1;
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
          dayToSim[0].day++;
          await db.games.bulkAdd(gameResults, gameKeys);
          await db.players.bulkPut(JSON.parse(JSON.stringify(players)));
          await db.teamStats.bulkPut(JSON.parse(JSON.stringify(teams)));
          await db.schedule.bulkDelete(keysToDelete);
          await db.meta.put(dayToSim[0]);
          await db.players
            .toArray()
            .then((players) => store.setPlayers(players));
          await db.teamStats
            .toArray()
            .then((teams) => store.setTeamStats(teams));
          // prettier-ignore
          await db.games.toArray().then((games) => store.setGames(games));
          await db.meta
            .toArray()
            .then((meta) => store.setMeta(meta[0].day, meta[0].season));
          console.log("Saved!");
          numDays--;
        } catch (error) {
          console.error(error);
        }
      }
    };

    return {
      store,
      createDb,
      simGames,
      westernConference,
      easternConference,
    };
  },
});
</script>

<style scoped>
button {
  margin-right: 10px;
}
li {
  list-style: none;
  margin-bottom: 5px;
}
.d-flex {
  display: flex;
  justify-content: space-evenly;
}
</style>