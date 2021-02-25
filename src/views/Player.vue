<template>
  <router-link :to="{ name: 'Team', params: { teamId: player.teamId } }">
    {{ store.teams[player.teamId].city }} {{ store.teams[player.teamId].name }}
  </router-link>
  <h1>{{ player.first }} {{ player.last }}</h1>
  <h4>
    Scoring: {{ player.scoring }}
    <span
      >({{
        Math.round((player.scoring / playerRatings[1].scoringMax) * 100)
      }})</span
    >
  </h4>
  <h4>
    Two Point Shooting: {{ player.twoPercentage }}
    <span
      >({{
        Math.round(
          (player.twoPercentage / playerRatings[4].twoPercentageMax) * 100
        )
      }})</span
    >
  </h4>
  <h4>Two Rate: {{ player.twoRate }}</h4>
  <h4>
    Three Point Shooting: {{ player.threePercentage }}
    <span
      >({{
        Math.round(
          (player.threePercentage / playerRatings[1].threePercentageMax) * 100
        )
      }})</span
    >
  </h4>
  <h4>Three Rate: {{ player.threeRate }}</h4>
  <h4>
    Free Throw Shooting: {{ player.freePercentage }}
    <span>({{ Math.round((player.freePercentage / 925) * 100) }})</span>
  </h4>
  <h4>Free Throw Rate: {{ player.freeRate }}</h4>
  <h4>
    Offensive Rebounding: {{ player.offensiveRebounding }}
    <span
      >({{
        Math.round(
          (player.offensiveRebounding /
            playerRatings[3].offensiveReboundingMax) *
            100
        )
      }})</span
    >
  </h4>
  <h4>
    Defensive Rebounding: {{ player.defensiveRebounding }}
    <span
      >({{
        Math.round(
          (player.defensiveRebounding /
            playerRatings[3].defensiveReboundingMax) *
            100
        )
      }})</span
    >
  </h4>
  <h4>
    Passing: {{ player.passing }}
    <span
      >({{
        Math.round((player.passing / playerRatings[0].passingMax) * 100)
      }})</span
    >
  </h4>
  <h4>
    Stealing: {{ player.stealing }}
    <span
      >({{
        Math.round((player.stealing / playerRatings[0].stealMax) * 100)
      }})</span
    >
  </h4>
  <h4>
    Blocking: {{ player.blocking }}
    <span
      >({{
        Math.round((player.blocking / playerRatings[4].blockMax) * 100)
      }})</span
    >
  </h4>
  <h4>{{ player.offensiveAbility }}</h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

import playerRatings from "../data/playerRatings";

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
      playerRatings,
    };
  },
});
</script>