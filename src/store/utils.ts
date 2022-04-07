import Dexie from "dexie";
import { meta } from "../api/Meta";
import teams from "../core/team/teams";

async function loadStore(store: any, leagueName: string) {
  const db = await new Dexie(leagueName).open();
  await db
    .table("players")
    .toArray()
    .then((players) => store.setPlayers(players));
  await db
    .table("schedule")
    .toArray()
    .then((schedule) => store.setSchedule(schedule));
  await db
    .table("teamStats")
    .toArray()
    .then((teams) => store.setTeamStats(teams));
  await meta
    .table("leagues")
    .where("name")
    .equals(leagueName)
    .toArray()
    .then((result) => store.setMeta(result[0].day, result[0].season));
  // .toArray()
  // .then((db) => store.setMeta(league[0].day, league[0].season));
  store.setTeams(teams);
  store.setIsLoaded(true);
}

export { loadStore };
