import Dexie from "dexie";

export interface League {
  leagueId?: number;
  season: number;
  day: number;
  name: string;
}

class Meta extends Dexie {
  leagues!: Dexie.Table<League, number>;

  constructor() {
    super("Meta");

    this.version(1).stores({
      leagues: "++leagueId, name",
    });
  }
}

export const meta = new Meta();
