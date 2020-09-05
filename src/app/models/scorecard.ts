import { Hole } from './hole';

export class Scorecard{
    scorecardName?: string;
    holes?: Hole[];
    totalPar?: number;
    totalYardage?: number;
    totalPoints?: number;
    totalNetscore?: number;
    totalScore?: number;
}
