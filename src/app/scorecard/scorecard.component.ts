import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Hole} from '../models/hole';
import {ScorecardService} from './scorecard.service';
import {Scorecard} from '../models/scorecard';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ExampleDataSource} from './example-source-data';
import {MatDialogRef, MatDialog, ErrorStateMatcher, MatPaginator, PageEvent, MatTableDataSource} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ProgressSpinnerComponent} from '../progress-spinner/progress-spinner.component';
import {Course} from '../models/course';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})

export class ScorecardComponent implements OnInit {

  scoreForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  course: Course = {
    scorecard: {
      totalYardage: 0,
      totalPar: 0
    }
  };
  holeCargo: Scorecard = {holes: []};
  scoreCard: Scorecard = {
    holes: [],
    totalScore: 0,
    totalNetscore: 0,
   totalPoints: 0
  };
  dataSource;
  displayedColumns: string[] = ['hole', 'par', 'yardage', 'strokeIndex', 'score', 'netScore', 'points'];

  update(hole: Hole, score: number) {
    if (score == null) {
      return;
    }
    // copy and mutate
    const copy = this.dataSource.data().slice();
    hole.score = score;
    this.dataSource.update(copy);
  }

  constructor(private service: ScorecardService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(
      ProgressSpinnerComponent,
      {
        panelClass: 'transparent',
        disableClose: true
      });

    this.route.paramMap.subscribe((params) => {
      this.service.getCourse(params.get('id')).subscribe((c) => {
        this.course = c;
        this.dataSource = new ExampleDataSource(this.course.scorecard.holes);
        dialogRef.close();
      });
    });

    this.scoreForm = this.fb.group({
      handicap: ['', [Validators.required, Validators.min(0), Validators.max(72)]]
    });
  }

  obtainScore() {
    const dialogRef: MatDialogRef<ProgressSpinnerComponent> = this.dialog.open(
      ProgressSpinnerComponent,
      {
        panelClass: 'transparent',
        disableClose: true
      });
    const handicap = +this.scoreForm.controls.handicap.value;
    this.holeCargo.holes = {...this.holeCargo.holes, ...this.dataSource.data()};

    this.service.getScorecard(this.holeCargo, handicap).subscribe(scorecard => {
      this.dataSource = new ExampleDataSource(scorecard.holes);
      this.scoreCard.totalNetscore = scorecard.totalNetscore;
      this.scoreCard.totalPoints = scorecard.totalPoints;
      this.scoreCard.totalScore = scorecard.totalScore;
      dialogRef.close();
    });
  }

  clearHandicap() {
    this.scoreForm.reset();
  }

  clearForm() {
    this.dataSource.data().map(
      (hole) => {
        hole.netScore = null;
        hole.points = null;
        hole.score = null;
        this.scoreCard.totalScore = 0;
        this.scoreCard.totalNetscore = 0;
        this.scoreCard.totalPoints = 0;
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
