export class TeamInfo {
  constructor(
    public disqualificationReason: string | null,
    public owner: number | null,
    public playerCount: number,
    public spawnCount = 0
  ) {}
}
