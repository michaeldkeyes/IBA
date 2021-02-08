<template>
  <div>
    <router-link
      :to="{ name: 'Schedule', params: { teamId: $route.params.teamId } }"
      >Schedule</router-link
    >
  </div>
  <li v-for="player in sortedPlayers" :key="player.playerId">
    <router-link
      :to="{ name: 'Player', params: { playerId: player.playerId } }"
    >
      <li>{{ player.first }} {{ player.last }}</li>
    </router-link>
    <span>
      ovr:
      {{ player.overall }}
    </span>
    <span>
      ppg: {{ (player.stats.points / player.stats.gamesPlayed).toFixed(1) }}
    </span>
    <span>
      fg%: {{ ((player.stats.fgm / player.stats.fga) * 100).toFixed(1) }}%
    </span>
    <span>
      min: {{ (player.stats.min / 60 / player.stats.gamesPlayed).toFixed(1) }}
    </span>
    <span
      >3p: {{ player.stats.threepm }}/{{ player.stats.threepa }}
      {{ ((player.stats.threepm / player.stats.threepa) * 100).toFixed(1) }}%
    </span>
    <span
      >ft: {{ player.stats.ftm }}/{{ player.stats.fta }}
      {{ ((player.stats.ftm / player.stats.fta) * 100).toFixed(1) }}%
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: { teamId: { type: String, required: true } },
  setup(props) {
    const store = useLeagueStore();
    const players = store.players.filter(
      (player) => player.teamId === parseInt(props.teamId)
    );

    const sortedPlayers = players.sort(function (a, b) {
      return a.overall > b.overall ? -1 : 1;
    });

    return {
      sortedPlayers,
    };
  },
});
</script>

<style scoped>
div {
  display: flex;
}
span {
  margin-bottom: 10px;
  margin-right: 10px;
}
li {
  list-style-type: none;
}
</style>