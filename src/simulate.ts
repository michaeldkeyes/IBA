import { Game, Player, PlayerGameStats, TeamStats } from "./types";

import teamsData from "./data/teams";

import {
  getRandomNumber,
  getRandomNumberInRange,
} from "./generators/randomNumber";

import injuries from "./data/injuries";

const coinFlip = getRandomNumber(2);
let offense = coinFlip;
let defense = offense === 0 ? 1 : 0;

const twoPointNormalizer = 0.55;
const threePointNormalizer = 0.4;
const freeThrowNormalizer = 0.92;
const defensiveReboundNormalizer = 0.3;
const offensiveReboundNormalizer = 0.15;
const assistNormalizer = 0.5;
const stealNormalizer = 0.4;
const blockNormalizer = 0.65;

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
  let teams = [homeTeam, awayTeam];

  let playerStats: PlayerGameStats[][] = players.map((team) => {
    return team.map((player) => {
      return {
        playerId: player.playerId!,
        name: player.first + " " + player.last,
        overall: player.overall,
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
        blk: 0,
        tov: 0,
        attr: player.attr,
        playingTime: 0,
        restTime: 0,
        courtTime: 0,
        benchTime: 0,
        injury: player.injury,
      };
    });
  });

  let teamStats: TeamStats[] = teams.map((team, index) => {
    return {
      teamId: team.teamId,
      abbrev: team.abbrev,
      conferenceLosses: team.conferenceLosses,
      conferenceWins: team.conferenceWins,
      divisionLosses: team.divisionLosses,
      divisionWins: team.divisionWins,
      losses: team.losses,
      wins: team.wins,
      points: 0,
      ptsThisQuarter: 0,
      ptsPerQuarter: [],
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
      oppPoints: 0,
      oppFga: 0,
      oppFgm: 0,
      oppThreepa: 0,
      oppThreepm: 0,
      oppFta: 0,
      oppFtm: 0,
      oppOrb: 0,
      oppDrb: 0,
      oppTrb: 0,
      oppAst: 0,
      oppStl: 0,
      oppBlk: 0,
      oppTov: 0,
      players: playerStats[index],
    };
  });

  let gameResult: Game = {
    loser: { points: 0, teamId: 99 },
    winner: { points: 0, teamId: 99 },
    overtimes: 0,
    teams: [teamStats[0], teamStats[1]],
  };

  let homePlayersFiltered = filterInjuredPlayers(gameResult.teams[0].players!);
  let awayPlayersFiltered = filterInjuredPlayers(gameResult.teams[1].players!);

  setHomeCourtAdvantage(homePlayersFiltered, awayPlayersFiltered);

  let playersOnCourt = [
    homePlayersFiltered.slice(0, 5),
    awayPlayersFiltered.slice(0, 5),
  ];
  let playersOnBench = [
    homePlayersFiltered.slice(5, homePlayersFiltered.length),
    awayPlayersFiltered.slice(5, awayPlayersFiltered.length),
  ];

  setPlayingTimes([...playersOnCourt[0], ...playersOnBench[0]]);
  setPlayingTimes([...playersOnCourt[1], ...playersOnBench[1]]);

  setScoring(playersOnCourt[0], playersOnBench[0]);
  setScoring(playersOnCourt[1], playersOnBench[1]);

  // Actual game simulation starts here
  while (!gameOver) {
    let shotClock = getRandomNumberInRange(3, 25);
    gameClock += shotClock;
    if (gameClock > lengthOfQuarter) {
      gameClock = lengthOfQuarter;
      shotClock = gameClock - lengthOfQuarter;
    }
    increaseMinutes(
      playersOnCourt[offense],
      playersOnBench[offense],
      shotClock
    );
    increaseMinutes(
      playersOnCourt[defense],
      playersOnBench[defense],
      shotClock
    );

    simPossession(playersOnCourt, playersOnBench, gameResult.teams);

    if (injuryCheck(playersOnCourt[offense])) {
      playersOnCourt[offense] = filterInjuredPlayers(playersOnCourt[offense]);
      setPlayingTimes([...playersOnCourt[offense], ...playersOnBench[offense]]);
      substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
    }
    if (injuryCheck(playersOnCourt[defense])) {
      playersOnCourt[defense] = filterInjuredPlayers(playersOnCourt[defense]);
      setPlayingTimes([...playersOnCourt[defense], ...playersOnBench[defense]]);
      substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
    }

    if (gameClock >= lengthOfQuarter) {
      gameResult.teams.forEach((team) => {
        team.ptsPerQuarter!.push(team.ptsThisQuarter!);
        team.ptsThisQuarter = 0;
      });

      currentQuarter++;
    }

    if (
      gameClock >= lengthOfQuarter &&
      currentQuarter > numQuarters &&
      gameResult.teams[0].points !== gameResult.teams[1].points
    ) {
      gameOver = true;
      // Since we changed the player's attributes, we have to change them back
      setHomeCourtAdvantage(awayPlayersFiltered, homePlayersFiltered);
    } else if (
      gameClock >= lengthOfQuarter &&
      currentQuarter > numQuarters &&
      gameResult.teams[0].points === gameResult.teams[1].points
    ) {
      gameResult.overtimes++;
      lengthOfQuarter = 300;
      gameClock = 0;
    } else if (gameClock >= lengthOfQuarter) {
      gameClock = 0;
    }
  }

  // Add the players game stats to their season stats
  for (let i = 0; i < players.length; i++) {
    players[i].map((player) => {
      let playerToAddStatsFrom = gameResult.teams[i].players!.find(
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
      if (playerToAddStatsFrom!.injury.games > 0) {
        playerToAddStatsFrom!.injury.games--;
        if (playerToAddStatsFrom!.injury.games === 0) {
          player.injury = {
            injured: false,
            games: 0,
            type: "",
          };
        } else {
          player.injury = playerToAddStatsFrom!.injury;
        }
      }
      if (playerToAddStatsFrom!.min > 0) {
        player.stats.gamesPlayed!++;
      }
    });
  }

  const winner =
    gameResult.teams[0].points > gameResult.teams[1].points ? 0 : 1;
  const conferenceRivals =
    teamsData[gameResult.teams[0].teamId!].conference ===
    teamsData[gameResult.teams[1].teamId!].conference;
  const divisionRivals =
    teamsData[gameResult.teams[0].teamId!].division ===
    teamsData[gameResult.teams[1].teamId!].division;

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
    teams[i].oppPoints += gameResult.teams[i].oppPoints;
    teams[i].oppFga += gameResult.teams[i].oppFga;
    teams[i].oppFgm += gameResult.teams[i].oppFgm;
    teams[i].oppThreepa += gameResult.teams[i].oppThreepa;
    teams[i].oppThreepm += gameResult.teams[i].oppThreepm;
    teams[i].oppFta += gameResult.teams[i].oppFta;
    teams[i].oppFtm += gameResult.teams[i].oppFtm;
    teams[i].oppOrb += gameResult.teams[i].oppOrb;
    teams[i].oppDrb += gameResult.teams[i].oppDrb;
    teams[i].oppTrb += gameResult.teams[i].oppTrb;
    teams[i].oppAst += gameResult.teams[i].oppAst;
    teams[i].oppStl += gameResult.teams[i].oppStl;
    teams[i].oppBlk += gameResult.teams[i].oppBlk;
    teams[i].oppTov += gameResult.teams[i].oppTov;
    if (i === winner) {
      teams[i].wins++;
      gameResult.winner = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!,
      };
      if (conferenceRivals) teams[i].conferenceWins++;
      if (divisionRivals) teams[i].divisionWins++;
    } else {
      teams[i].losses++;
      gameResult.loser = {
        points: gameResult.teams[i].points,
        teamId: gameResult.teams[i].teamId!,
      };
      if (conferenceRivals) teams[i].conferenceLosses++;
      if (divisionRivals) teams[i].divisionLosses++;
    }
  }

  return gameResult;
}

