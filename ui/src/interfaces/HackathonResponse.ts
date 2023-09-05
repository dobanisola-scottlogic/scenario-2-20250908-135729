export interface Milestone {
    id: string;
    milestoneClassName: string;
    timeStamp: number;
}

interface Milestones {
    [key: string]: Milestone;
}

export type GetMilestoneResponse = Array<Milestones>;

export interface Hackathon {
    id: string;
    name: string;
    games: null;
    teams: null;
    currentMilestoneClassName: string;
    currentMilestoneMap: string;
}