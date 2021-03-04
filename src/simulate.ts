import { Game, Player, PlayerGameStats, TeamStats } from "./types";

import { getRandomNumber, getRandomNumberInRange } from "./generators/randomNumber";

const coinFlip = getRandomNumber(2);
let offense = coinFlip;
let defense = offense === 0 ? 1 : 0;

function simulate(
  homePlayers: Player[],
  homeTeam: TeamStats,
  awayPlayers: Player[],
  awayTeam: TeamStats
) {
  let lengthOfQuarter = 720;
  const numQuarters = 4;
  let gameOver = false;
  let currentQuarter = 1;
  let gameClock = 0;
  let players = [homePlayers, awayPlayers];
  let teams: TeamStats[] = [homeTeam, awayTeam];

  let homePlayersStats: PlayerGameStats[] = homePlayers.map((player) => {
    return {
      playerId: player.playerId!,
      name: player.first + " " + player.last,
      pos: player.position,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      fta: 0,
      ftm: 0,
      min: 0,
      minutesToPlayThisQuarter: 0,
      orb: 0,
      drb: 0,
      trb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      tov: 0,
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
        blocking: player.blocking,
        ballHandling: player.ballHandling,
        offensiveAbility: player.offensiveAbility,
      },
    };
  });
  let awayPlayersStats: PlayerGameStats[] = awayPlayers.map((player) => {
    return {
      playerId: player.playerId!,
      name: player.first + " " + player.last,
      pos: player.position,
      points: 0,
      fga: 0,
      fgm: 0,
      threepa: 0,
      threepm: 0,
      fta: 0,
      ftm: 0,
      min: 0,
      minutesToPlayThisQuarter: 0,
      orb: 0,
      drb: 0,
      trb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      tov: 0,
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
        blocking: player.blocking,
        ballHandling: player.ballHandling,
        offensiveAbility: player.offensiveAbility,
      },
    };
  });

  let gameResult: Game = {
    loser: { points: 0, teamId: 99 },
    winner: { points: 0, teamId: 99 },
    overtimes: 0,
    teams: [
      {
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
        blk: 0,
        tov: 0,
        players: homePlayersStats,
      },
      {
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
        blk: 0,
        tov: 0,
        players: awayPlayersStats,
      },
    ],
  };

  setPlayingTimes(lengthOfQuarter, gameResult.teams[0].players);
  setPlayingTimes(lengthOfQuarter, gameResult.teams[1].players);

  let playersOnCourt = [
    gameResult.teams[0].players!.slice(0, 5),
    gameResult.teams[1].players!.slice(0, 5),
  ];
  let playersOnBench = [
    gameResult.teams[0].players!.slice(5, 10),
    gameResult.teams[1].players!.slice(5, 10),
  ];
  //let playersInReserve = [gameResult.teams[0].players!.slice(11, gameResult.teams[0].players!.length), gameResult.teams[1].players!.slice(11, gameResult.teams[1].players!.length)]

  // Actual game simulation starts here
  while (!gameOver) {
    const shotClock = getRandomNumberInRange(3, 25);
    gameClock += shotClock;

    increaseMinutes(playersOnCourt[offense], shotClock);
    increaseMinutes(playersOnCourt[defense], shotClock);

    if (checkForSteal(playersOnCourt[defense], playersOnCourt[offense], gameResult.teams)) {
      continue;
    }

    if (checkForTurnover(playersOnCourt[offense], gameResult.teams)) {
      continue;
    }

    const playerToShoot = whoShoots(playersOnCourt[offense]);

    const playerToAssist = whoAssists(playersOnCourt[offense], playerToShoot);

    let shotModifier = 0;
    if (playerToAssist) {
      shotModifier = 0.25;
    }

    let fouled = false;

    if (getRandomNumber(1000) <= playerToShoot.attr.freeRate) {
      fouled = true;
    }

    if (getRandomNumber(1000) <= playerToShoot.attr.twoRate) {
      if (checkForBlock(playersOnCourt[defense], playerToShoot, gameResult.teams)) {
        whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], gameResult.teams);
        continue;
      }
      if (
        getRandomNumber(1000) <=
        playerToShoot.attr.twoPercentage +
          Math.round(playerToShoot.attr.twoPercentage * shotModifier)
      ) {
        gameResult.teams[offense].points += 2;
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].fgm++;
        playerToShoot!.points += 2;
        playerToShoot!.fga++;
        playerToShoot!.fgm++;
        if (playerToAssist) {
          gameResult.teams[offense].ast++;
          playerToAssist.ast++;
        }

        if (fouled) shootFreeThrows(playerToShoot, 1, gameResult.teams[offense]);
        changePossession();
      } else {
        if (fouled) {
          shootFreeThrows(playerToShoot, 2, gameResult.teams[offense]);
          changePossession();
        } else {
          gameResult.teams[offense].fga++;
          playerToShoot!.fga++;
          whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], gameResult.teams);
        }
      }
    } else {
      if (
        getRandomNumber(1000) <=
        playerToShoot.attr.threePercentage + playerToShoot.attr.threePercentage * shotModifier
      ) {
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
        if (fouled) shootFreeThrows(playerToShoot, 1, gameResult.teams[offense]);
        changePossession();
      } else {
        gameResult.teams[offense].fga++;
        gameResult.teams[offense].threepa++;
        playerToShoot!.fga++;
        playerToShoot!.threepa++;
        whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], gameResult.teams);
      }
    }

    playersOnCourt[0].map((player) => {
      if (player.minutesToPlayThisQuarter <= 0) {
        substitutePlayers(playersOnCourt[0], playersOnBench[0]);
      }
    });
    playersOnCourt[1].map((player) => {
      if (player.minutesToPlayThisQuarter <= 0) {
        substitutePlayers(playersOnCourt[1], playersOnBench[1]);
      }
    });

    if (gameClock >= lengthOfQuarter) {
      currentQuarter++;
    }

    if (
      gameClock >= lengthOfQuarter &&
      currentQuarter > numQuarters &&
      gameResult.teams[0].points !== gameResult.teams[1].points
    ) {
      gameOver = true;
    } else if (
      gameClock >= lengthOfQuarter &&
      currentQuarter > numQuarters &&
      gameResult.teams[0].points === gameResult.teams[1].points
    ) {
      gameResult.overtimes++;
      lengthOfQuarter = 300;
      gameClock = 0;
      console.log("Overtime!");
    } else if (gameClock >= lengthOfQuarter) {
      gameClock = 0;
      setPlayingTimes(lengthOfQuarter - gameClock, gameResult.teams[0].players);
      setPlayingTimes(lengthOfQuarter - gameClock, gameResult.teams[1].players);
    }
  }

  // Add the players game stats to their season stats
  for (let i = 0; i < players.length; i++) {
    players[i].map((player) => {
      let playerToAddStatsFrom = gameResult.teams[i].players.find(
        (player2) => player.playerId === player2.playerId
      );
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
      player.stats.blk += playerToAddStatsFrom!.blk;
      player.stats.tov += playerToAddStatsFrom!.tov;
      if (playerToAddStatsFrom!.min > 0) {
        player.stats.gamesPlayed!++;
      }
    });
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
    teams[i].blk += gameResult.teams[i].blk;
    teams[i].tov += gameResult.teams[i].tov;
    if (i === winner) {
      teams[i].wins++;
      gameResult.winner = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!,
      };
    } else {
      teams[i].losses++;
      gameResult.loser = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!,
      };
    }
  }

  return gameResult;
}

