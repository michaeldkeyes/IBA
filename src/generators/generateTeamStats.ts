import { TeamStats } from "../types";

function generateTeamStats(): TeamStats[] {
  const teamSkeleton: TeamStats = {
    points: 0,
    fga: 0,
    fgm: 0,
    wins: 0,
    losses: 0,
  };
  const teams: TeamStats[] = [];

  for (let i = 0; i < 32; i++) {
    teams.push({ ...teamSkeleton, teamId: i });
  }

  return teams;
}

export default generateTeamStats;
