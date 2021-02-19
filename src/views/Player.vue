<template>
  <router-link :to="{ name: 'Team', params: { teamId: player.teamId } }">
    {{ store.teams[player.teamId].city }} {{ store.teams[player.teamId].name }}
  </router-link>
  <h1>{{ player.first }} {{ player.last }}</h1>
  <h4>Scoring: {{ player.scoring }}</h4>
  <h4>Two Point Shooting: {{ player.twoPercentage }}</h4>
  <h4>Two Rate: {{ player.twoRate }}</h4>
  <h4>Three Point Shooting: {{ player.threePercentage }}</h4>
  <h4>Three Rate: {{ player.threeRate }}</h4>
  <h4>Free Throw Shooting: {{ player.freePercentage }}</h4>
  <h4>Free Throw Rate: {{ player.freeRate }}</h4>
  <h4>Offensive Rebounding: {{ player.offensiveRebounding }}</h4>
  <h4>Defensive Rebounding: {{ player.defensiveRebounding }}</h4>
  <h4>Passing: {{ player.passing }}</h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: {
    playerId: { type: String, required: true },
  },
  setup(props) {
    const store = useLeagueStore();
    const player = store.players.find(
      ({ playerId }) => playerId === parseInt(props.playerId)
    );

    return {
      store,
      player,
    };
  },
});
</script>