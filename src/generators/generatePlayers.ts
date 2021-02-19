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
      const rng = getRandomNumber(5);
      const scoring = getRandomNumberInRange(
        playerRatings[rng].scoringMin - j * 5,
        playerRatings[rng].scoringMax - j * 5
      );

      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        position: positions[rng],
        overall: 0,
        scoring,
        twoRate: 0,
        threeRate: getRandomNumberInRange(
          playerRatings[rng].threeRateMin!,
          playerRatings[rng].threeRateMax!
        ),
        twoPercentage: getRandomNumberInRange(
          playerRatings[rng].twoPercentageMin!,
          playerRatings[rng].twoPercentageMax!
        ),
        threePercentage: getRandomNumberInRange(
          playerRatings[rng].threePercentageMin!,
          playerRatings[rng].threePercentageMax!
        ),
        freeRate: getRandomNumberInRange(
          playerRatings[rng].freeRateMin!,
          playerRatings[rng].freeRateMax!
        ),
        freePercentage: getRandomNumberInRange(
          playerRatings[rng].freePercentageMin!,
          playerRatings[rng].freePercentageMax!
        ),
        offensiveRebounding: getRandomNumberInRange(
          playerRatings[rng].offensiveReboundingMin!,
          playerRatings[rng].offensiveReboundingMax!
        ),
        defensiveRebounding: getRandomNumberInRange(
          playerRatings[rng].defensiveReboundingMin!,
          playerRatings[rng].defensiveReboundingMax!
        ),
        passing: getRandomNumberInRange(
          playerRatings[rng].passingMin!,
          playerRatings[rng].passingMax!
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
          ast: 0,
        },
      };
      player.twoRate = 1000 - player.threeRate;
      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
