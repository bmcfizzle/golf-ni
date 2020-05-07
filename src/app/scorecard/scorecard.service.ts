import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError, of} from 'rxjs';
import { Scorecard } from '../models/scorecard';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
    providedIn: 'root'
  }
)

export class ScorecardService {

  private scorecardURL = `https://flkkk2w6u9.execute-api.us-east-1.amazonaws.com/dev/golf-ni`;

  constructor(private http: HttpClient,
  ) {

  }

  getScorecard(scorecard: Scorecard, handicap: number): Observable<Scorecard> {
    const url = `${this.scorecardURL}/${handicap}`;
    let body = JSON.stringify(scorecard);
    console.log(body);
    return this.http.post<Scorecard>(url, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
