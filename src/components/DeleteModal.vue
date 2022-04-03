<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        Are you absolutely sure you want to delete "League {{ leagueId }}"? You
        will permanently lose any record of all seasons, players, and games from
        this league.
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary" @click="deleteLeague">
          Delete League
        </button>
        <button class="button" @click="$emit('handleModal')">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { meta } from "../api/Meta";
import Dexie from "dexie";

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    leagueId: {
      type: Number,
      default: 0,
    },
    leagueName: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const deleteLeague = async () => {
      try {
        await meta.leagues.delete(props.leagueId);
        await Dexie.delete(props.leagueName);
      } catch (error) {
        console.error("League deletion failed");
      } finally {
        emit("closeModal");
      }
    };

    return { deleteLeague };
  },
});
</script>
