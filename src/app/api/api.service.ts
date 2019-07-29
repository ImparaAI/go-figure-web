import { Injectable } from '@angular/core';

import { HttpService } from '@app/http/http.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpService) { }

  getDrawing(id: number): Promise<any> {
    return this.http.get('/drawing/' + id).toPromise();
  }

  createDrawing(points: object[], image: string): Promise<any> {
  	return this.http.post('/drawing', {points, image}).toPromise();
  }

}
