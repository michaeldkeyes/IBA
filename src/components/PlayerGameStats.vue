<template>
  <table
    class="table is-fullwidth is-bordered is-striped is-narrow is-hoverable"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Pos</th>
        <th>MP</th>
        <th>FGM</th>
        <th>FGA</th>
        <th>3PM</th>
        <th>3PA</th>
        <th>FTM</th>
        <th>FTA</th>
        <th>ORB</th>
        <th>TRB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th>TOV</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <th>Totals</th>
        <th></th>
        <th>240</th>
        <th>{{ team.fgm }}</th>
        <th>{{ team.fga }}</th>
        <th>{{ team.threepm }}</th>
        <th>{{ team.threepa }}</th>
        <th>{{ team.ftm }}</th>
        <th>{{ team.fta }}</th>
        <th>{{ team.orb }}</th>
        <th>{{ team.trb }}</th>
        <th>{{ team.ast }}</th>
        <th>{{ team.stl }}</th>
        <th>{{ team.blk }}</th>
        <th>{{ team.tov }}</th>
        <th>{{ team.points }}</th>
      </tr>
      <tr>
        <th>Percentages</th>
        <th></th>
        <th></th>
        <th></th>
        <th>{{ (team.fgm / team.fga).toFixed(3) }}</th>
        <th></th>
        <th>{{ (team.threepm / team.threepa).toFixed(3) }}</th>
        <th></th>
        <th>{{ (team.ftm / team.fta).toFixed(3) }}</th>
      </tr>
    </tfoot>
    <tbody>
      <tr v-for="player in team.players">
        <td>
          <router-link
            :to="{ name: 'Player', params: { playerId: player.playerId } }"
          >
            {{ player.name }}
          </router-link>
        </td>
        <td>{{ player.pos }}</td>
        <td>{{ (player.min / 60).toFixed(1) }}</td>
        <td>{{ player.fgm }}</td>
        <td>{{ player.fga }}</td>
        <td>{{ player.threepm }}</td>
        <td>{{ player.threepa }}</td>
        <td>{{ player.ftm }}</td>
        <td>{{ player.fta }}</td>
        <td>{{ player.orb }}</td>
        <td>{{ player.trb }}</td>
        <td>{{ player.ast }}</td>
        <td>{{ player.stl }}</td>
        <td>{{ player.blk }}</td>
        <td>{{ player.tov }}</td>
        <td>{{ player.points }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TeamStats } from "../types";

export default defineComponent({
  props: {
    team: {
      type: Object as PropType<TeamStats>,
      required: true,
    },
  },
  setup(props) {
    props.team.players.sort((a, b) => {
      return a.min >= b.min ? -1 : 1;
    });

    return {};
  },
});
</script>