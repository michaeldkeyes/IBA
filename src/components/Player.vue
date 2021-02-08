<template>
  <router-link :to="{ name: 'Roster', params: { teamId: player.teamId } }">
    {{ store.teams[player.teamId].city }} {{ store.teams[player.teamId].name }}
  </router-link>
  <h1>{{ player.first }} {{ player.last }}</h1>
  <h4>Scoring: {{ player.scoring }}</h4>
  <h4>Two Point Shooting: {{ player.twoPercentage }}</h4>
  <h4>Two Tendency: {{ player.twoTendency }}</h4>
  <h4>Three Point Shooting: {{ player.threePercentage }}</h4>
  <h4>Three Tendency: {{ player.threeTendency }}</h4>
  <h4>Free Throw Shooting: {{ player.freePercentage }}</h4>
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