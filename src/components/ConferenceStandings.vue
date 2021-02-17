<template>
  <div class="column is-flex is-flex-direction-column is-align-items-center">
    <h1 class="title">{{ conference }}</h1>
    <table class="table is-striped is-narrow is-bordered">
      <thead>
        <tr>
          <th>Team</th>
          <th><abbr title="Wins">W</abbr></th>
          <th><abbr title="Losses">L</abbr></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in conferenceStandings" :key="team.teamId">
          <td>
            <router-link
              :to="{ name: 'Team', params: { teamId: team.teamId } }"
            >
              {{
                store.teams.find((team2) => team.teamId === team2.teamId).city
              }}
              {{
                store.teams.find((team2) => team.teamId === team2.teamId).name
              }}
            </router-link>
          </td>
          <td>{{ team.wins }}</td>
          <td>{{ team.losses }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useLeagueStore } from "../store/index";

export default defineComponent({
  props: {
    conference: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useLeagueStore();
    const conferenceStandings = computed(() => {
      if (props.conference === "Western Conference") {
        return store.teamStats
          .filter((team) => team.teamId! < 16)
          .sort((a, b) => {
            return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
              ? -1
              : 1;
          });
      } else {
        return store.teamStats
          .filter((team) => team.teamId! > 15)
          .sort((a, b) => {
            return a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)
              ? -1
              : 1;
          });
      }
    });

    return {
      store,
      conferenceStandings,
    };
  },
});
</script>