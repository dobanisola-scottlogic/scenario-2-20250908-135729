export interface Milestone {
    id: string;
    milestoneClassName: string;
    timeStamp: number;
}

type Milestones = Record<string, Milestone>;

export type GetMilestoneResponse = Milestones[];