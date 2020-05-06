import { Component, OnInit } from '@angular/core';
import { Hole } from '../models/hole';
import { ScorecardService } from './scorecard.service';
import { Holes } from '../models/holes';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  scoreForm: FormGroup;
  dataSource;

  holesTown: Holes = {
    holes: [
      { hole: 1, par: 5, score: 0, strokeIndex: 14 },
      { hole: 2, par: 3, score: 0, strokeIndex: 3 },
      { hole: 3, par: 4, score: 0, strokeIndex: 12},
      { hole: 4, par: 4, score: 0, strokeIndex: 7},
      { hole: 5, par: 3, score: 0, strokeIndex: 11 }
    ]
  };


  displayedColumns: string[] = ['hole', 'par', 'strokeIndex', 'netScore', 'points', 'score'];


  constructor(private service: ScorecardService, private fb: FormBuilder) { }


  ngOnInit() {
    this.scoreForm = this.fb.group({
      holes: this.fb.array([])
    });

    this.patchResultList();

    this.dataSource = this.holes.controls;
    console.log(`Hi - nginit - this.holes is ${this.holes}`);
    console.log(`Hi - nginit - this scoreform is ${this.scoreForm}`);
  }



  get holes(): FormArray {
    return this.scoreForm.get('holes') as FormArray;
  }

  obtainScore() {

    const m = { ...this.holesTown, ...this.scoreForm.value };
    console.log(`Const m is: ${m}`);

    this.service.getScorecard(m).subscribe(theHoles => {
      this.holesTown = theHoles;
      this.patchResultList();
      console.log(`Holestown is: ${JSON.stringify(this.holesTown)}`);
    });
    

  }

  patchResultList() {
    this.scoreForm.patchValue(this.holesTown);
    let control = this.scoreForm.get('holes') as FormArray;
    // Following is also correct
    // let control = <FormArray>this.form.controls['resultList'];

    this.holesTown.holes.forEach(x => {
      control.push(this.fb.group({
        hole: x.hole,
        par: x.par,
        score: x.score,
        strokeIndex: x.strokeIndex,
        netScore: x.netScore,
        points: x.points

      }));
    });
  }

}

