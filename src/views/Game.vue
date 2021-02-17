<template>
  <div class="d-flex center">
    <router-link
      :to="{ name: 'Roster', params: { teamId: homeTeam.teamId } }"
      class="team-link"
      >{{ homeTeam.city }} {{ homeTeam.name }}</router-link
    >
    <h1>&nbsp;-&nbsp;</h1>
    <router-link
      :to="{ name: 'Roster', params: { teamId: awayTeam.teamId } }"
      class="team-link"
      >{{ awayTeam.city }} {{ awayTeam.name }}</router-link
    >
  </div>
  <div class="d-flex center">
    <h1>{{ game.teams[0].points }}</h1>
    <h1>&nbsp;-&nbsp;</h1>
    <h1>{{ game.teams[1].points }}</h1>
  </div>
  <div class="d-flex around">
    <div class="d-flex">
      <h3>{{ game.teams[0].fgm }} / {{ game.teams[0].fga }} &nbsp;</h3>
      <h3>
        &nbsp;{{ ((game.teams[0].fgm / game.teams[0].fga) * 100).toFixed(1) }}%
      </h3>
    </div>
    <div class="d-flex">
      <h3>{{ game.teams[1].fgm }} / {{ game.teams[1].fga }} &nbsp;</h3>
      <h3>
        &nbsp;{{ ((game.teams[1].fgm / game.teams[1].fga) * 100).toFixed(1) }}%
      </h3>
    </div>
  </div>
  <div class="d-flex around">
    <div class="d-flex">
      <h3>{{ game.teams[0].threepm }} / {{ game.teams[0].threepa }} &nbsp;</h3>
      <h3>
        &nbsp;{{
          ((game.teams[0].threepm / game.teams[0].threepa) * 100).toFixed(1)
        }}%
      </h3>
    </div>
    <div class="d-flex">
      <h3>{{ game.teams[1].threepm }} / {{ game.teams[1].threepa }} &nbsp;</h3>
      <h3>
        &nbsp;{{
          ((game.teams[1].threepm / game.teams[1].threepa) * 100).toFixed(1)
        }}%
      </h3>
    </div>
  </div>
  <div class="d-flex around">
    <div class="d-flex">
      <h3>{{ game.teams[0].ftm }} / {{ game.teams[0].fta }} &nbsp;</h3>
      <h3>
        &nbsp;{{ ((game.teams[0].ftm / game.teams[0].fta) * 100).toFixed(1) }}%
      </h3>
    </div>

    <div class="d-flex">
      <h3>{{ game.teams[1].ftm }} / {{ game.teams[1].fta }} &nbsp;</h3>
      <h3>
        &nbsp;{{ ((game.teams[1].ftm / game.teams[1].fta) * 100).toFixed(1) }}%
      </h3>
    </div>
  </div>
  <div class="d-flex around">
    <div class="d-flex">
      <h3>{{ game.teams[0].trb }} &nbsp;</h3>
      <h3>&nbsp; {{ game.teams[0].orb }}</h3>
    </div>

    <div class="d-flex">
      <h3>{{ game.teams[1].trb }} &nbsp;</h3>
      <h3>&nbsp; {{ game.teams[1].orb }}</h3>
    </div>
  </div>
  <div class="d-flex around">
    <div>
      <h5
        v-for="player in game.teams[0].players"
        :key="player.playerId"
        class="flex"
      >
        <router-link
          :to="{ name: 'Player', params: { playerId: player.playerId } }"
          class="player-link"
          >{{ player.name }}</router-link
        >
        <h4>{{ player.points }} pts {{ (player.min / 60).toFixed(1) }} min</h4>
      </h5>
    </div>
    <div>
      <h5 v-for="player in game.teams[1].players" :key="player.playerId">
        <router-link
          :to="{ name: 'Player', params: { playerId: player.playerId } }"
          class="player-link"
          >{{ player.name }}</router-link
        >
        <h4>{{ player.points }} pts {{ (player.min / 60).toFixed(1) }} min</h4>
      </h5>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: {
    gameId: { type: String, required: true },
  },
  setup(props) {
    const store = useLeagueStore();
    const game = store.games.find(
      (game) => game.gameId === parseInt(props.gameId)
    );
    const homeTeam = store.teams.find(
      (team) => team.teamId === game!.teams[0].teamId
    );
    const awayTeam = store.teams.find(
      (team) => team.teamId === game?.teams[1].teamId
    );

    return {
      game,
      homeTeam,
      awayTeam,
    };
  },
});
</script>

<style scoped>
.d-flex {
  display: flex;
}
.center {
  justify-content: center;
}
.around {
  justify-content: space-around;
}
h5 {
  margin: 10px 0;
}
.team-link {
  font-size: 32px;
  text-decoration: none;
  margin: 20px 0;
}
.player-link {
  font-size: 14px;
  text-decoration: none;
}
</style>