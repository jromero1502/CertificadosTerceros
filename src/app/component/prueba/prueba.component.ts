import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GenerateCertificateService } from 'src/app/services/generateCertificate/generate-certificate.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  datos:any = {};
  dataUsuarios: any =  {};

  constructor(private generateCertificate: GenerateCertificateService) { }

  ngOnInit(): void {

    this.datos.crMunicipio = 1;
    this.datos.monthTwo = "ABRIL";
    this.datos.nitTercero = "8603506247";
    this.datos.monthOne = "MARZO";
    this.datos.typeCertificate = 1;
    this.datos.year = 2012;

    console.log(this.datos);


    this.generateCertificate.generateCertificate(this.datos).subscribe(
      (data) => {
        this.dataUsuarios = data;
        console.log(this.dataUsuarios);


    }, (error: HttpErrorResponse) => {
       console.log(error);

    });



  }

}
