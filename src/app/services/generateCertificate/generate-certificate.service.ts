import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { AjaxClient } from 'ajax-client';
import { JsonPipe } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class GenerateCertificateService {
  url="http://52.247.56.140:8080"
  constructor(private http: HttpClient) { 
    if(location.host=="www.fsfb.org.co"){
      this.url="https://www.fsfb.org.co/terceros"
    }
  }


  queryCuentas(listYears: any): any {

    let header = { headers:new HttpHeaders({'Content-Type':'application/json'})};

    return this.http.post(this.url+`/getCuentasParticipacion`, listYears, header);

  }


  queryCertificate(listYears: any): any {

    let header = { headers:new HttpHeaders({'Content-Type':'application/json'})};

    return this.http.post(this.url+`/listYears`, listYears, header);

  }

  listMonths(listYears): any {


    return this.http.post(this.url+`/listMonths`, listYears);

  }

  generateCertificate(dataList): any {



    return this.http.post(this.url+`/generateCertificate`, dataList);

  }

  CertificateByYear(data){

    return this.http.post(this.url+`/generateCertificateByYear`, data);

  }

  listMunicipalities(data){

    return this.http.post(this.url+`/listMunicipalities`, data);

  }


  datosDataPJ(data){

    return this.http.post(this.url+`/getDataPJ`, data);
  }

  datosDataPN(data){

    return this.http.post(this.url+`/getDataPN`, data);
  }


}


