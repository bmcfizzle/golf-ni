import { FormGroup, FormControl, Validators } from '@angular/forms';

export class Hole {
hole: number;
par: number;
yardage?: number;
strokeIndex: number;
score?: number;
netScore?: number;
points?: number;

static asFormGroup(hole: Hole): FormGroup {
    const fg = new FormGroup({
      hole: new FormControl(hole.hole),
      par: new FormControl(hole.par),
      yardage: new FormControl(hole.yardage),
      strokeIndex: new FormControl(hole.strokeIndex),
      score: new FormControl(hole.score),
      netScore: new FormControl(hole.netScore),
      points: new FormControl(hole.points),
      
    });
    return fg;
  }
}

