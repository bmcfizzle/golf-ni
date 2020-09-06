import {Component, OnInit} from '@angular/core';
import {ScorecardService} from './scorecard.service';
import {Scorecard} from '../models/scorecard';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
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
 
  scoreCard: Scorecard = {
    holes: [],
    totalScore: 0,
    totalNetscore: 0,
   totalPoints: 0
  };

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['hole', 'par', 'yardage', 'strokeIndex', 'score', 'netScore', 'points'];

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
 

    this.scoreForm = this.fb.group({
      handicap: ['', [Validators.required, Validators.min(0), Validators.max(72)]],
      holes: this.fb.array([])
    });

    this.route.paramMap.subscribe((params) => {
      this.service.getCourse(params.get('id')).subscribe((c) => {
        this.course = c;
        this.service.getCourseHolesAsFormArray(params.get('id')).subscribe(holes => {
          this.scoreForm.setControl('holes', holes);
          this.dataSource = new MatTableDataSource((this.scoreForm.get('holes')as FormArray).controls);
        })
        dialogRef.close();
      });
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
    this.scoreCard.holes = {...this.scoreCard.holes, ...this.scoreForm.controls.holes.value};
    
    this.service.getScorecard(this.scoreCard, handicap).subscribe(processedScorecard => {
     this.scoreForm.get('holes').patchValue(processedScorecard.holes);
     this.scoreCard.totalNetscore = processedScorecard.totalNetscore;
     this.scoreCard.totalPoints = processedScorecard.totalPoints;
     this.scoreCard.totalScore = processedScorecard.totalScore;
     dialogRef.close();
    });
  }

  clearHandicap() {
    this.scoreForm.reset();
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
