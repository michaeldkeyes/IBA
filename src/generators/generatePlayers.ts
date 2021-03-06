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
      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        position: positions[j % 5],
        overall: 0,
        scoring: 0,
        twoRate: 0,
        threeRate: getRandomNumberInRange(
          playerRatings[j % 5].threeRateMin,
          playerRatings[j % 5].threeRateMax
        ),
        twoPercentage:
          getRandomNumber(50) + playerRatings[j % 5].twoPercentageMin,
        threePercentage:
          getRandomNumber(50) + playerRatings[j % 5].threePercentageMin,
        freePercentage:
          getRandomNumberInRange(25, 50) +
          playerRatings[j % 5].freePercentageMin,
        rebounding: getRandomNumber(50) + playerRatings[j % 5].reboundingMin,
        passing: getRandomNumber(50) + playerRatings[j % 5].passingMin,
        stealing: getRandomNumber(50) + playerRatings[j % 5].stealMin,
        blocking: getRandomNumber(50) + playerRatings[j % 5].blockMin,
        ballHandling: getRandomNumberInRange(
          playerRatings[j % 5].ballHandlingMin,
          playerRatings[j % 5].ballHandlingMax
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
          tov: 0,
        },
        injury: {
          injured: false,
          games: 0,
          type: "",
        },
      };
      player.twoRate = 1000 - player.threeRate;

      // Determine player overall
      let twoShootingAbility = Math.round(
        player.twoPercentage * (player.twoRate / 1000)
      );
      let threeShootingAbility = Math.round(
        player.threePercentage * (player.threeRate / 1000)
      );
      player.offensiveAbility = twoShootingAbility + threeShootingAbility;

      switch (player.position) {
        case "PG":
          player.overall = Math.round(
            player.offensiveAbility * 0.5 +
              player.passing * 0.2 +
              player.stealing * 0.3
          );
          break;
        case "SG":
          player.overall = Math.round(
            player.offensiveAbility * 0.61 + player.stealing * 0.39
          );
          break;
        case "SF":
          player.overall = Math.round(
            player.offensiveAbility * 0.4 +
              (player.rebounding + 30) * 0.235 +
              (player.passing + 25) * 0.15 +
              (player.stealing + 25) * 0.235
          );
          break;
        case "PF":
          player.overall = Math.round(
            player.offensiveAbility * 0.6 + player.rebounding * 0.4
          );
          break;
        case "C":
          player.overall = Math.round(
            player.offensiveAbility * 0.5 +
              (player.rebounding + 10) * 0.3 +
              player.blocking * 0.2
          );
          break;
      }

      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
