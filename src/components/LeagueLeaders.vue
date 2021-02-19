<template>
  <div class="column is-flex is-flex-direction-column">
    <div class="block" v-if="store.leadingScorers.length !== 0">
      <strong class="is-size-5">Leading Scorers</strong>
      <div v-for="player in store.leadingScorers" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ (player.stats.points / player.stats.gamesPlayed).toFixed(1) }}
        </p>
      </div>
    </div>
    <div class="block" v-if="store.leadingThreePoints[0].stats.threepa !== 0">
      <strong class="is-size-5">Leading Three Point Shooter</strong>
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
    <div class="block" v-if="store.leadingRebounders.length !== 0">
      <strong class="is-size-5">Leading Rebounders</strong>
      <div v-for="player in store.leadingRebounders" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ (player.stats.trb / player.stats.gamesPlayed).toFixed(1) }}
        </p>
      </div>
    </div>
    <div class="block" v-if="leadingPassers.length !== 0">
      <strong class="is-size-5">Leading Passers</strong>
      <div v-for="player in leadingPassers" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ (player.stats.ast / player.stats.gamesPlayed).toFixed(1) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  setup() {
    const store = useLeagueStore();
    const leadingPassers = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.ast / a.stats.gamesPlayed! >=
            b.stats.ast / b.stats.gamesPlayed!
            ? -1
            : 1;
        })
        .slice(0, 3);
    });

    return {
      store,
      leadingPassers,
    };
  },
});
</script>