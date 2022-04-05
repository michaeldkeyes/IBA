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
          <button class="button is-success" @click="play(league.leagueId)">
            Play
          </button>
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
import { useRouter } from "vue-router";

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
    const router = useRouter();
    let showModal = ref(false);
    const leagueId = ref<number | undefined>(99);
    const leagueName = ref("");

    const openModal = (id: number, name: string) => {
      leagueId.value = id;
      leagueName.value = name;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const play = (leagueId: number) => {
      router.push({ name: "Dashboard", params: { leagueId } });
    };

    return { showModal, openModal, closeModal, leagueId, leagueName, play };
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
