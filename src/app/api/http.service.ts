import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor(private http: HttpClient) { }

  get(uri: string, params?: object, options?: object): Observable<any> {
    return this.http.get(this.buildUrl(uri), options || {params});
  }

  post(uri: string, params?: object, options?: object): Observable<any> {
    return this.http.post(this.buildUrl(uri), params || {}, options);
  }

  delete(uri: string, params?: object): Observable<any> {
    return this.http.request('delete', this.buildUrl(uri), {body: params});
  }

  buildUrl(uri: string): string {
    return environment.apiUrl + uri;
  }

}
