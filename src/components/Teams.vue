<template>
  <div class="d-flex">
    <div>
      <h1>Western Conference</h1>
      <li v-for="team in westernConference" :key="team.teamId">
        <router-link :to="{ name: 'Roster', params: { teamId: team.teamId } }">
          {{ store.teams.find((team2) => team.teamId === team2.teamId).city }}
          {{ store.teams.find((team2) => team.teamId === team2.teamId).name }}
        </router-link>
        <span> {{ team.wins }} - {{ team.losses }} </span>
      </li>
    </div>
    <div>
      <h1>Eastern Conference</h1>
      <li v-for="team in easternConference" :key="team.teamId">
        <router-link :to="{ name: 'Roster', params: { teamId: team.teamId } }">
          {{ store.teams.find((team2) => team.teamId === team2.teamId).city }}
          {{ store.teams.find((team2) => team.teamId === team2.teamId).name }}
        </router-link>
        <span>{{ team.wins }} - {{ team.losses }} </span>
      </li>
    </div>
  </div>
</template>

<script>
import { useLeagueStore } from "../store/index";

export default {
  setup() {
    const store = useLeagueStore();
    const westernConference = store.teamStats
      .filter((team) => team.teamId < 16)
      .sort((a, b) => {
        return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
          ? -1
          : 1;
      });
    const easternConference = store.teamStats
      .filter((team) => team.teamId > 15)
      .sort((a, b) => {
        return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
          ? -1
          : 1;
      });

    return {
      store,
      westernConference,
      easternConference,
    };
  },
};
</script>

<style scoped>
li {
  list-style: none;
  margin-bottom: 5px;
}
.d-flex {
  display: flex;
  justify-content: space-evenly;
}
</style>