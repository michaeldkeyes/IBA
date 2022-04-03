import League from "../../api/Database";
import { meta } from "../../api/Meta";
import { useLeagueStore } from "../../store/index";
import generatePlayers from "../../generators/generatePlayers";
import generateSchedule from "../../generators/generateSchedule";
import generateTeamStats from "../../generators/generateTeamStats";
import teams from "../team/teams";

const store = useLeagueStore();

async function generateLeague() {
  try {
    console.log("Generating league...");
    const numLeagues = await getNewLeagueId();
    let leagueName = "";
    if (numLeagues) {
      leagueName = `League ${numLeagues + 1}`;
      await meta.leagues.add({
        leagueId: numLeagues + 1,
        day: 1,
        season: 2022,
        name: leagueName,
      });
      const league = new League(leagueName);
      const players = generatePlayers();
      const schedule = generateSchedule();
      const teamStats = generateTeamStats();
      await league.players.bulkAdd(players);
      await league.schedule.bulkAdd(schedule);
      await league.teamStats.bulkAdd(teamStats);
      await league.players
        .toArray()
        .then((players) => store.setPlayers(players));
      await league.schedule
        .toArray()
        .then((schedule) => store.setSchedule(schedule));
      await league.teamStats
        .toArray()
        .then((teams) => store.setTeamStats(teams));
      await meta.leagues
        .toArray()
        .then((league) => store.setMeta(league[0].day, league[0].season));
      store.setTeams(teams);
      store.toggleIsReady();
      console.log("Done!");
    }
  } catch (error) {
    console.error(error);
  }
}

async function getNewLeagueId() {
  const leagues = await meta.leagues.toArray();
  let leagueId: number | undefined = 0;
  if (leagues.length > 0) {
    leagueId = leagues[leagues.length - 1].leagueId;
  }
  console.log(leagueId);

  return leagueId;
}

export default generateLeague;
