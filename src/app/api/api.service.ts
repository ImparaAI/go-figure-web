import { Injectable } from '@angular/core';

import { HttpService } from '@app/http/http.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpService) { }

  submission(message: string): Promise<any> {
    return this.http.get('/submission/' + message,  null,  {responseType: 'text'}).toPromise();
  }


}
