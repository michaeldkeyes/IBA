<template>
  <div class="is-size-1 columns">
    <div class="column is-flex is-flex-direction-column is-align-items-center">
      <router-link :to="{ name: 'Team', params: { teamId: homeTeam.teamId } }"
        >{{ homeTeam.city }} {{ homeTeam.name }}</router-link
      >
      <div>{{ game.teams[0].points }}</div>
    </div>
    <div class="column is-flex is-flex-direction-column is-align-items-center">
      <router-link :to="{ name: 'Team', params: { teamId: awayTeam.teamId } }"
        >{{ awayTeam.city }} {{ awayTeam.name }}</router-link
      >
      <div>{{ game.teams[1].points }}</div>
    </div>
  </div>
  <div class="mb-6">
    <router-link
      class="is-size-4"
      :to="{ name: 'Team', params: { teamId: homeTeam.teamId } }"
      >{{ homeTeam.city }} {{ homeTeam.name }}</router-link
    >
    <PlayerGameStats :team="game.teams[0]" />
  </div>
  <div>
    <router-link
      class="is-size-4"
      :to="{ name: 'Team', params: { teamId: awayTeam.teamId } }"
      >{{ awayTeam.city }} {{ awayTeam.name }}</router-link
    >
    <PlayerGameStats :team="game.teams[1]" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

import PlayerGameStats from "../components/PlayerGameStats.vue";

export default defineComponent({
  props: {
    gameId: { type: String, required: true },
  },
  components: {
    PlayerGameStats,
  },
  setup(props) {
    const store = useLeagueStore();
    const game = store.games.find(
      (game) => game.gameId === parseInt(props.gameId)
    );
    const homeTeam = store.teams.find(
      (team) => team.teamId === game!.teams[0].teamId
    );
    const awayTeam = store.teams.find(
      (team) => team.teamId === game?.teams[1].teamId
    );

    return {
      game,
      homeTeam,
      awayTeam,
    };
  },
});
</script>