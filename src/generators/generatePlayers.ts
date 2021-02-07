import { Player } from "../types";
import { getRandomNumber, getRandomNumberInRange } from "./randomNumber";
import firstNames from "../data/firstNames";
import lastNames from "../data/lastNames";

function generatePlayers(): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 12; j++) {
      const player: Player = {
        teamId: i,
        first: firstNames.USA[getRandomNumber(firstNames.USA.length)],
        last: lastNames.USA[getRandomNumber(lastNames.USA.length)],
        twoPercentage: getRandomNumberInRange(250, 500),
        stats: {
          gamesPlayed: 0,
          points: 0,
          fga: 0,
          fgm: 0,
          min: 0,
        },
      };
      players.push(player);
    }
  }

  return players;
}

export default generatePlayers;
