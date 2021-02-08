import { Game, Player, PlayerGameStats, TeamStats } from "./types";
// Prettier was formatting this file very weirdly for some reason
// prettier-ignore
import { getRandomNumber, getRandomNumberInRange } from "./generators/randomNumber";

// prettier-ignore
function simulate(homePlayers: Player[], homeTeam: TeamStats, awayPlayers: Player[], awayTeam: TeamStats) {
  let lengthOfGame = 2880;
  let gameClock = 0;
  let coinFlip = getRandomNumber(2);
  let players = [homePlayers, awayPlayers];
  let teams: any = [homeTeam, awayTeam];


  let homePlayersStats: PlayerGameStats[] = homePlayers.map(player => {
    return {
      playerId: player.playerId!,
      name: player.first +  ' ' + player.last,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      min: 0,
      attr: {
        scoring: player.scoring,
        twoTendency: player.twoTendency,
        twoPercentage: player.twoPercentage,
        threeTendency: player.threeTendency,
        threePercentage: player.threePercentage,
      }
    }
  })
  let awayPlayersStats: PlayerGameStats[] = awayPlayers.map(player => {
    return {
      playerId: player.playerId!,
      name: player.first +  ' ' + player.last,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      min: 0,
      attr: {
        scoring: player.scoring,
        twoTendency: player.twoTendency,
        twoPercentage: player.twoPercentage,
        threeTendency: player.threeTendency,
        threePercentage: player.threePercentage,
      }
    }
  })


  let gameResult: Game = {
    loser: {points: 0, teamId: 99},
    winner: {points: 0, teamId: 99},
    overtimes: 0,
    teams: [{
      teamId: homeTeam.teamId,
      losses: homeTeam.losses,
      wins: homeTeam.wins,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      players: homePlayersStats
    }, {
      teamId: awayTeam.teamId,
      losses: awayTeam.losses,
      wins: awayTeam.wins,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      players: awayPlayersStats
    }]
  }

  let substitutionTimes = [{time: [getRandomNumberInRange(450, 510)], numSubs: 0}, {time: [getRandomNumberInRange(450, 510)], numSubs: 0}];

  for (let i = 0; i < substitutionTimes.length; i++) {
    for (let j = 1; j < 20; j++) {
      let minValue: number;
      let maxValue: number;
      if (j === 5) {
        minValue = substitutionTimes[i].time[j-1] + 330;
        maxValue = substitutionTimes[i].time[j-1] + 390;
      } else if (j > 5 && j < 10) {
        minValue = substitutionTimes[i].time[j-1] + 15;
        maxValue = substitutionTimes[i].time[j-1] + 45;
      } else if (j === 10) {
        minValue = substitutionTimes[i].time[j-1] + 450;
        maxValue = substitutionTimes[i].time[j-1] + 510;
      } else if (j > 10 && j < 15) {
        minValue = substitutionTimes[i].time[j-1] + 15;
        maxValue = substitutionTimes[i].time[j-1] + 45;
      } else if (j === 15) {
        minValue = substitutionTimes[i].time[j-1] + 330;
        maxValue = substitutionTimes[i].time[j-1] + 390;
      } else {
        minValue = substitutionTimes[i].time[j-1] + 30;
        maxValue = substitutionTimes[i].time[j-1] + 90;
      }

      substitutionTimes[i].time.push(getRandomNumberInRange(minValue, maxValue));
    }
    //substitutionTimes[i].reverse();
  }
  
  

  let offense = coinFlip;
  let defense = offense === 0 ? 1 : 0;

  let playersOnCourt = [gameResult.teams[0].players!.slice(0, 5), gameResult.teams[1].players!.slice(0, 5)]
  let playersOnBench = [gameResult.teams[0].players!.slice(5, 10), gameResult.teams[1].players!.slice(5, 10)];
  //let playersInReserve = [gameResult.teams[0].players!.slice(11, gameResult.teams[0].players!.length), gameResult.teams[1].players!.slice(11, gameResult.teams[1].players!.length)]
  while (gameClock < lengthOfGame) {
    const shotClock = getRandomNumberInRange(4,25);
    gameClock += shotClock;

    increaseMinutes(playersOnCourt[offense], shotClock);
    increaseMinutes(playersOnCourt[defense], shotClock);

    const playerToShoot = whoShoots(playersOnCourt[offense]);
    if (getRandomNumber(1000) <= playerToShoot!.attr.twoTendency) {
      if (getRandomNumber(1000) <= playerToShoot!.attr.twoPercentage) {
        gameResult.teams[offense].points += 2;
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].fgm++;
        playerToShoot!.points += 2;
        playerToShoot!.fga++;
        playerToShoot!.fgm++;
      } else {
        gameResult.teams[offense].fga++;
        playerToShoot!.fga++;
      }
    } else {
      if (getRandomNumber(1000) <= playerToShoot!.attr.threePercentage) {
        gameResult.teams[offense].points += 3;
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].fgm++;
        gameResult.teams[offense].threepa++;
        gameResult.teams[offense].threepm++;
        playerToShoot!.points += 3;
        playerToShoot!.fga++;
        playerToShoot!.fgm++;
        playerToShoot!.threepa++;
        playerToShoot!.threepm++;
      } else {
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].threepa++;
        playerToShoot!.fga++;
        playerToShoot!.threepa++
      }
    }
    

    const temp = offense;
    offense = defense;
    defense = temp;

    if (substitutionTimes[offense].time[0] < gameClock) {
      substitutePlayers(playersOnCourt[offense], playersOnBench[offense], substitutionTimes[offense])
    }
    if (substitutionTimes[defense].time[0] < gameClock) {
      substitutePlayers(playersOnCourt[defense], playersOnBench[defense], substitutionTimes[defense]);
    }

    if (gameClock >= lengthOfGame && gameResult.teams[0].points === gameResult.teams[1].points) {
      gameResult.overtimes++;
      lengthOfGame = 300;
      gameClock = 0;
    }
  }

  for (let i = 0; i < players.length; i++) {
    players[i].forEach(player => {
      let playerToAddStatsFrom = gameResult.teams[i].players?.find(player2 => player.playerId === player2.playerId);
      player.stats.fga += playerToAddStatsFrom!.fga;
      player.stats.fgm += playerToAddStatsFrom!.fgm;
      player.stats.min += playerToAddStatsFrom!.min;
      player.stats.points += playerToAddStatsFrom!.points;
      player.stats.threepa += playerToAddStatsFrom!.threepa;
      player.stats.threepm += playerToAddStatsFrom!.threepm;
      if (playerToAddStatsFrom!.min > 0) {
        player.stats.gamesPlayed!++;
      }
    })
  }

  const winner = gameResult.teams[0].points > gameResult.teams[1].points ? 0 : 1;

  for (let i = 0; i < teams.length; i++) {
    teams[i].fga += gameResult.teams[i].fga;
    teams[i].fgm += gameResult.teams[i].fgm;
    teams[i].points += gameResult.teams[i].points;
    if (i === winner) {
      teams[i].wins++;
      gameResult.winner = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!
      }
    } else {
      teams[i].losses++;
      gameResult.loser = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!
      }
    }
  }

  return gameResult;
}

