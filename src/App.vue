<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link>
    <router-link :to="{ name: 'Teams' }">Teams</router-link>
  </div>
  <router-view />
</template>

<script>
import { provide } from "vue";
import { db } from "./Database";

export default {
  name: "App",
  setup() {
    const clearDb = async () => {
      try {
        console.log("Clearing database...");
        await db.games.clear();
        await db.players.clear();
        await db.schedule.clear();
        await db.teamStats.clear();
        await db.meta.clear();
        console.log("All clear");
      } catch (error) {
        console.error(error);
      }
    };

    clearDb();
  },
};
</script>

<style>
#nav {
  margin-bottom: 10px;
}

a {
  margin-right: 10px;
}
</style>