function changePossession() {
  let temp = offense;
  offense = defense;
  defense = temp;
}

function increaseMinutes(players: PlayerGameStats[], count: number) {
  return players.map((player) => {
    player.min += count;
    player.minutesToPlayThisQuarter -= count;
  });
}

function substitutePlayers(playersOnCourt: PlayerGameStats[], playersOnBench: PlayerGameStats[]) {
  const playerSubbingOut = playersOnCourt.pop();
  const playerSubbingIn = playersOnBench.shift();
  playersOnCourt.unshift(playerSubbingIn!);
  playersOnBench.push(playerSubbingOut!);
}

// Sets the playing time for each player by quarter
function setPlayingTimes(timeRemaining: number, players: PlayerGameStats[]) {
  // timeRemaining is the time left in the quarter. There's 5 players on the floor at any time so we multiply by 5 to get the total number of seconds to distribute
  let timeAvailable = timeRemaining * 5;

  // We want to randomly assign playing time based on a players position on the depth chart. The following was calculated that the time for the best player on a team will play on average 9 minutes per quarter
  let maxTime = Math.floor(timeRemaining * 0.8125);
  let minTime = Math.floor(timeRemaining * 0.6875);
  const timeReducer = timeRemaining * 0.0625;

  // Go through every player and assign minutes. maxTime and minTime get reduced every iteration so players get less play time the further down the depth chart they are
  for (let i = 0; i < players.length; i++) {
    let minutesToPlayThisQuarter = getRandomNumberInRange(minTime, maxTime);

    if (minutesToPlayThisQuarter < timeAvailable) {
      timeAvailable -= minutesToPlayThisQuarter;
      players[i].minutesToPlayThisQuarter = minutesToPlayThisQuarter;
      // The 5th and 6th players on the roster get roughly the same amount of playing time, so we don't lower the time
      if (i !== 4) {
        maxTime -= timeReducer;
        minTime -= timeReducer;
      }
    } else if (minutesToPlayThisQuarter > timeAvailable) {
      players[i].minutesToPlayThisQuarter = timeAvailable;
      timeAvailable = 0;
      return;
    }
  }

  // If there is still time available somehow after going through the roster then we just give the remaining time to the star player
  if (timeAvailable > 0) players[0].minutesToPlayThisQuarter += timeAvailable;
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

function checkForSteal(
  defenseTeam: PlayerGameStats[],
  offenseTeam: PlayerGameStats[],
  gameResultTeams: TeamStats[]
) {
  // Get the defense's total ability to steal
  const stealTotal = defenseTeam
    .map((player) => player.attr.stealing)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= stealTotal) {
    // Find out who turned the ball over
    const turnOverTotal = offenseTeam
      .map((player) => player.attr.ballHandling)
      .reduce((max, cur) => max + cur);
    whoTurnedOver(offenseTeam, gameResultTeams, turnOverTotal);

    // Defense stole the ball. Find out who gets credited with the steal
    const rng = getRandomNumber(stealTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.stealing + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].stl++;
        gameResultTeams[defense].stl++;
        changePossession();
        return true;
      }
    }
  }

  return false;
}