function increaseMinutes(players: PlayerGameStats[], count: number) {
  return players.map((player) => {
    player.min += count;
  });
}

function substitutePlayers(
  playersOnCourt: PlayerGameStats[],
  playersOnBench: PlayerGameStats[],
  substitutionTimes: { time: number[]; numSubs: number }
) {
  const playerSubbingOut = playersOnCourt.pop();
  const playerSubbingIn = playersOnBench.shift();
  playersOnCourt.unshift(playerSubbingIn!);
  playersOnBench.push(playerSubbingOut!);

  substitutionTimes.time.shift();
  substitutionTimes.numSubs++;
  if (substitutionTimes.numSubs % 5 === 0) {
    playersOnCourt.reverse();
    playersOnBench.reverse();
  }
}

function whoShoots(playersOnCourt: PlayerGameStats[]) {
  let totalScoring = 0;

  for (let i = 0; i < playersOnCourt.length; i++) {
    totalScoring += playersOnCourt[i].attr.scoring;
  }

  const rng = getRandomNumber(totalScoring);

  let min = 0;
  let max = 0;
  for (let i = 0; i < playersOnCourt.length; i++) {
    min = max;
    max = playersOnCourt[i].attr.scoring + min;
    if (rng < max && rng >= min) {
      return playersOnCourt[i];
    }
  }
  console.log("Oopsie!");
}

export default simulate;
