import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course';
import { ScorecardService } from '../scorecard/scorecard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courses: Course[];
  
  constructor(private scorecardService: ScorecardService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.scorecardService.getCourses().subscribe(courses => {
      this.courses = courses;
      console.log(`Courses in component: ${JSON.stringify(this.courses)}`);
    });
    
  }

}
