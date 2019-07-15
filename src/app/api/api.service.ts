import { Injectable } from '@angular/core';

import { HttpService } from '@app/http/http.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpService) { }

  getSubmission(message: string): Promise<any> {
    return this.http.get('/submission/' + message,  null,  {responseType: 'text'}).toPromise();
  }

  createSubmission(points: object[]): Promise<any> {
  	return this.http.post('/submission', {points}).toPromise();
  }


}
