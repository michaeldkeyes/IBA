import { Player } from "../types";
import { getRandomNumber, getRandomNumberInRange } from "./randomNumber";
import firstNames from "../data/firstNames";
import lastNames from "../data/lastNames";
import playerRatings from "../data/playerRatings";

function generatePlayers(): Player[] {
  const players: Player[] = [];
  const positions: string[] = ["PG", "SG", "SF", "PF", "C"];

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 10; j++) {
      const scoring = getRandomNumberInRange(
        playerRatings[j % 5].scoringMin!,
        playerRatings[j % 5].scoringMax!
      );

      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        position: positions[j % 5],
        overall: 0,
        scoring,
        twoRate: 0,
        threeRate: getRandomNumberInRange(
          playerRatings[j % 5].threeRateMin!,
          playerRatings[j % 5].threeRateMax!
        ),
        twoPercentage: getRandomNumberInRange(
          playerRatings[j % 5].twoPercentageMin!,
          playerRatings[1].twoPercentageMax!
        ),
        threePercentage: getRandomNumberInRange(
          playerRatings[j % 5].threePercentageMin!,
          playerRatings[j % 5].threePercentageMax!
        ),
        freeRate: getRandomNumberInRange(
          playerRatings[j % 5].freeRateMin!,
          playerRatings[j % 5].freeRateMax!
        ),
        freePercentage: getRandomNumberInRange(
          playerRatings[j % 5].freePercentageMin!,
          playerRatings[j % 5].freePercentageMax!
        ),
        offensiveRebounding: getRandomNumberInRange(
          playerRatings[j % 5].offensiveReboundingMin!,
          playerRatings[j % 5].offensiveReboundingMax!
        ),
        defensiveRebounding: getRandomNumberInRange(
          playerRatings[j % 5].defensiveReboundingMin!,
          playerRatings[j % 5].defensiveReboundingMax!
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
          orb: 0,
          drb: 0,
          trb: 0,
        },
      };
      player.twoRate = 1000 - player.threeRate;
      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
