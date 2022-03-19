import teams from "../data/teams";
import { getRandomNumber } from "../utils/random";
import { Schedule, Team } from "../types";

// Creates an 80 game schedule
function generateGames(): Schedule[] {
  let games: Schedule[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      // Check if they are not the same team
      if (teams[i].teamId !== teams[j].teamId) {
        const game = {
          homeTeamId: teams[i].teamId,
          awayTeamId: teams[j].teamId,
        };

        // Check if the teams are not in the same conference. They play 1 home game against each team in the opposing conference
        if (teams[i].conference !== teams[j].conference) {
          games.push(game);
        }

        // Check if the teams are in the same division. They play 2 home games against each team in their division
        if (teams[i].division === teams[j].division) {
          games.push(game);
          games.push(game);
        }

        // Check if teams are in the same conference, but not in the same division. They play 1-2 home games against those teams, but we will just find one for now
        if (
          teams[i].conference === teams[j].conference &&
          teams[i].division !== teams[j].division
        ) {
          games.push(game);
        }
      }
    }
  }

  games = findRemainingConferenceGames(games);

  return games;
}

function findRemainingConferenceGames(games: Schedule[]) {
  const timesChosen = new Array(32).fill(0);
  // Each team needs 6 more home games against non-divisional opponents
  for (let i = 0; i < teams.length; i++) {
    let remainingGames = 6;
    const matchups: Team[] = [];

    // Filter all the teams that are in the conference but not the division
    let filteredTeams: Team[] = teams.filter(
      (team) =>
        teams[i].teamId !== team.teamId &&
        teams[i].conference === team.conference &&
        teams[i].division !== team.division &&
        timesChosen[team.teamId] < 6
    );

    while (remainingGames > 0) {
      let gamesPicked = 0;
      let teamsToPlayAgainst: Team[] = [];
      // Filter the teams that have been selected the least so far
      do {
        gamesPicked++;
        teamsToPlayAgainst = filteredTeams.filter(
          (team) => timesChosen[team.teamId] < gamesPicked
        );
      } while (teamsToPlayAgainst.length === 0);

      // Find a random opponent
      const rng = getRandomNumber(teamsToPlayAgainst.length);

      timesChosen[teamsToPlayAgainst[rng].teamId]++;
      // Remove the team from the filtered list so it can't be picked again by this team
      filteredTeams = filteredTeams.filter(
        (team) => team.teamId !== teamsToPlayAgainst[rng].teamId
      );

      if (matchups.length !== 5) {
        // A team should only pick 2 home games against a division, so we remove teams from that division if 2 have been chosen
        for (let j = 0; j < matchups.length; j++) {
          if (matchups[j].division === teamsToPlayAgainst[rng].division) {
            filteredTeams = filteredTeams.filter(
              (team) => team.division !== teamsToPlayAgainst[rng].division
            );
            break;
          }
        }
      }

      matchups.push(teamsToPlayAgainst[rng]);

      remainingGames--;
    }
    matchups.map((team) => {
      const game: Schedule = { homeTeamId: i, awayTeamId: team.teamId };
      games.push(game);
    });
  }

  return games;
}

// Currently the schedule is in order. We need to shuffle it to make a realistic schedule
function generateSchedule(): Schedule[] {
  const schedule: Schedule[][] = [];
  const games = generateGames();

  while (games.length > 0) {
    // The league will play 8 games a day
    const gameDay: Schedule[] = [];
    let iters = 0;

    while (gameDay.length < 8 && games.length > 0) {
      const rng = getRandomNumber(games.length);
      let good = true;
      const gameFound = games.splice(rng, 1);
      const temp: Schedule = {
        homeTeamId: gameFound[0].homeTeamId,
        awayTeamId: gameFound[0].awayTeamId,
      };

      // Teams can only play once per day. Check to see if any of the two teams are playing already
      if (good) {
        for (let i = 0; i < gameDay.length; i++) {
          if (
            gameDay[i].homeTeamId === temp.homeTeamId ||
            gameDay[i].homeTeamId === temp.awayTeamId ||
            gameDay[i].awayTeamId === temp.homeTeamId ||
            gameDay[i].awayTeamId === temp.awayTeamId
          ) {
            // Return the game
            games.push(temp);
            good = false;
            break;
          }
        }
      }

      iters++;
      // Towards the end the algorithm can get stuck trying to find a game
      if (iters === 50) {
        break;
      }

      // We need to assign what day of the season this game will be played
      if (good) {
        iters++;
        temp.day = schedule.length + 1;
        gameDay.push(temp);
      }
    }
    // We have to use push and flat or else it messes up our schedule.length
    schedule.push(gameDay);
  }

  return schedule.flat();
}

export default generateSchedule;
