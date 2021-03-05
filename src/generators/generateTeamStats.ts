import { TeamStats } from "../types";
import teamsData from "../data/teams";

function generateTeamStats(): TeamStats[] {
  const teamSkeleton: TeamStats = {
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
    wins: 0,
    losses: 0,
  };
  const teams: TeamStats[] = [];

  for (let i = 0; i < 32; i++) {
    teams.push({ ...teamSkeleton, teamId: i, abbrev: teamsData[i].abbrev });
  }

  return teams;
}

export default generateTeamStats;
