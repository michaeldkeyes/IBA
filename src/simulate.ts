import { Game, Player, PlayerGameStats, TeamStats } from "./types";
// Prettier was formatting this file very weirdly for some reason
// prettier-ignore
import { getRandomNumber, getRandomNumberInRange } from "./generators/randomNumber";

const coinFlip = getRandomNumber(2);
let offense = coinFlip;
let defense = offense === 0 ? 1 : 0;

//prettier-ignore
function simulate(homePlayers: Player[], homeTeam: TeamStats, awayPlayers: Player[], awayTeam: TeamStats) {
  let lengthOfGame = 2880;
  let gameClock = 0;
  let players = [homePlayers, awayPlayers];
  let teams: TeamStats[] = [homeTeam, awayTeam];

  let homePlayersStats: PlayerGameStats[] = homePlayers.map(player => {
    return {
      playerId: player.playerId!,
      name: player.first +  ' ' + player.last,
      pos: player.position,
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
      attr: {
        scoring: player.scoring,
        twoRate: player.twoRate,
        twoPercentage: player.twoPercentage,
        threeRate: player.threeRate,
        threePercentage: player.threePercentage,
        freeRate: player.freeRate,
        freePercentage: player.freePercentage,
        offensiveRebounding: player.offensiveRebounding,
        defensiveRebounding: player.defensiveRebounding,
        passing: player.passing,
        stealing: player.stealing,
      }
    }
  })
  let awayPlayersStats: PlayerGameStats[] = awayPlayers.map(player => {
    return {
      playerId: player.playerId!,
      name: player.first +  ' ' + player.last,
      pos: player.position,
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
      attr: {
        scoring: player.scoring,
        twoRate: player.twoRate,
        twoPercentage: player.twoPercentage,
        threeRate: player.threeRate,
        threePercentage: player.threePercentage,
        freeRate: player.freeRate,
        freePercentage: player.freePercentage,
        offensiveRebounding: player.offensiveRebounding,
        defensiveRebounding: player.defensiveRebounding,
        passing: player.passing,
        stealing: player.stealing
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
      fta: 0,
      ftm: 0,
      orb: 0,
      drb: 0,
      trb: 0,
      ast: 0,
      stl: 0,
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
      fta: 0,
      ftm: 0,
      orb: 0,
      drb: 0,
      trb: 0,
      ast: 0,
      stl: 0,
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
  }
  
  



  let playersOnCourt = [gameResult.teams[0].players!.slice(0, 5), gameResult.teams[1].players!.slice(0, 5)]
  let playersOnBench = [gameResult.teams[0].players!.slice(5, 10), gameResult.teams[1].players!.slice(5, 10)];
  //let playersInReserve = [gameResult.teams[0].players!.slice(11, gameResult.teams[0].players!.length), gameResult.teams[1].players!.slice(11, gameResult.teams[1].players!.length)]
  while (gameClock < lengthOfGame) {
    const shotClock = getRandomNumberInRange(6,25);
    gameClock += shotClock;

    increaseMinutes(playersOnCourt[offense], shotClock);
    increaseMinutes(playersOnCourt[defense], shotClock);

    const playerToShoot = whoShoots(playersOnCourt[offense]);
    if (checkForSteal(playersOnCourt[defense], gameResult.teams[defense])) {
      continue;
    }
    const playerToAssist = whoAssists(playersOnCourt[offense], playerToShoot);
    let shotModifier = 0;
    if (playerToAssist) {
      shotModifier = .25;
    }
    let fouled = false;
    if (getRandomNumber(1000) <= playerToShoot.attr.freeRate) {
      fouled = true;
    }

    if (getRandomNumber(1000) <= playerToShoot.attr.twoRate) {
      if (getRandomNumber(1000) <= playerToShoot.attr.twoPercentage + Math.round(playerToShoot.attr.twoPercentage * shotModifier)) {
        gameResult.teams[offense].points += 2;
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].fgm++;
        playerToShoot!.points += 2;
        playerToShoot!.fga++;
        playerToShoot!.fgm++;
        if (playerToAssist) {
          gameResult.teams[offense].ast++;
          playerToAssist.ast++
        }
        if (fouled) shootFreeThrows(playerToShoot, 1, gameResult.teams[offense]);
        changePossession();
      } else {
        if (fouled) {
          shootFreeThrows(playerToShoot, 2, gameResult.teams[offense]);
          changePossession()
        } else {
          gameResult.teams[offense].fga++;
          playerToShoot!.fga++;
          whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], gameResult.teams);
        }
      }
    } else {
      if (getRandomNumber(1000) <= playerToShoot.attr.threePercentage + (playerToShoot.attr.threePercentage * shotModifier)) {
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
        if (playerToAssist) {
          gameResult.teams[offense].ast++;
          playerToAssist.ast++;
        }
        changePossession();
      } else {
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].threepa++;
        playerToShoot!.fga++;
        playerToShoot!.threepa++
        whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], gameResult.teams);
      }
    }

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

  // Add the players game stats to their season stats
  for (let i = 0; i < players.length; i++) {
    players[i].forEach(player => {
      let playerToAddStatsFrom = gameResult.teams[i].players.find(player2 => player.playerId === player2.playerId);
      player.stats.fga += playerToAddStatsFrom!.fga;
      player.stats.fgm += playerToAddStatsFrom!.fgm;
      player.stats.min += playerToAddStatsFrom!.min;
      player.stats.points += playerToAddStatsFrom!.points;
      player.stats.threepa += playerToAddStatsFrom!.threepa;
      player.stats.threepm += playerToAddStatsFrom!.threepm;
      player.stats.fta += playerToAddStatsFrom!.fta;
      player.stats.ftm += playerToAddStatsFrom!.ftm;
      player.stats.orb += playerToAddStatsFrom!.orb;
      player.stats.drb += playerToAddStatsFrom!.drb;
      player.stats.trb += playerToAddStatsFrom!.trb;
      player.stats.ast += playerToAddStatsFrom!.ast;
      player.stats.stl += playerToAddStatsFrom!.stl;
      if (playerToAddStatsFrom!.min > 0) {
        player.stats.gamesPlayed!++;
      }
    })
  }

  const winner = gameResult.teams[0].points > gameResult.teams[1].points ? 0 : 1;

  // Add the teams stats to their season stats
  for (let i = 0; i < teams.length; i++) {
    teams[i].fga += gameResult.teams[i].fga;
    teams[i].fgm += gameResult.teams[i].fgm;
    teams[i].points += gameResult.teams[i].points;
    teams[i].threepa += gameResult.teams[i].threepa;
    teams[i].threepm += gameResult.teams[i].threepm;
    teams[i].fta += gameResult.teams[i].fta;
    teams[i].ftm += gameResult.teams[i].ftm;
    teams[i].orb += gameResult.teams[i].orb;
    teams[i].drb += gameResult.teams[i].drb;
    teams[i].trb += gameResult.teams[i].trb;
    teams[i].ast += gameResult.teams[i].ast;
    teams[i].stl += gameResult.teams[i].stl;
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

function changePossession() {
  const temp = offense;
  offense = defense;
  defense = temp;
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
  return playersOnCourt[0];
}

function shootFreeThrows(playerToShoot: PlayerGameStats, num: number, team: TeamStats) {
  while (num > 0) {
    if (getRandomNumber(1000) < playerToShoot.attr.freePercentage) {
      team.points++;
      team.fta++;
      team.ftm++;
      playerToShoot.points++;
      playerToShoot.fta++;
      playerToShoot.ftm++;
    } else {
      team.fta++;
      playerToShoot.fta++;
    }
    num--;
  }
}

function whoGetsRebound(
  offenseTeam: PlayerGameStats[],
  defenseTeam: PlayerGameStats[],
  gameResultTeams: TeamStats[]
) {
  const offenseTotal = offenseTeam
    .map((player) => player.attr.offensiveRebounding)
    .reduce((max, cur) => max + cur);
  const defenseTotal = defenseTeam
    .map((player) => player.attr.defensiveRebounding)
    .reduce((max, cur) => max + cur);
  const total = offenseTotal + defenseTotal;

  const offensiveChance = Math.floor((offenseTotal / total) * 1000);
  const defensiveChance = Math.floor((defenseTotal / total) * 1000);
  const totalChance = offensiveChance + defensiveChance;

  let rng = getRandomNumber(totalChance);

  if (rng <= defensiveChance) {
    rng = getRandomNumber(defenseTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.defensiveRebounding + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].drb++;
        defenseTeam[i].trb++;
        gameResultTeams[defense].drb++;
        gameResultTeams[defense].trb++;
        changePossession();
        return;
      }
    }
  } else if (rng > defensiveChance && rng <= totalChance) {
    rng = getRandomNumber(offenseTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < offenseTeam.length; i++) {
      min = max;
      max = offenseTeam[i].attr.offensiveRebounding + min;
      if (rng < max && rng >= min) {
        offenseTeam[i].orb++;
        offenseTeam[i].trb++;
        gameResultTeams[offense].orb++;
        gameResultTeams[offense].trb++;
        return;
      }
    }
  } else {
    console.log("No one rebounded the ball...");
  }
}

function whoAssists(team: PlayerGameStats[], playerToShoot: PlayerGameStats) {
  // The player who is shooting cannot pass to themselves
  team = team.filter((player) => {
    return player.playerId !== playerToShoot.playerId;
  });

  const teamPassing = team.map((player) => player.attr.passing).reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= teamPassing) {
    const rng = getRandomNumber(teamPassing);
    let min = 0;
    let max = 0;
    for (let i = 0; i < team.length; i++) {
      min = max;
      max = team[i].attr.passing + min;
      if (rng < max && rng >= min) {
        return team[i];
      }
    }
  }

  return null;
}

function checkForSteal(team: PlayerGameStats[], gameResultDefense: TeamStats) {
  // Get the defense's total ability to steal
  const stealTotal = team.map((player) => player.attr.stealing).reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= stealTotal) {
    // Defense stole the ball. Find out who gets credited with the steal
    const rng = getRandomNumber(stealTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < team.length; i++) {
      min = max;
      max = team[i].attr.stealing + min;
      if (rng < max && rng >= min) {
        team[i].stl++;
        gameResultDefense.stl++;
        changePossession();
        return true;
      }
    }
  } else return false;
}

export default simulate;