function changePossession() {
  let temp = offense;
  offense = defense;
  defense = temp;
}

function increaseMinutes(
  playersOnCourt: PlayerGameStats[],
  playersOnBench: PlayerGameStats[],
  count: number
) {
  playersOnCourt.forEach((player) => {
    player.min += count;
    player.courtTime++;
  });
  playersOnBench.forEach((player) => {
    player.benchTime++;
  });
}

function substitutePlayers(
  playersOnCourt: PlayerGameStats[],
  playersOnBench: PlayerGameStats[]
) {
  let playersToSubOut = playersOnCourt.filter(
    (player) => player.courtTime >= player.playingTime
  );

  if (playersToSubOut.length > 0 || playersOnCourt.length < 5) {
    playersToSubOut.forEach((player) => {
      player.courtTime = 0;
      const index = playersOnCourt.indexOf(player);
      playersOnCourt.splice(index, 1);
      playersOnBench.push(player);
    });
    let playersToSubIn = playersOnBench.filter((player) => {
      return player.benchTime >= player.restTime && player.playingTime > 0;
    });
    playersToSubIn.forEach((player) => {
      player.benchTime = 0;
      const index = playersOnBench.indexOf(player);
      playersOnBench.splice(index, 1);
      playersOnCourt.push(player);
    });
  }
}

