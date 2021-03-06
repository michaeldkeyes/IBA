<template>
  <div class="is-size-1 columns">
    <div class="column is-flex is-flex-direction-column is-align-items-center">
      <router-link :to="{ name: 'Team', params: { teamId: homeTeam.teamId } }"
        >{{ homeTeam.city }} {{ homeTeam.name }}</router-link
      >
      <div>{{ game.teams[0].points }}</div>
    </div>
    <div class="column is-flex is-flex-direction-column is-align-items-center">
      <router-link :to="{ name: 'Team', params: { teamId: awayTeam.teamId } }"
        >{{ awayTeam.city }} {{ awayTeam.name }}</router-link
      >
      <div>{{ game.teams[1].points }}</div>
    </div>
  </div>

  <div class="is-flex is-justify-content-center mb-4">
    <table class="table is-bordered is-narrow">
      <thead>
        <tr>
          <th></th>
          <th v-for="index in game.teams[0].ptsPerQuarter.length">
            {{ index }}
          </th>
          <th>F</th>
          <th>eFG%</th>
          <th>TOV%</th>
          <th>ORB%</th>
          <th>FT/FGA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in game.teams" :key="team.teamId">
          <td>
            <router-link
              :to="{ name: 'Team', params: { teamId: team.teamId } }"
            >
              {{ team.abbrev }}
            </router-link>
          </td>
          <td v-for="(points, index) in team.ptsPerQuarter" :key="index">
            {{ points }}
          </td>
          <td>{{ team.points }}</td>
          <td>{{ ((team.fgm + 0.5 * team.threepm) / team.fga).toFixed(3) }}</td>
          <td>
            {{
              (
                (100 * team.tov) /
                (team.fga + 0.44 * team.fta + team.tov)
              ).toFixed(1)
            }}
          </td>
          <td>{{ (team.orb / (team.orb + team.oppDrb)).toFixed(3) }}</td>
          <td>{{ (team.ftm / team.fga).toFixed(3) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mb-4">
    <router-link
      class="is-size-4"
      :to="{ name: 'Team', params: { teamId: homeTeam.teamId } }"
      >{{ homeTeam.city }} {{ homeTeam.name }}</router-link
    >
    <PlayerGameStats :team="game.teams[0]" />
  </div>
  <div>
    <router-link
      class="is-size-4"
      :to="{ name: 'Team', params: { teamId: awayTeam.teamId } }"
      >{{ awayTeam.city }} {{ awayTeam.name }}</router-link
    >
    <PlayerGameStats :team="game.teams[1]" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

import PlayerGameStats from "../components/PlayerGameStats.vue";

export default defineComponent({
  props: {
    gameId: { type: String, required: true },
  },
  components: {
    PlayerGameStats,
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