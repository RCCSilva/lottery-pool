// Shared types that will be used by the frontend
export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export type LotteryPool = {
    id: string;
    name: string;
    description: string;
    participants: string[];
    createdAt: Date;
}

