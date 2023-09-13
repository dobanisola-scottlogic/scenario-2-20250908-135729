export interface HackathonResponse {
    id: string;
    name: string;
    games: null; // Old service separates games into separate calls so returns null
    teams: null; // Old service separates teams into separate calls so returns null
    currentMilestoneClassName: string;
    currentMilestoneMap: string;
}
