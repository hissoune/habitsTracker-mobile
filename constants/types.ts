

export type User ={
    _id?:string
    name:string,
    email:string,
    password:string,
    birthDay:Date|null,
    image:string
    role?:string
}

export enum Frequency {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly'
}

export enum Status {
    Active = 'active',
    Completed = 'completed',
    Failed = 'failed'
}



export type Habit=  {
    _id?:string
    userId?: string;
    progress?: number;
    title: string;
    description?: string;
    frequency: Frequency;
    reminderTime?: Date;
    repeats:number;
    sucsess?:number;
    fails?:number;
    status?: Status;
    createdAt: Date;
    updatedAt: Date;
}
    export type progress ={
    _id:string
    userId?:string,
    habitId?:string,
    date?:Date,
    streak?:number,
    status?:boolean

    }

     export type chalengeProgress = {
        _id:string
        userId?:string,
        habitId?:string,
        streak?:number,
        isDone?:boolean
     }

    export type chalenge = {
        _id?:string,
        title: string;
        description: string;
        image?: string;
        creator?: User;
        participants?: { userId: string, progress: number,userDetails?:User }[];
        frequency:string,
        repeats:number;
        endDate: string;
        startDate: string;
    }