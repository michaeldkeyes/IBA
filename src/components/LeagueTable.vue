<template>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <th></th>
        <th>League</th>
        <th>Day</th>
        <th>Season</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="league in leagues" :key="league.leagueId">
        <td>
          <button class="button is-success">Play</button>
        </td>
        <td>{{ league.name }}</td>
        <td>{{ league.day }}</td>
        <td>{{ league.season }}</td>
        <td>
          <button
            class="button is-danger"
            @click="openModal(league.leagueId, league.name)"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <DeleteModal
    :showModal="showModal"
    :leagueId="leagueId"
    :leagueName="leagueName"
    @closeModal="closeModal"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { League } from "../api/Meta";

import DeleteModal from "./DeleteModal.vue";

export default defineComponent({
  props: {
    leagues: {
      type: Object as PropType<League[]>,
      // eslint-disable-next-line
      default: () => {},
    },
  },
  components: { DeleteModal },
  setup() {
    let showModal = ref(false);
    //let leagueIdForModal = ref(99);
    const leagueId = ref<number | undefined>(99);
    const leagueName = ref("");

    const openModal = (id: number, name: string) => {
      //leagueIdForModal.value = leagueId;
      leagueId.value = id;
      leagueName.value = name;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return { showModal, openModal, closeModal, leagueId, leagueName };
  },
});
</script>

<style lang="scss" scoped>
th:first-child {
  width: 5%;
}

th:last-child {
  width: 5%;
}
</style>
