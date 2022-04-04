<template>
  <div class="is-flex is-flex-direction-column is-align-items-center mb-6">
    <h1 class="is-size-1">{{ store.meta.season }} Season</h1>
    <h2 class="is-size-4">Day {{ store.meta.day }}</h2>
  </div>

  <div class="is-flex is-flex-wrap-wrap columns">
    <ConferenceStandings conference="Western Conference" />
    <LeagueLeaders />
    <ConferenceStandings conference="Eastern Conference" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useLeagueStore } from "../store/index";

import ConferenceStandings from "../components/ConferenceStandings.vue";
import LeagueLeaders from "../components/LeagueLeaders.vue";

export default defineComponent({
  components: {
    ConferenceStandings,
    LeagueLeaders,
  },
  setup() {
    const store = useLeagueStore();
    console.log("HomeView");
    console.log(store.players);

    return {
      store,
    };
  },
});
</script>

<style scoped>
button {
  margin-right: 10px;
}
li {
  list-style: none;
  margin-bottom: 5px;
}
.d-flex {
  display: flex;
  justify-content: space-evenly;
}
</style>
