<template>
  <div class="d-flex">
    <div>
      <h4 v-for="game in schedule" :key="game.gameId">
        {{ store.teams[game.homeTeamId].city }} at
        {{ store.teams[game.awayTeamId].city }}
        on day {{ game.day }}
      </h4>
    </div>
    <div>
      <router-link
        :to="{ name: 'Game', params: { gameId: game.gameId } }"
        v-for="game in gamesPlayed"
      >
        {{
          game.teams[0].teamId === game.winner.teamId
            ? game.winner.points
            : game.loser.points
        }}
        -
        {{
          game.teams[1].teamId === game.winner.teamId
            ? game.winner.points
            : game.loser.points
        }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: { teamId: { type: String, required: true } },
  setup(props) {
    const store = useLeagueStore();
    const schedule: any = store.schedule.filter(
      (game) =>
        game.homeTeamId === parseInt(props.teamId) ||
        game.awayTeamId === parseInt(props.teamId)
    );
    const gamesPlayed = store.games.filter(
      (game) =>
        game.winner.teamId === parseInt(props.teamId) ||
        game.loser.teamId === parseInt(props.teamId)
    );

    return {
      store,
      schedule,
      gamesPlayed,
    };
  },
});
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: center;
}
a {
  display: block;
  margin: 21.5px 0;
}
</style>