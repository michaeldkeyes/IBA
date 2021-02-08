import { Player } from "../types";
import { getRandomNumber, getRandomNumberInRange } from "./randomNumber";
import firstNames from "../data/firstNames";
import lastNames from "../data/lastNames";
import playerRatings from "../data/playerRatings";

function generatePlayers(): Player[] {
  const players: Player[] = [];
  //const positions: string[] = ['PG', 'SG', 'SF', 'PF', 'C'];

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 12; j++) {
      //const position = 0;
      const ranges = determineRanges();
      const scoring = getRandomNumberInRange(
        playerRatings[0].scoringMin![ranges[0]],
        playerRatings[0].scoringMax![ranges[0]]
      );
      const twoTendency = getRandomNumberInRange(400, 900);
      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        overall: 0,
        scoring,
        twoTendency,
        threeTendency: 1000 - twoTendency,
        twoPercentage: getRandomNumberInRange(
          playerRatings[0].twoPercentageMin![ranges[1]],
          playerRatings[0].twoPercentageMax![ranges[1]]
        ),
        threePercentage: getRandomNumberInRange(
          playerRatings[0].threePercentageMin![ranges[2]],
          playerRatings[0].threePercentageMax![ranges[2]]
        ),
        freeTendency: getRandomNumberInRange(
          playerRatings[0].freeThrowTendencyMin![ranges[3]],
          playerRatings[0].freeThrowTendencyMax![ranges[3]]
        ),
        freePercentage: getRandomNumberInRange(
          playerRatings[0].freeThrowPercentageMin![ranges[4]],
          playerRatings[0].freeThrowPercentageMax![ranges[4]]
        ),
        stats: {
          gamesPlayed: 0,
          points: 0,
          fga: 0,
          fgm: 0,
          threepa: 0,
          threepm: 0,
          fta: 0,
          ftm: 0,
          min: 0,
        },
      };
      player.overall =
        player.twoPercentage + player.threePercentage + player.scoring;
      player.overall = player.overall + player.freePercentage / 2;
      player.overall = player.overall / 1815;
      player.overall = Math.round(player.overall * 100);
      players.push(player);
    }
  }

  return players;
}

function determineRanges() {
  const ranges: number[] = [];
  for (let i = 0; i < 10; i++) {
    const rng = getRandomNumber(100);
    if (rng < 41) {
      ranges.push(0);
    } else if (rng < 91) {
      ranges.push(1);
    } else {
      ranges.push(2);
    }
  }

  return ranges;
}

export default generatePlayers;
