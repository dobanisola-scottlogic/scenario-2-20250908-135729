export interface Milestone {
    id: string;
    milestoneClassName: string;
    timeStamp: number;
}

type Milestones = Record<string, Milestone>;

export type GetMilestoneResponse = Milestones[];

export interface CreateHackathonServiceResponse {
    id: string;
    name: string;
    games: null; // Old service separates games into separate calls so returns null
    teams: null; // Old service separates teams into separate calls so returns null
    currentMilestoneClassName: string;
    currentMilestoneMap: string;
}