// Sets the playing time for each player by quarter
function setPlayingTimes(players: PlayerGameStats[]) {
  players = players.sort((a, b) => {
    return a.overall > b.overall ? -1 : 1;
  });
  const quarterPossessions = 50;
  let possessionsToPlay = 37;
  const decrementor = 3;

  players.forEach((player, index) => {
    if (index > 9) return;
    player.playingTime = possessionsToPlay;
    player.restTime = quarterPossessions - possessionsToPlay;
    if (index !== 4) possessionsToPlay -= decrementor;
  });
}

// function setPlayingTimes(players: PlayerGameStats[]) {
//   // 720 seconds in a quarter
//   const lengthOfQuarter = 720;
//   let secondsToDistribute = lengthOfQuarter;
//   // The number one player on a team will want to play 9 to 10 minutes per quarter
//   let minSeconds = 540;
//   let maxSeconds = 600;

//   // Sort players by overall
//   players.sort((a, b) => {
//     return a.overall > b.overall ? -1 : 1;
//   });

//   // Distribute the seconds to each player decrementing min and max by 60 seconds per player
//   for (let i = 0; i < 10; i++) {
//     let secondsToPlay = getRandomNumberInRange(minSeconds, maxSeconds);
//     secondsToDistribute -= secondsToPlay;
//     players[i].playingTime = secondsToPlay;
//     minSeconds -= 60;
//     maxSeconds -= 60;
//   }

//   // There will still be time left after the above loop, so divide the remaining time by 10 and distribute evenly to every player
//   const remainingTime = (secondsToDistribute /= 10);
//   players.forEach((player) => {
//     player.playingTime += remainingTime;
//   });
// }

