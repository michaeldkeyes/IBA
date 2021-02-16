<template>
  <h2>{{ team.city }} {{ team.name }}</h2>
  <h3>{{ teamStats.wins }} - {{ teamStats.losses }}</h3>
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
      ovr:
      {{ player.position }}
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
    <span>
      trb: {{ (player.stats.trb / player.stats.gamesPlayed).toFixed(1) }}
    </span>
    <span>
      drb: {{ (player.stats.drb / player.stats.gamesPlayed).toFixed(1) }}
    </span>
    <span>
      orb: {{ (player.stats.orb / player.stats.gamesPlayed).toFixed(1) }}
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
    const team = store.teams.find(
      (team) => team.teamId === parseInt(props.teamId)
    );
    const teamStats = store.teamStats.find(
      (team) => team.teamId === parseInt(props.teamId)
    );

    const sortedPlayers = players.sort(function (a, b) {
      return a.stats.min > b.stats.min ? -1 : 1;
    });

    return {
      sortedPlayers,
      team,
      teamStats,
    };
  },
});
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
span {
  margin-bottom: 10px;
  margin-right: 10px;
}
li {
  list-style-type: none;
}
</style>