function checkForBlock(
  defenseTeam: PlayerGameStats[],
  playerToShoot: PlayerGameStats,
  gameResultTeams: TeamStats[]
) {
  // Get the defese's total ability to block
  const blockTotal = defenseTeam
    .map((player) => player.attr.blocking)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= blockTotal) {
    // Defense blocked the ball. Find out who gets credited with the block
    const rng = getRandomNumber(blockTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.blocking + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].blk++;
        gameResultTeams[defense].blk++;
        gameResultTeams[offense].fga++;
        playerToShoot.fga++;
        return true;
      }
    }
  }

  return false;
}

function checkForTurnover(offenseTeam: PlayerGameStats[], gameResultTeams: TeamStats[]) {
  const turnOverTotal = offenseTeam
    .map((player) => player.attr.ballHandling)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= turnOverTotal) {
    // Offense commited a turnover. Find out who gets credited with the turnover
    whoTurnedOver(offenseTeam, gameResultTeams, turnOverTotal);
    changePossession();
  }

  return false;
}

function whoTurnedOver(
  offenseTeam: PlayerGameStats[],
  gameResultTeams: TeamStats[],
  total: number
) {
  const rng = getRandomNumber(total);
  let min = 0;
  let max = 0;
  for (let i = 0; i < offenseTeam.length; i++) {
    min = max;
    max = offenseTeam[i].attr.ballHandling + min;
    if (rng < max && rng >= min) {
      offenseTeam[i].tov++;
      gameResultTeams[offense].tov++;
      return true;
    }
  }
}

export default simulate;