function setScoring(
  playersOnCourt: PlayerGameStats[],
  playersOnBench: PlayerGameStats[]
) {
  let modifier = 0.28;

  playersOnCourt.map((player) => {
    player.attr.scoring = Math.round(player.attr.offensiveAbility * modifier);
    modifier -= 0.04;
  });

  modifier = 0.2;
  playersOnBench.map((player) => {
    player.attr.scoring = Math.round(player.attr.offensiveAbility * modifier);
    modifier -= 0.038;
  });
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

function shootFreeThrows(
  playerToShoot: PlayerGameStats,
  num: number,
  teams: TeamStats[]
) {
  while (num > 0) {
    teams[offense].fta++;
    teams[defense].oppFta++;
    playerToShoot.fta++;
    if (
      getRandomNumber(100) <=
      playerToShoot.attr.freePercentage * freeThrowNormalizer
    ) {
      teams[offense].points++;
      teams[defense].oppPoints++;
      teams[offense].ptsThisQuarter!++;
      teams[offense].ftm++;
      teams[defense].oppFtm++;
      playerToShoot.points++;
      playerToShoot.ftm++;
    }
    num--;
  }
  changePossession();
}

function whoGetsRebound(
  offenseTeam: PlayerGameStats[],
  defenseTeam: PlayerGameStats[],
  teams: TeamStats[]
) {
  const offenseTotal = offenseTeam
    .map((player) => player.attr.rebounding * offensiveReboundNormalizer)
    .reduce((max, cur) => max + cur);
  const defenseTotal = defenseTeam
    .map((player) => player.attr.rebounding * defensiveReboundNormalizer)
    .reduce((max, cur) => max + cur);
  const total = offenseTotal + defenseTotal;

  const offensiveChance = Math.floor((offenseTotal / total) * 100);
  const defensiveChance = Math.floor((defenseTotal / total) * 100);
  const totalChance = offensiveChance + defensiveChance;

  let rng = getRandomNumber(totalChance);

  if (rng <= defensiveChance) {
    rng = getRandomNumber(defenseTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.rebounding * defensiveReboundNormalizer + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].drb++;
        defenseTeam[i].trb++;
        teams[defense].drb++;
        teams[offense].oppDrb++;
        teams[defense].trb++;
        teams[offense].oppTrb++;
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
      max = offenseTeam[i].attr.rebounding * offensiveReboundNormalizer + min;
      if (rng < max && rng >= min) {
        offenseTeam[i].orb++;
        offenseTeam[i].trb++;
        teams[offense].orb++;
        teams[defense].oppOrb++;
        teams[offense].trb++;
        teams[defense].oppTrb++;
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

  const teamPassing = team
    .map((player) => player.attr.passing * assistNormalizer)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(100) <= teamPassing) {
    const rng = getRandomNumber(teamPassing);
    let min = 0;
    let max = 0;
    for (let i = 0; i < team.length; i++) {
      min = max;
      max = team[i].attr.passing * assistNormalizer + min;
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
  teams: TeamStats[]
) {
  // Get the defense's total ability to steal
  const stealTotal = defenseTeam
    .map((player) => player.attr.stealing * stealNormalizer)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= stealTotal) {
    // Find out who turned the ball over
    const turnOverTotal = offenseTeam
      .map((player) => player.attr.ballHandling)
      .reduce((max, cur) => max + cur);
    whoTurnedOver(offenseTeam, teams, turnOverTotal);

    // Defense stole the ball. Find out who gets credited with the steal
    const rng = getRandomNumber(stealTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.stealing * stealNormalizer + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].stl++;
        teams[defense].stl++;
        teams[offense].oppStl++;
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
  teams: TeamStats[]
) {
  // Get the defese's total ability to block
  const blockTotal = defenseTeam
    .map((player) => player.attr.blocking * blockNormalizer)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= blockTotal) {
    // Defense blocked the ball. Find out who gets credited with the block
    const rng = getRandomNumber(blockTotal);
    let min = 0;
    let max = 0;
    for (let i = 0; i < defenseTeam.length; i++) {
      min = max;
      max = defenseTeam[i].attr.blocking * blockNormalizer + min;
      if (rng < max && rng >= min) {
        defenseTeam[i].blk++;
        teams[defense].blk++;
        teams[offense].oppBlk++;
        teams[offense].fga++;
        teams[defense].oppFga++;
        playerToShoot.fga++;
        return true;
      }
    }
  }

  return false;
}

function checkForTurnover(offenseTeam: PlayerGameStats[], teams: TeamStats[]) {
  const turnOverTotal = offenseTeam
    .map((player) => player.attr.ballHandling)
    .reduce((max, cur) => max + cur);

  if (getRandomNumber(1000) <= turnOverTotal) {
    // Offense commited a turnover. Find out who gets credited with the turnover
    whoTurnedOver(offenseTeam, teams, turnOverTotal);
    changePossession();
  }

  return false;
}

function whoTurnedOver(
  offenseTeam: PlayerGameStats[],
  teams: TeamStats[],
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
      teams[offense].tov++;
      teams[defense].oppTov++;
      return true;
    }
  }
}

function simPossession(
  playersOnCourt: PlayerGameStats[][],
  playersOnBench: PlayerGameStats[][],
  teams: TeamStats[]
) {
  if (checkForSteal(playersOnCourt[defense], playersOnCourt[offense], teams)) {
    return;
  }

  if (checkForTurnover(playersOnCourt[offense], teams)) {
    substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
    substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
    return;
  }

  const playerToShoot = whoShoots(playersOnCourt[offense]);

  const playerToAssist = whoAssists(playersOnCourt[offense], playerToShoot);

  let shotModifier = 0;
  if (playerToAssist) {
    shotModifier = 10;
  }

  let fouled = false;

  if (getRandomNumber(1000) <= playerToShoot.attr.twoRate) {
    if (checkForBlock(playersOnCourt[defense], playerToShoot, teams)) {
      whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], teams);
      return;
    }
    if (getRandomNumber(100) <= 35) fouled = true;
    if (
      getRandomNumber(100) <=
      Math.round(
        (playerToShoot.attr.twoPercentage + shotModifier) * twoPointNormalizer
      )
    ) {
      teams[offense].points += 2;
      teams[defense].oppPoints += 2;
      teams[offense].ptsThisQuarter! += 2;
      teams[offense].fga++;
      teams[defense].oppFga++;
      teams[offense].fgm++;
      teams[defense].oppFgm++;
      playerToShoot!.points += 2;
      playerToShoot!.fga++;
      playerToShoot!.fgm++;
      if (playerToAssist) {
        teams[offense].ast++;
        teams[defense].oppAst++;
        playerToAssist.ast++;
      }

      if (fouled) {
        shootFreeThrows(playerToShoot, 1, teams);
        substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
        substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
      }
    } else {
      if (fouled) {
        shootFreeThrows(playerToShoot, 2, teams);
        substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
        substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
      } else {
        teams[offense].fga++;
        teams[defense].oppFga++;
        playerToShoot!.fga++;
        whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], teams);
      }
    }
  } else {
    if (getRandomNumber(100) <= 1) fouled = true;
    if (
      getRandomNumber(100) <=
      Math.round(
        (playerToShoot.attr.threePercentage + shotModifier) *
          threePointNormalizer
      )
    ) {
      teams[offense].points += 3;
      teams[defense].oppPoints += 3;
      teams[offense].ptsThisQuarter! += 3;
      teams[offense].fga++;
      teams[defense].oppFga++;
      teams[offense].fgm++;
      teams[defense].oppFgm++;
      teams[offense].threepa++;
      teams[defense].oppThreepa++;
      teams[offense].threepm++;
      teams[defense].oppThreepm++;
      playerToShoot!.points += 3;
      playerToShoot!.fga++;
      playerToShoot!.fgm++;
      playerToShoot!.threepa++;
      playerToShoot!.threepm++;
      if (playerToAssist) {
        teams[offense].ast++;
        teams[defense].oppAst++;
        playerToAssist.ast++;
      }
      if (fouled) {
        shootFreeThrows(playerToShoot, 1, teams);
        substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
        substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
      }
    } else {
      if (fouled) {
        shootFreeThrows(playerToShoot, 3, teams);
        substitutePlayers(playersOnCourt[offense], playersOnBench[offense]);
        substitutePlayers(playersOnCourt[defense], playersOnBench[defense]);
      } else {
        teams[offense].fga++;
        teams[defense].oppFga++;
        teams[offense].threepa++;
        teams[defense].oppThreepa++;
        playerToShoot!.fga++;
        playerToShoot!.threepa++;
        whoGetsRebound(playersOnCourt[offense], playersOnCourt[defense], teams);
      }
    }
  }
}

function injuryCheck(playersOnCourt: PlayerGameStats[]) {
  const injuryRate = 2;

  if (getRandomNumber(10000) <= injuryRate) {
    const injuryRoll = getRandomNumber(injuries.length);
    playersOnCourt[getRandomNumber(playersOnCourt.length)].injury = {
      injured: true,
      type: injuries[injuryRoll].type,
      games: injuries[injuryRoll].games,
    };

    return true;
  }

  return false;
}

function filterInjuredPlayers(players: PlayerGameStats[]) {
  return players.filter((player) => player.injury.injured === false);
}

function setHomeCourtAdvantage(
  homePlayers: PlayerGameStats[],
  awayPlayers: PlayerGameStats[]
) {
  homePlayers.forEach((player) => {
    for (let attr in player.attr) {
      // @ts-ignore
      player.attr[attr]++;
    }
  });
  awayPlayers.forEach((player) => {
    for (let attr in player.attr) {
      // @ts-ignore
      player.attr[attr]--;
    }
  });
}

export default simulate;
