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
      //const rng = getRandomNumber(5);
      const scoring = getRandomNumberInRange(
        playerRatings[j % 5].scoringMin,
        playerRatings[j % 5].scoringMax
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
          playerRatings[j % 5].threeRateMin,
          playerRatings[j % 5].threeRateMax
        ),
        twoPercentage: getRandomNumberInRange(
          playerRatings[j % 5].twoPercentageMin,
          playerRatings[j % 5].twoPercentageMax
        ),
        threePercentage: getRandomNumberInRange(
          playerRatings[j % 5].threePercentageMin,
          playerRatings[j % 5].threePercentageMax
        ),
        freeRate: getRandomNumberInRange(
          playerRatings[j % 5].freeRateMin,
          playerRatings[j % 5].freeRateMax
        ),
        freePercentage: getRandomNumberInRange(
          playerRatings[j % 5].freePercentageMin,
          playerRatings[j % 5].freePercentageMax
        ),
        // offensiveRebounding: getRandomNumberInRange(
        //   playerRatings[j % 5].offensiveReboundingMin,
        //   playerRatings[j % 5].offensiveReboundingMax
        // )
        offensiveRebounding: 0,
        defensiveRebounding: getRandomNumberInRange(
          playerRatings[j % 5].defensiveReboundingMin,
          playerRatings[j % 5].defensiveReboundingMax
        ),
        passing: getRandomNumberInRange(
          playerRatings[j % 5].passingMin,
          playerRatings[j % 5].passingMax
        ),
        blocking: getRandomNumberInRange(
          playerRatings[j % 5].blockMin,
          playerRatings[j % 5].blockMax
        ),
        stealing: getRandomNumberInRange(
          playerRatings[j % 5].stealMin,
          playerRatings[j % 5].stealMax
        ),
        offensiveAbility: 0,
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
          stl: 0,
          blk: 0,
        },
      };
      player.twoRate = 1000 - player.threeRate;
      // A player's offensive rebounding is about 25-65% of their defensive rebounding
      player.offensiveRebounding = Math.round(
        player.defensiveRebounding * (getRandomNumberInRange(25, 65) / 100)
      );

      // Determine player overall
      let twoShootingAbility = Math.round(
        Math.round((player.twoPercentage / playerRatings[4].twoPercentageMax) * 100) *
          (player.twoRate / 1000)
      );
      let threeShootingAbility = Math.round(
        Math.round((player.threePercentage / playerRatings[1].threePercentageMax) * 100) *
          (player.threeRate / 1000)
      );
      const shootingAbility = twoShootingAbility + threeShootingAbility;
      player.offensiveAbility = Math.ceil(
        (shootingAbility + Math.round((player.scoring / playerRatings[1].scoringMax) * 100)) / 2
      );

      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
