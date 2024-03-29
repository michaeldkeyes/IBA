<template>
  <router-link :to="{ name: 'Team', params: { teamId: player.teamId } }">
    {{ store.teams[player.teamId].city }} {{ store.teams[player.teamId].name }}
  </router-link>
  <h1>{{ player.first }} {{ player.last }}</h1>
  <h4>Two Point Shooting: {{ player.attr.twoPercentage }}</h4>
  <h4>Two Rate: {{ player.attr.twoRate }}</h4>
  <h4>Three Point Shooting: {{ player.attr.threePercentage }}</h4>
  <h4>Three Rate: {{ player.attr.threeRate }}</h4>
  <h4>Free Throw Shooting: {{ player.attr.freePercentage }}</h4>
  <h4>Rebounding: {{ player.attr.rebounding }}</h4>
  <h4>Passing: {{ player.attr.passing }}</h4>
  <h4>Stealing: {{ player.attr.stealing }}</h4>
  <h4>Blocking: {{ player.attr.blocking }}</h4>
  <h4>
    Ball Handling: {{ player.attr.ballHandling }}
    <span>
      ({{
        Math.round(
          (player.attr.ballHandling / playerRatings[0].ballHandlingMax) * 100
        )
      }})
    </span>
  </h4>
  <h4>Offensive Ability: {{ player.attr.offensiveAbility }}</h4>
  <h4>PER: {{ calculatePER() }}</h4>
  <h4>{{ magicMetric() }}</h4>
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

    const magicMetric = () => {
      return Math.round(
        2.45 * player!.stats.fgm +
          1.2 * player!.stats.threepm +
          0.65 * player!.stats.trb +
          0.9 * player!.stats.ast +
          player!.stats.stl +
          1.4 * player!.stats.ftm +
          0.8 * player!.stats.blk -
          0.65 * player!.stats.fga -
          0.5 * player!.stats.fta -
          player!.stats.tov
      );
    };

    return {
      store,
      player,
      playerRatings,
      calculatePER,
      magicMetric,
    };
  },
});
</script>
