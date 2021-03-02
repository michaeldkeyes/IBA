<template>
  <button @click="createDb">Create League</button>
  <button @click="simGames(1)">Simulate Day</button>
  <button @click="simGames(7)">Simulate Week</button>
  <button @click="simGames(30)">Simulate Month</button>
  <button @click="simGames(163)">Simulate Season</button>
  <div class="is-flex is-flex-direction-column is-align-items-center mb-6">
    <h1 class="is-size-1">{{ store.meta.season }} Season</h1>
    <h2 class="is-size-4">Day {{ store.meta.day }}</h2>
  </div>

  <div class="is-flex is-flex-wrap-wrap columns" v-if="store.isReady">
    <ConferenceStandings conference="Western Conference" />
    <LeagueLeaders />
    <ConferenceStandings conference="Eastern Conference" />
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

import ConferenceStandings from "../components/ConferenceStandings.vue";
import LeagueLeaders from "../components/LeagueLeaders.vue";

export default defineComponent({
  components: {
    ConferenceStandings,
    LeagueLeaders,
  },
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
            .sort((a, b) => {
              return a.offensiveAbility > b.offensiveAbility ? -1 : 1;
            });
          const homeTeam = store.teamStats[game.homeTeamId];
          const awayPlayers = store.players
            .filter((player) => player.teamId === game.awayTeamId)
            .sort((a, b) => {
              return a.offensiveAbility > b.offensiveAbility ? -1 : 1;
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