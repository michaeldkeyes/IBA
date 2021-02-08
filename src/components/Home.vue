<template>
  <button @click="createDb">Create League</button>
  <button @click="simGames(1)">Simulate Day</button>
  <button @click="simGames(7)">Simulate Week</button>
  <button @click="simGames(30)">Simulate Month</button>
  <h1>{{ store.meta.season }} Season</h1>
  <h2>Day {{ store.meta.day }}</h2>
  <div class="d-flex" v-if="store.isReady">
    <div>
      <h1>Western Conference</h1>
      <li v-for="team in store.westernConference" :key="team.teamId">
        <router-link :to="{ name: 'Roster', params: { teamId: team.teamId } }">
          {{ store.teams.find((team2) => team.teamId === team2.teamId).city }}
          {{ store.teams.find((team2) => team.teamId === team2.teamId).name }}
        </router-link>
        <span> {{ team.wins }} - {{ team.losses }} </span>
      </li>
    </div>
    <div v-if="store.leadingScorer !== undefined">
      <h4>Leading Scorers</h4>
      <div v-for="player in store.leadingScorer" :key="player.playerId">
        <h5>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ (player.stats.points / player.stats.gamesPlayed).toFixed(1) }}
        </h5>
      </div>
    </div>
    <div v-if="store.leadingThreePoints !== undefined">
      <h4>Leading Three Point Shooter</h4>
      <div v-for="player in store.leadingThreePoints" :key="player.playerId">
        <h5>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.threepm }}
          {{
            ((player.stats.threepm / player.stats.threepa) * 100).toFixed(1)
          }}%
        </h5>
      </div>
    </div>
    <div>
      <h1>Eastern Conference</h1>
      <li v-for="team in store.easternConference" :key="team.teamId">
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
            .sort(function (a, b) {
              return a.overall > b.overall ? -1 : 1;
            });
          const homeTeam = store.teamStats[game.homeTeamId];
          const awayPlayers = store.players
            .filter((player) => player.teamId === game.awayTeamId)
            .sort(function (a, b) {
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
          await db.games.bulkAdd(gameResults, gameKeys);
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
          // prettier-ignore
          await db.games.toArray().then((games) => store.setGames(games));
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
      // westernConference: computed(() => store.westernConference),
      // easternConference: computed(() => store.easternConference),
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