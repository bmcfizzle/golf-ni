import { Component, OnInit } from '@angular/core';
import { Hole } from '../models/hole';
import { ScorecardService } from './scorecard.service';
import { Holes } from '../models/holes';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ExampleDataSource } from './example-source-data';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  scoreForm: FormGroup;
 
  holeCargo: Holes = {holes: []};
  initialData: Hole[] = [
      { hole: 1, par: 5, score: 0, strokeIndex: 14 },
      { hole: 2, par: 3, score: 0, strokeIndex: 3 },
      { hole: 3, par: 4, score: 0, strokeIndex: 12 },
      { hole: 4, par: 4, score: 0, strokeIndex: 7 },
      { hole: 5, par: 3, score: 0, strokeIndex: 11 }
    ];
  

  dataSource = new ExampleDataSource(this.initialData);

  displayedColumns: string[] = ['hole', 'par', 'strokeIndex', 'netScore', 'points', 'score'];

  update(hole: Hole, score: number) {
    if (score == null) { return; }
    // copy and mutate
    const copy = this.dataSource.data().slice();
    hole.score = score;
    this.dataSource.update(copy);
  }

  constructor(private service: ScorecardService, private fb: FormBuilder) { }

  ngOnInit() {
    
    console.log(this.dataSource);
  }


  obtainScore() {

    console.log("Obtain score clicked")

    this.holeCargo.holes = {...this.holeCargo.holes, ...this.dataSource.data()};

    this.service.getScorecard(this.holeCargo).subscribe(theHoles => {
      this.dataSource = new ExampleDataSource(theHoles.holes);
      
    });


  }
}
