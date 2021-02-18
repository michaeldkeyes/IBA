<template>
  <div class="is-flex is-flex-direction-column is-align-items-center">
    <div class="mb-3">
      <div class="is-size-1 has-text-centered">Schedule</div>
      <div class="is-size-3">{{ team.city }} {{ team.name }}</div>
    </div>

    <div class="is-flex is-flex-direction-column scorebox">
      <div
        class="is-flex is-align-items-center mb-4"
        v-for="(game, index) in schedule"
        :key="game.gameId"
      >
        <div class="is-flex-grow-1">
          <div class="has-border">
            <div
              class="is-flex is-align-items-center"
              :class="[
                gamesPlayed[index] !== undefined &&
                gamesPlayed[index].winner.teamId ===
                  gamesPlayed[index].teams[0].teamId
                  ? color(gamesPlayed[index].winner.teamId)
                  : '',
              ]"
            >
              <div class="is-flex-grow-1 p-1">
                {{ store.teams[game.homeTeamId].city }}
                {{ store.teams[game.homeTeamId].name }}
              </div>
              <div class="p-1" v-if="gamesPlayed[index] !== undefined">
                <router-link
                  :to="{ name: 'Game', params: { gameId: game.gameId } }"
                >
                  {{ gamesPlayed[index].teams[0].points }}
                </router-link>
              </div>
            </div>
            <div
              class="is-flex is-align-items-center"
              :class="[
                gamesPlayed[index] !== undefined &&
                gamesPlayed[index].winner.teamId ===
                  gamesPlayed[index].teams[1].teamId
                  ? color(gamesPlayed[index].winner.teamId)
                  : '',
              ]"
            >
              <div class="is-flex-grow-1 p-1">
                {{ store.teams[game.awayTeamId].city }}
                {{ store.teams[game.awayTeamId].name }}
              </div>
              <div class="p-1" v-if="gamesPlayed[index] !== undefined">
                <router-link
                  :to="{ name: 'Game', params: { gameId: game.gameId } }"
                >
                  {{ gamesPlayed[index].teams[1].points }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div>
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
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: { teamId: { type: String, required: true } },
  setup(props) {
    const store = useLeagueStore();
    const schedule = store.schedule.filter(
      (game) =>
        game.homeTeamId === parseInt(props.teamId) ||
        game.awayTeamId === parseInt(props.teamId)
    );
    const gamesPlayed = store.games.filter(
      (game) =>
        game.winner.teamId === parseInt(props.teamId) ||
        game.loser.teamId === parseInt(props.teamId)
    );
    const team = store.teams.find(
      (team) => team.teamId === parseInt(props.teamId)
    );

    const color = (winnerTeamId: number) => {
      if (winnerTeamId === parseInt(props.teamId)) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    };

    return {
      store,
      schedule,
      gamesPlayed,
      team,
      color,
    };
  },
});
</script>

<style scoped>
.has-border {
  border: 1px solid #e67e22;
}

.scorebox {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}
</style>