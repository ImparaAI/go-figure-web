import { Subject }    from 'rxjs';
import { Injectable } from '@angular/core';

import { HttpService } from '@app/api/http.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  public drawingCreated: Subject<int> = new Subject();

  constructor(private http: HttpService) { }

  getDrawing(id: number): Promise<any> {
    return this.http.get('/drawing/' + id).toPromise();
  }

  getRecentDrawings(): Promise<any> {
    return this.http.get('/drawings/recent').toPromise();
  }

  createDrawing = (points: object[]): Promise<any> => {
  	return this.http.post('/drawing', {points}).toPromise().then((value) => {
      this.drawingCreated.next(true);

      return value;
    });
  }

}