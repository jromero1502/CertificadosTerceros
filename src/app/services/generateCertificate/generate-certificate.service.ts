import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";
import { AjaxClient } from 'ajax-client';
import { JsonPipe } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class GenerateCertificateService {
  // url="http://localhost:8080"
  url="http://52.247.56.140:8080/terceros"
  constructor(private http: HttpClient) { 
    if(location.host=="www.fsfb.org.co"){
      this.url="https://www.fsfb.org.co/terceros"
    }
  }

  queryCuentas(listYears: any): any {
    let header = { headers:new HttpHeaders({'Content-Type':'application/json'}), withCredentials: true};

    return this.http.post(this.url+`/getCuentasParticipacion`, listYears, header);

  }


  queryCertificate(listYears: any): any {
    let header = { headers:new HttpHeaders({'Content-Type':'application/json'}), withCredentials: true};

    return this.http.post(this.url+`/listYears`, listYears, header);

  }

  listMonths(listYears): any {
    return this.http.post(this.url+`/listMonths`, listYears, {withCredentials: true});

  }

  generateCertificate(dataList): any {
    return this.http.post(this.url+`/generateCertificate`, dataList, {withCredentials: true});
  }

  CertificateByYear(data){
    return this.http.post(this.url+`/generateCertificateByYear`, data, {withCredentials: true});
  }

  listMunicipalities(data){
    return this.http.post(this.url+`/listMunicipalities`, data, {withCredentials: true});
  }

  datosDataPJ(data){
    return this.http.post(this.url+`/getDataPJ`, data, {withCredentials: true});
  }

  datosDataPN(data){
    return this.http.post(this.url+`/getDataPN`, data, {withCredentials: true});
  }

  logout() {
    window.location.href = this.url + "/logout"
  }

  login(credentials) {
    return this.http.post(this.url + '/login', credentials, {withCredentials: true}).subscribe(() => console.log('logeado'))
  }
}


