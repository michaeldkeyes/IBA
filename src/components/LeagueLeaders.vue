<template>
  <div class="column is-flex is-flex-direction-column">
    <div class="block" v-if="store.meta.day > 1">
      <strong class="is-size-5">Leading Scorers</strong>
      <div v-for="player in leadingScorers" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.points }}
          ({{ (player.stats.points / player.stats.gamesPlayed).toFixed(1) }})
        </p>
      </div>
    </div>
    <div class="block" v-if="leadingThreePoints.length !== 0">
      <strong class="is-size-5">Leading Three Point Shooters</strong>
      <div v-for="player in leadingThreePoints" :key="player.playerId">
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
    <div class="block" v-if="reboundsLeaders.length !== 0">
      <strong class="is-size-5">Rebounding Leaders</strong>
      <div v-for="player in reboundsLeaders" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.trb }}
          ({{ (player.stats.trb / player.stats.gamesPlayed).toFixed(1) }})
        </p>
      </div>
    </div>
    <div class="block" v-if="leadingPassers.length !== 0">
      <strong class="is-size-5">Leading Passers</strong>
      <div v-for="player in leadingPassers" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.ast }}
          ({{ (player.stats.ast / player.stats.gamesPlayed).toFixed(1) }})
        </p>
      </div>
    </div>
    <div class="block" v-if="stealsLeaders.length !== 0">
      <strong class="is-size-5">Steals Leaders</strong>
      <div v-for="player in stealsLeaders" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.stl }}
          ({{ (player.stats.stl / player.stats.gamesPlayed).toFixed(1) }})
        </p>
      </div>
    </div>
    <div class="block" v-if="blocksLeaders.length !== 0">
      <strong class="is-size-5">Blocks Leaders</strong>
      <div v-for="player in blocksLeaders" :key="player.playerId">
        <p>
          {{ store.teams.find((team) => team.teamId === player.teamId).city }}
          {{ player.first + " " + player.last }}
          {{ player.stats.blk }}
          ({{ (player.stats.blk / player.stats.gamesPlayed).toFixed(1) }})
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

    const leadingScorers = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.points >= b.stats.points ? -1 : 1;
        })
        .slice(0, 3);
    });

    const leadingThreePoints = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.threepm >= b.stats.threepm ? -1 : 1;
        })
        .slice(0, 3);
    });

    const reboundsLeaders = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.trb >= b.stats.trb ? -1 : 1;
        })
        .slice(0, 3);
    });

    const leadingPassers = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.ast >= b.stats.ast ? -1 : 1;
        })
        .slice(0, 3);
    });
    const stealsLeaders = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.stl > b.stats.stl ? -1 : 1;
        })
        .slice(0, 3);
    });
    const blocksLeaders = computed(() => {
      return store.players
        .filter((player) => player.stats.gamesPlayed! > 0)
        .sort((a, b) => {
          return a.stats.blk >= b.stats.blk ? -1 : 1;
        })
        .slice(0, 3);
    });

    return {
      store,
      leadingScorers,
      leadingThreePoints,
      reboundsLeaders,
      leadingPassers,
      stealsLeaders,
      blocksLeaders,
    };
  },
});
</script>
