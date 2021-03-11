<template>
  <router-link :to="{ name: 'Team', params: { teamId: player.teamId } }">
    {{ store.teams[player.teamId].city }} {{ store.teams[player.teamId].name }}
  </router-link>
  <h1>{{ player.first }} {{ player.last }}</h1>
  <h4>Two Point Shooting: {{ player.twoPercentage }}</h4>
  <h4>Two Rate: {{ player.twoRate }}</h4>
  <h4>Three Point Shooting: {{ player.threePercentage }}</h4>
  <h4>Three Rate: {{ player.threeRate }}</h4>
  <h4>Free Throw Shooting: {{ player.freePercentage }}</h4>
  <h4>Rebounding: {{ player.rebounding }}</h4>
  <h4>Passing: {{ player.passing }}</h4>
  <h4>Stealing: {{ player.stealing }}</h4>
  <h4>Blocking: {{ player.blocking }}</h4>
  <h4>
    Ball Handling: {{ player.ballHandling }}
    <span>
      ({{
        Math.round(
          (player.ballHandling / playerRatings[0].ballHandlingMax) * 100
        )
      }})
    </span>
  </h4>
  <h4>{{ player.offensiveAbility }}</h4>
  <h4>PER: {{ calculatePER() }}</h4>
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

    const calculatePER = () => {
      const FGM = player!.stats.fgm * 85.91;
      const Steals = player!.stats.stl * 53.897;
      const ThreePTM = player!.stats.threepm * 51.757;
      const FTM = player!.stats.ftm * 46.845;
      const Blocks = player!.stats.blk * 39.19;
      const OffensiveReb = player!.stats.orb * 39.19;
      const Assists = player!.stats.ast * 34.677;
      const DefensiveReb = player!.stats.drb * 14.707;
      const Foul = (player!.stats.min / 60) * 0.06472 * 17.174;
      const FTMiss = (player!.stats.fta - player!.stats.ftm) * 20.091;
      const FGMiss = (player!.stats.fga - player!.stats.fgm) * 39.19;
      const TO = player!.stats.tov * 53.897;
      const minutes = 1 / (player!.stats.min / 60);

      return (
        (FGM +
          Steals +
          ThreePTM +
          FTM +
          Blocks +
          OffensiveReb +
          Assists +
          DefensiveReb -
          Foul -
          FTMiss -
          FGMiss -
          TO) *
        minutes
      ).toFixed(1);
    };

    return {
      store,
      player,
      playerRatings,
      calculatePER,
    };
  },
});
</script>