import { Player } from "../types";
import { getRandomNumber, getRandomNumberInRange } from "./randomNumber";
import firstNames from "../data/firstNames";
import lastNames from "../data/lastNames";
import playerRatings from "../data/playerRatings";

function generatePlayers(): Player[] {
  const players: Player[] = [];
  const positions: string[] = ["PG", "SG", "SF", "PF", "C"];

  for (let i = 0; i < 32; i++) {
    let maxRoll = 50;
    for (let j = 0; j < 13; j++) {
      const position = j < 10 ? j % 5 : getRandomNumber(5);
      if (j === 5) maxRoll -= 5;
      if (j === 10) maxRoll -= 5;
      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        position: positions[position],
        overall: 0,
        attr: {
          twoRate: 0,
          threeRate: getRandomNumberInRange(
            playerRatings[j % 5].threeRateMin,
            playerRatings[j % 5].threeRateMax
          ),
          twoPercentage:
            getRandomNumber(maxRoll) + playerRatings[j % 5].twoPercentageMin,
          threePercentage:
            getRandomNumber(maxRoll) + playerRatings[j % 5].threePercentageMin,
          freePercentage:
            getRandomNumberInRange(25, maxRoll) +
            playerRatings[j % 5].freePercentageMin,
          rebounding:
            getRandomNumber(maxRoll) + playerRatings[j % 5].reboundingMin,
          passing: getRandomNumber(maxRoll) + playerRatings[j % 5].passingMin,
          stealing: getRandomNumber(maxRoll) + playerRatings[j % 5].stealMin,
          blocking: getRandomNumber(maxRoll) + playerRatings[j % 5].blockMin,
          ballHandling: getRandomNumberInRange(
            playerRatings[j % 5].ballHandlingMin,
            playerRatings[j % 5].ballHandlingMax
          ),
          scoring: 0,
          offensiveAbility: 0,
        },
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
      player.attr.twoRate = 1000 - player.attr.threeRate;

      // Determine player overall
      let twoShootingAbility = Math.round(
        player.attr.twoPercentage * (player.attr.twoRate / 1000)
      );
      let threeShootingAbility = Math.round(
        player.attr.threePercentage * (player.attr.threeRate / 1000)
      );
      player.attr.offensiveAbility = twoShootingAbility + threeShootingAbility;

      switch (player.position) {
        case "PG":
          player.overall = Math.round(
            player.attr.offensiveAbility * 0.5 +
              player.attr.passing * 0.2 +
              player.attr.stealing * 0.3
          );
          break;
        case "SG":
          player.overall = Math.round(
            player.attr.offensiveAbility * 0.61 + player.attr.stealing * 0.39
          );
          break;
        case "SF":
          player.overall = Math.round(
            player.attr.offensiveAbility * 0.4 +
              (player.attr.rebounding + 30) * 0.235 +
              (player.attr.passing + 25) * 0.15 +
              (player.attr.stealing + 25) * 0.235
          );
          break;
        case "PF":
          player.overall = Math.round(
            player.attr.offensiveAbility * 0.6 + player.attr.rebounding * 0.4
          );
          break;
        case "C":
          player.overall = Math.round(
            player.attr.offensiveAbility * 0.5 +
              (player.attr.rebounding + 10) * 0.3 +
              player.attr.blocking * 0.2
          );
          break;
      }

      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
