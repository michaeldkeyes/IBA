<template>
  <div class="is-flex is-flex-direction-column is-align-items-center mb-5">
    <h1 class="is-size-1">{{ team.city }} {{ team.name }}</h1>
    <h3 class="is-size-3">{{ teamStats.wins }} - {{ teamStats.losses }}</h3>
    <div>
      <router-link
        :to="{ name: 'Schedule', params: { teamId: $route.params.teamId } }"
        >Schedule</router-link
      >
    </div>
  </div>

  <div class="is-size-4">Team Stats</div>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <th>FG</th>
        <th>FGA</th>
        <th>FG%</th>
        <th>3P</th>
        <th>3PA</th>
        <th>3P%</th>
        <th>2P</th>
        <th>2PA</th>
        <th>2P%</th>
        <th>FT</th>
        <th>FTA</th>
        <th>FT%</th>
        <th>ORB</th>
        <th>DRB</th>
        <th>TRB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th>TOV</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {{ (teamStats.fgm / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.fga / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.fgm / teamStats.fga).toFixed(3) }}
        </td>
        <td>
          {{
            (teamStats.threepm / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.threepa / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{ (teamStats.threepm / teamStats.threepa).toFixed(3) }}
        </td>
        <td>
          {{
            (
              (teamStats.fgm - teamStats.threepm) /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (teamStats.fga - teamStats.threepa) /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (teamStats.fgm - teamStats.threepm) /
              (teamStats.fga - teamStats.threepa)
            ).toFixed(3)
          }}
        </td>
        <td>
          {{ (teamStats.ftm / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.fta / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>{{ (teamStats.ftm / teamStats.fta).toFixed(3) }}</td>
        <td>
          {{ (teamStats.orb / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.drb / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.trb / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.ast / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.stl / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.blk / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{ (teamStats.tov / (teamStats.wins + teamStats.losses)).toFixed(1) }}
        </td>
        <td>
          {{
            (teamStats.points / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
      </tr>
    </tbody>
  </table>

  <div class="is-size-4">Opponent Stats</div>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <th>FG</th>
        <th>FGA</th>
        <th>FG%</th>
        <th>3P</th>
        <th>3PA</th>
        <th>3P%</th>
        <th>2P</th>
        <th>2PA</th>
        <th>2P%</th>
        <th>FT</th>
        <th>FTA</th>
        <th>FT%</th>
        <th>ORB</th>
        <th>DRB</th>
        <th>TRB</th>
        <th>AST</th>
        <th>STL</th>
        <th>BLK</th>
        <th>TOV</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          {{
            (teamStats.oppFgm / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppFga / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{ (teamStats.oppFgm / teamStats.oppFga).toFixed(3) }}
        </td>
        <td>
          {{
            (
              teamStats.oppThreepm /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              teamStats.oppThreepa /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{ (teamStats.oppThreepm / teamStats.oppThreepa).toFixed(3) }}
        </td>
        <td>
          {{
            (
              (teamStats.oppFgm - teamStats.oppThreepm) /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (teamStats.oppFga - teamStats.oppThreepa) /
              (teamStats.wins + teamStats.losses)
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (teamStats.oppFgm - teamStats.oppThreepm) /
              (teamStats.oppFga - teamStats.oppThreepa)
            ).toFixed(3)
          }}
        </td>
        <td>
          {{
            (teamStats.oppFtm / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppFta / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>{{ (teamStats.oppFtm / teamStats.fta).toFixed(3) }}</td>
        <td>
          {{
            (teamStats.oppOrb / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppDrb / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppTrb / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppAst / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppStl / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppBlk / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppTov / (teamStats.wins + teamStats.losses)).toFixed(1)
          }}
        </td>
        <td>
          {{
            (teamStats.oppPoints / (teamStats.wins + teamStats.losses)).toFixed(
              1
            )
          }}
        </td>
      </tr>
    </tbody>
  </table>

  <div class="is-size-4">Player Stats</div>
  <table
    class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th><abbr title="Overall">Ovr</abbr></th>
        <th><abbr title="Position">Pos</abbr></th>
        <th><abbr title="Games Played">G</abbr></th>
        <th><abbr title="Minutes Played Per Game">MP</abbr></th>
        <th><abbr title="Field Goals Per Game">FG</abbr></th>
        <th><abbr title="Field Goal Attempts Per Game">FGA</abbr></th>
        <th><abbr title="Field Goal Percentage">FG%</abbr></th>
        <th><abbr title="3-Point Field Goals Per Game">3P</abbr></th>
        <th><abbr title="3-Point Field Goal Attempts Per Game">3PA</abbr></th>
        <th><abbr title="3-Point Field Goal Percentage">3P%</abbr></th>
        <th><abbr title="2-Point Field Goals Per Game">2P</abbr></th>
        <th><abbr title="2-Point Field Goal Attempts Per Game">2PA</abbr></th>
        <th><abbr title="2-Point Field Goal Percentage">2P%</abbr></th>
        <th><abbr title="Effective Field Goal Percentage">eFG%</abbr></th>
        <th><abbr title="Free Throws Per Game">FT</abbr></th>
        <th><abbr title="Free Throw Attempts Per Game">FTA</abbr></th>
        <th><abbr title="Free Throw Percentage">FT%</abbr></th>
        <th><abbr title="Offensive Rebounds Per Game">ORB</abbr></th>
        <th><abbr title="Defensive Rebounds Per Game">DRB</abbr></th>
        <th><abbr title="Total Rebounds Per Game">TRB</abbr></th>
        <th><abbr title="Assist Per Game">AST</abbr></th>
        <th><abbr title="Steals Per Game">STL</abbr></th>
        <th><abbr title="Blocks Per Game">BLK</abbr></th>
        <th><abbr title="Turnovers Per Game">TOV</abbr></th>
        <th><abbr title="Points Per Game">PTS/G</abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in sortedPlayers">
        <td>
          <router-link
            :to="{ name: 'Player', params: { playerId: player.playerId } }"
          >
            {{ player.first }} {{ player.last }}
          </router-link>
        </td>
        <td>{{ player.overall }}</td>
        <td>{{ player.position }}</td>
        <td>{{ player.stats.gamesPlayed }}</td>
        <td>
          {{ (player.stats.min / 60 / player.stats.gamesPlayed).toFixed(1) }}
        </td>
        <td>{{ (player.stats.fgm / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.fga / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.fgm / player.stats.fga).toFixed(3) }}</td>
        <td>
          {{ (player.stats.threepm / player.stats.gamesPlayed).toFixed(1) }}
        </td>
        <td>
          {{ (player.stats.threepa / player.stats.gamesPlayed).toFixed(1) }}
        </td>
        <td>{{ (player.stats.threepm / player.stats.threepa).toFixed(3) }}</td>
        <td>
          {{
            (
              (player.stats.fgm - player.stats.threepm) /
              player.stats.gamesPlayed
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (player.stats.fga - player.stats.threepa) /
              player.stats.gamesPlayed
            ).toFixed(1)
          }}
        </td>
        <td>
          {{
            (
              (player.stats.fgm - player.stats.threepm) /
              (player.stats.fga - player.stats.threepa)
            ).toFixed(3)
          }}
        </td>
        <td>
          {{
            (
              (player.stats.fgm + 0.5 * player.stats.threepm) /
              player.stats.fga
            ).toFixed(3)
          }}
        </td>
        <td>
          {{ (player.stats.ftm / player.stats.gamesPlayed).toFixed(1) }}
        </td>
        <td>
          {{ (player.stats.fta / player.stats.gamesPlayed).toFixed(1) }}
        </td>
        <td>{{ (player.stats.ftm / player.stats.fta).toFixed(3) }}</td>
        <td>{{ (player.stats.orb / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.drb / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.trb / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.ast / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.stl / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.blk / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>{{ (player.stats.tov / player.stats.gamesPlayed).toFixed(1) }}</td>
        <td>
          {{ (player.stats.points / player.stats.gamesPlayed).toFixed(1) }}
        </td>
      </tr>
    </tbody>
  </table>
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
      return a.overall > b.overall ? -1 : 1;
    });

    return {
      sortedPlayers,
      team,
      teamStats,
    };
  },
});
</script>