import { Component, OnInit } from '@angular/core';
import { Hole } from '../models/hole';
import { ScorecardService } from './scorecard.service';
import { Scorecard } from '../models/scorecard';
import { FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { ExampleDataSource } from './example-source-data';
import { element } from 'protractor';
import { ErrorStateMatcher } from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  scoreForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  holeCargo: Scorecard = { holes: [] };
  initialData: Hole[] = [
    { hole: 1, par: 5, yardage: 543, strokeIndex: 14 },
    { hole: 2, par: 3, yardage: 123, strokeIndex: 3 },
    { hole: 3, par: 4, yardage: 432, strokeIndex: 12 },
    { hole: 4, par: 4, yardage: 387, strokeIndex: 7 },
    { hole: 5, par: 3, yardage: 112, strokeIndex: 11 }
  ];


  dataSource = new ExampleDataSource(this.initialData);

  displayedColumns: string[] = ['hole', 'par', 'yardage', 'strokeIndex', 'netScore', 'points', 'score'];

  update(hole: Hole, score: number) {
    if (score == null) { return; }
    // copy and mutate
    const copy = this.dataSource.data().slice();
    hole.score = score;
    this.dataSource.update(copy);
  }

  constructor(private service: ScorecardService, private fb: FormBuilder) { }

  ngOnInit() {

    this.scoreForm = this.fb.group({
      handicap: ['', [Validators.required, Validators.min(0), Validators.max(72)]]
    });
  }


  obtainScore() {

    console.log("Obtain score clicked")
    
    const handicap = +this.scoreForm.controls.handicap.value;
    console.log(`handicap value is: ${handicap}`);

    this.holeCargo.holes = { ...this.holeCargo.holes, ...this.dataSource.data() };

    this.service.getScorecard(this.holeCargo, handicap).subscribe(scorecard => {
      this.dataSource = new ExampleDataSource(scorecard.holes);

    });


  }

  clearForm() {

    this.dataSource.data().map(
      (hole) => {
        hole.netScore = null;
        hole.points = null;
        hole.score = null;
      }
    );

  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
