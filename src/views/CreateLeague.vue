<template>
  <h1 class="is-size-1 has-text-centered mt-6">
    Welcome to the International Basketball Association
  </h1>
  <div class="is-flex is-justify-content-center mt-6 mb-5">
    <button class="is-size-2 button is-primary" @click="generate()">
      New League
    </button>
  </div>
  <template v-if="hasLeagues">
    <LeagueTable :leagues="leagues" />
  </template>

  <div v-if="iHaveImplementedThis">
    <div class="dropdown" :class="dropdown.active.value ? 'is-active' : ''">
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          @click.stop="dropdown.toggle()"
        >
          <span>
            {{
              selectedTeam === null
                ? "Select a Team"
                : selectedTeam.city + " " + selectedTeam.name
            }}
          </span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <div
            v-for="team in teams"
            :key="team.teamId"
            class="dropdown-item"
            :class="[
              selectedTeam && selectedTeam.teamId == team.teamId
                ? 'is-active'
                : '',
            ]"
            @click="selectTeam(team)"
          >
            {{ team.city }} {{ team.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import teams from "../core/team/teams";
import generateLeague from "../core/league/generate";
import LeagueTable from "../components/LeagueTable.vue";
import { meta } from "../api/Meta";
import { useRouter } from "vue-router";
import { liveQuery } from "dexie"; // This works I don't know why it says liveQuery doesn't exist.
import { useObservable } from "@vueuse/rxjs";

export default defineComponent({
  components: {
    LeagueTable,
  },

  setup() {
    const router = useRouter();

    //let selectedTeam = ref<Team | null>(null);
    const iHaveImplementedThis = ref(false);

    const generate = async () => {
      const leagueId: number = (await generateLeague()) as number;
      router.push({ name: "Dashboard", params: { leagueId } });
    };

    // const dropdown = {
    //   active: ref(false),
    //   toggle: () => {
    //     dropdown.active.value = !dropdown.active.value;
    //   },
    //   close: () => {
    //     dropdown.active.value = false;
    //   },
    // };

    // const selectTeam = (team: Team) => {
    //   selectedTeam.value = team;
    // };

    // onBeforeUnmount(() => {
    //   document.removeEventListener("click", dropdown.close);
    // });

    // onMounted(() => {
    //   document.addEventListener("click", dropdown.close);
    // });

    return {
      teams,
      generate,
      iHaveImplementedThis,
      leagues: useObservable(liveQuery(() => meta.leagues.toArray())),
      hasLeagues: useObservable(liveQuery(() => meta.leagues.count())),
    };
  },
});
</script>

<style lang="scss" scoped>
button {
  width: 230px;
}
</style>
