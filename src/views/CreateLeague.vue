<template>
  <h1 class="is-size-1 has-text-centered mt-6">
    Welcome to the International Basketball Association
  </h1>
  <div class="is-flex is-justify-content-center mt-6">
    <button class="is-size-2 button is-primary">New League</button>
  </div>
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
import { defineComponent, ref, onBeforeUnmount, onMounted } from "vue";
import teams from "../core/team/teams";
import { Team } from "../types";

export default defineComponent({
  setup() {
    let selectedTeam = ref<Team | null>(null);

    let iHaveImplementedThis = ref(false);

    const dropdown = {
      active: ref(false),
      toggle: () => {
        dropdown.active.value = !dropdown.active.value;
      },
      close: () => {
        dropdown.active.value = false;
      },
    };

    const selectTeam = (team: Team) => {
      selectedTeam.value = team;
    };

    onBeforeUnmount(() => {
      document.removeEventListener("click", dropdown.close);
    });

    onMounted(() => {
      document.addEventListener("click", dropdown.close);
    });

    return { dropdown, teams, selectedTeam, selectTeam, iHaveImplementedThis };
  },
});
</script>

<style lang="scss" scoped>
button {
  width: 230px;
}
</style>
