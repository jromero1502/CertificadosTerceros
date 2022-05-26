import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GenerateCertificateService } from 'src/app/services/generateCertificate/generate-certificate.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import swal from 'sweetalert2'
import { invalid } from '@angular/compiler/src/render3/view/util';
import * as trans from 'numero-a-letras'
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { Console } from 'console';
@Component({
  selector: 'app-generar-certificado',
  templateUrl: './generar-certificado.component.html',
  styleUrls: ['./generar-certificado.component.css'],

})

export class GenerarCertificadoComponent implements OnInit {

  resolvePassword: FormGroup;
  hide = true;
  hideConfirm = true;
  periodicidad = true;
  document = 'Seleccione';
  certifiedYearValue = 'Seleccione';
  certifiedPeriodValue = 'Seleccione';
  certifiedMunicipalityValue = 'Seleccione';
  certifiedMunicipalValue = 'Seleccione';
  descarga = false;
  banderaAgregado = false;
  agregado = [];
  seleccionPeriodicidad: any;

  datos: any = {};
  servicios: any[] = [];
  filteredServList: Observable<any>;
  myControl = new FormControl();
  period: any[] = [];
  dataListCertificate: any[] = [];
  listaDatosAnual: any = {};
  filteredPeriod: any[] = [];
  filteredMunicipal: any = {}
  fecha = new Date;
  dataCuentasParticipacion: any = {};
  dataUsuariosPN: any = {};
  dataUsuariosPJ: any = {};

  userProviderNit: string;

  selectPeriodicidad = 'Seleccione';
  PeriodicityDos;

  fechaPeriodoUno: any = {};
  fechaPeriodoDos: any = {};


  iconPass: string = 'visibility_off';
  view: string = 'password';
  uid: "agarcia1";
  certifiedYear = false;
  certifiedPeriodicity = false;
  certifiedPeriodicityDos = false;
  certifiedPeriod = false;
  certifiedMunicipality = false;
  certifiedMunicipalityDos = false;

  certifiedYearSpinner = false;

  datosPrueba: any = {};
  dataUsuariosPrueba: any = {};

  validacionMunicipioUno = true;
  validacionMunicipioDos = true;
  validacionMunicipioTres = true;
  fechaUno: any;
  fechaDos: any;
  form: FormGroup;
  currentUser: string = (<any>window)["ibmPortalConfig"].currentUser



  constructor(private fb: FormBuilder,
    private generateCertificate: GenerateCertificateService,
    public spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    //this.generateCertificate.login("eyJ1c2VybmFtZSI6ImFkbWludGVyY2Vyb3MiLCJwYXNzd29yZCI6ImFkbWludGVyY2Vyb3MifQ==")
    this.filterCertificate();
    //this.userProviderNit = this.currentUser
    this.userProviderNit = ""
    this.buscarPersona()
  }

  filterCertificate() {
    this.form= this.fb.group({
      userProviderNit: ['',[Validators.required]]
    });
    this.resolvePassword = this.fb.group({
      servicio: ['',[Validators.required]],
      period: ['',[Validators.required]],
      periocidad: ['',[Validators.required]],
      municipio: ['',[Validators.required]],
      documentType:['',[Validators.required]]
    });

  }
  mostrar=false;
  buscarPersona() {
    this.filterCertificate();
    this.datos.nitTercero = this.userProviderNit;
    this.generateCertificate.datosDataPJ(this.datos.nitTercero).subscribe(
      (data) => {
        this.dataUsuariosPJ = data;
        this.mostrar=true
      }, (error: HttpErrorResponse) => {

        this.dataUsuariosPJ = null;
        this.generateCertificate.datosDataPN(this.datos.nitTercero).subscribe(
          (data) => {
            this.dataUsuariosPN = data;
            this.mostrar=true
          }, (error: HttpErrorResponse) => {

            this.dataUsuariosPN = null;
            if (error.status != 401) {
              swal.fire({
                title: 'Error',
                text: 'El usuario no se ha encontrado.',
                icon: 'error',
              });
            }

          });
      });

    
      
  }

  checkList(itemsChek: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const item = control.value;
      if (item.length > 0 && !itemsChek.includes(item)) {
        return { 'matchList': item };
      }
      return null;
    };
  }

  onSubmit(): void {

    // if (this.resolvePassword.valid) {

    this.downloadPDF();

    //  }

  }

  // Seleccion tipo certificado

  selectDocumentType(document: any) {

    if (document === 1 || document === 2) {

      this.certifiedYearSpinner = true;
      this.certifiedYearSpinner = true;
      this.certifiedPeriodicity = false;
      this.certifiedPeriod = false;
      this.certifiedPeriodicityDos = false;
      this.certifiedMunicipality = false;
      this.certifiedMunicipalityDos = false;
      this.descarga = false;


      this.datos.typeCertificate = document;

      this.spinnerService.show();
      this.generateCertificate.queryCertificate(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.certifiedYear = true;
          this.servicios = data.sort(function (a, b) {

            if (a.year > b.year) {
              return -1;
            }

          }).slice(0, 10);

        }, (error: HttpErrorResponse) => {
          this.spinnerService.hide();
          console.log(error);
          this.certifiedYear = false;

          swal.fire({
            title: '',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });

        });

    } else if (document === 3 || document === 4) {

      this.certifiedYearSpinner = true;
      this.certifiedYearSpinner = true;
      this.certifiedPeriodicity = false;
      this.certifiedPeriod = false;
      this.certifiedPeriodicityDos = false;
      this.certifiedMunicipality = false;
      this.certifiedMunicipalityDos = false;
      this.descarga = false;

      this.datos.typeCertificate = document;

      this.spinnerService.show();
      this.generateCertificate.queryCertificate(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.certifiedYear = true;

          // Selecciona la cantidad de años a mostrar
          this.servicios = data.sort(function (a, b) {
            if (a.year > b.year) {
              return -1;
            }
          }).slice(0, 10);

        }, (error: HttpErrorResponse) => {
          this.spinnerService.hide();
          console.log(error);
          this.certifiedYear = false;


          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });

        });

    } else if (document === 5) {

      this.certifiedYearSpinner = true;
      this.certifiedYearSpinner = true;
      this.certifiedPeriodicity = false;
      this.certifiedPeriod = false;
      this.certifiedPeriodicityDos = false;
      this.certifiedMunicipality = false;
      this.certifiedMunicipalityDos = false;
      this.descarga = false;
      this.datos.typeCertificate = document;
      this.datos.identificacion = this.datos.nitTercero;
      this.spinnerService.show();
      this.generateCertificate.queryCuentas(this.datos).subscribe(
        (data) => {
          try {
            this.spinnerService.hide();
            this.certifiedYear = true;
            this.servicios = [];
            for (let index = 0; index < data.anios.length; index++) {
              this.servicios.push({ "year": data.anios[index] });
            }
  
            this.servicios = this.servicios.sort(function (a, b) {
              if (a.year > b.year) {
                return -1;
              }
            }).slice(0, 10);
            this.dataCuentasParticipacion = data;
          } catch(e) {
            console.log("No hay cuentas de participacion")
          }

        }, (error: HttpErrorResponse) => {
          this.spinnerService.hide();
          console.log(error);

          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });

        });

    }

  }

  // Seleccion año certificado

  selectCertifiedYear(document): any {

    this.datos.year = parseInt(document.year);

    if (this.datos.typeCertificate === 1 || this.datos.typeCertificate === 2) {

      this.certifiedPeriodicityDos = false;

      this.datos.crMunicipio = 3;
      this.spinnerService.show();
      this.generateCertificate.CertificateByYear(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.certifiedPeriodicity = true;

        }, (error: HttpErrorResponse) => {

          this.spinnerService.hide();
          this.validacionMunicipioTres = false;
          this.certifiedPeriodicity = true;
        });

    } else if (this.datos.typeCertificate === 3 || this.datos.typeCertificate === 4) {

      this.certifiedPeriodicity = false;
      this.certifiedPeriodicityDos = true;

    } else if (this.datos.typeCertificate === 5) {

      this.descarga = true;
    }
  }


  selectPeriodicy(document: any) {

    this.seleccionPeriodicidad = document;

    if (document === 1) {

      // Seleccion anual
      this.certifiedPeriod = false;
      this.certifiedMunicipalityDos = false;
      this.descarga = false;

      this.datos.crMunicipio = 2;

      this.spinnerService.show();

      this.generateCertificate.CertificateByYear(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.certifiedMunicipality = true;
          this.validacionMunicipioDos === true;


          if (this.validacionMunicipioDos === false && this.validacionMunicipioTres === false) {

            this.validacionMunicipioUno = true;

          } else if (this.validacionMunicipioUno === false && this.validacionMunicipioTres === false) {

            this.validacionMunicipioDos = true;

          } else if (this.validacionMunicipioUno === false && this.validacionMunicipioDos === false) {

            this.validacionMunicipioTres = true;

          } else if (this.validacionMunicipioDos === true && this.validacionMunicipioTres === false) {

            this.validacionMunicipioUno = false;

          }


        }, (error: HttpErrorResponse) => {

          this.spinnerService.hide();
          this.validacionMunicipioDos = false;
          this.certifiedMunicipality = true;

          if (this.validacionMunicipioDos === false && this.validacionMunicipioTres === false) {

            this.validacionMunicipioUno = true;

          } else if (this.validacionMunicipioUno === false && this.validacionMunicipioTres === false) {

            this.validacionMunicipioDos = true;

          } else if (this.validacionMunicipioUno === false && this.validacionMunicipioDos === false) {

            this.validacionMunicipioTres = true;

          }

        });


    } else if (document === 2) {

      this.certifiedMunicipality = false;
      this.descarga = false;

      this.spinnerService.show();

      this.generateCertificate.listMonths(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();


          this.filteredPeriod = data.filter(function (car) {
            return car.periodo !== 'FEBRERO' && car.periodo !== 'ABRIL' && car.periodo !== 'JUNIO' && car.periodo !== 'AGOSTO' && car.periodo !== 'OCTUBRE' && car.periodo !== 'DICIEMBRE';
          });

          let datosEnero = <any>{};

          datosEnero = this.filteredPeriod.filter(function (car) {
            return car.periodo === 'ENERO' ? car.periodo = 'ENERO - FEBRERO' : ''
              || car.periodo === 'MAYO' ? car.periodo = 'MAYO - JUNIO' : ''
                || car.periodo === 'MARZO' ? car.periodo = 'MARZO - ABRIL' : ''
                  || car.periodo === 'JULIO' ? car.periodo = 'JULIO - AGOSTO' : ''
                    || car.periodo === 'SEPTIEMBRE' ? car.periodo = 'SEPTIEMBRE - OCTUBRE' : ''
                      || car.periodo === 'NOVIEMBRE' ? car.periodo = 'NOVIEMBRE - DICIEMBRE' : ''
          });
          let falta = 0;

          if (this.filteredPeriod.length !== 6) {
            let selected = [];
            this.banderaAgregado = true;
            selected.push({ "periodo": 'ENERO - FEBRERO', "index": 1 });
            selected.push({ "periodo": 'MARZO - ABRIL', "index": 2 });
            selected.push({ "periodo": 'MAYO - JUNIO', "index": 3 });
            selected.push({ "periodo": 'JULIO - AGOSTO', "index": 4 });
            selected.push({ "periodo": 'SEPTIEMBRE - OCTUBRE', "index": 5 });
            selected.push({ "periodo": 'NOVIEMBRE - DICIEMBRE', "index": 6 });

            for (let index = 0; index < this.filteredPeriod.length; index++) {
              for (let j = 0; j < selected.length; j++) {
                if (this.filteredPeriod[index].periodo == selected[j].periodo) {
                  selected.splice(j, 1)
                }

              }
            }

            if (selected.length > 0) {
              this.agregado = selected;
              if (selected[0].index === 1) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'ENERO' || car.periodo === 'FEBRERO';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (selected[0].index === 2) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'MARZO' || car.periodo === 'ABRIL';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (selected[0].index === 3) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'MAYO' || car.periodo === 'JUNIO';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (selected[0].index === 4) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'JULIO' || car.periodo === 'AGOSTO';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (selected[0].index === 5) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'SEPTIEMBRE' || car.periodo === 'OCTUBRE';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (selected[0].index === 6) {
                let cont = data.filter(function (car) {
                  return car.periodo == 'NOVIEMBRE' || car.periodo === 'DICIEMBRE';
                }).length;
                if (cont > 0) {
                  this.filteredPeriod.push({ 'periodo': selected[0].periodo })
                }
              }
              if (this.filteredPeriod.length == 6) {
                this.filteredPeriod = [];
                this.filteredPeriod.push({ "periodo": 'ENERO - FEBRERO' });
                this.filteredPeriod.push({ "periodo": 'MARZO - ABRIL' });
                this.filteredPeriod.push({ "periodo": 'MAYO - JUNIO' });
                this.filteredPeriod.push({ "periodo": 'JULIO - AGOSTO' });
                this.filteredPeriod.push({ "periodo": 'SEPTIEMBRE - OCTUBRE' });
                this.filteredPeriod.push({ "periodo": 'NOVIEMBRE - DICIEMBRE' });
              }
            }


          }



          this.certifiedPeriod = true;

        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.spinnerService.hide();

          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });


        });

    }

  }

  selectPeriodicyDos(PeriodicityDos) {

    this.seleccionPeriodicidad = PeriodicityDos;
    this.certifiedMunicipality = false;

    this.datos.crMunicipio = 1;
    this.spinnerService.show();

    this.generateCertificate.CertificateByYear(this.datos).subscribe(
      (data) => {

          //console.log(data);

        this.spinnerService.hide();
        this.listaDatosAnual = data;

        this.listaDatosAnual.sort((a, b) => a.fecha > b.fecha)

        this.descarga = true;

      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.spinnerService.hide();

        swal.fire({
          title: 'Error',
          text: 'El usuario no cuenta con este tipo de certificado.',
          icon: 'error',
        });

      }
    );

  }

  selectCertifiedMunicipalityDos() {

    this.certifiedMunicipalityDos = true;

  }


  // Seleccion municipio

  selectCertifiedMunicipality(document): any {


    if (this.datos.typeCertificate === 1 || this.datos.typeCertificate === 2 || this.datos.typeCertificate === 3 || this.datos.typeCertificate === 4) {


      if (this.seleccionPeriodicidad === 1) {

        this.datos.crMunicipio = document;
        this.spinnerService.show();
        this.generateCertificate.CertificateByYear(this.datos).subscribe(
          (data) => {
            this.spinnerService.hide();
            this.listaDatosAnual = data;

            this.fechaPeriodoUno = data[0];
            this.fechaPeriodoUno = this.fechaPeriodoUno;
            this.fechaPeriodoDos = data[0];
            this.fechaPeriodoDos = this.fechaPeriodoDos;
            this.descarga = true;


            if (this.seleccionPeriodicidad === 1) {

              this.fechaUno = `01/01/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`
              this.fechaDos = `31/12/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`

            } else if (this.seleccionPeriodicidad === 2) {




              if (this.datos.periodOne === 'ENERO') {
                this.fechaUno = `01/01/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `28/02/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              } else if (this.datos.periodOne === 'JULIO') {
                this.fechaUno = `01/07/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/08/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              } else if (this.datos.periodOne === 'MARZO') {
                this.fechaUno = `01/03/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/04/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              } else if (this.datos.periodOne === 'MAYO') {
                this.fechaUno = `01/05/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/06/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              } else if (this.datos.periodOne === 'NOVIEMBRE') {
                this.fechaUno = `01/11/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/12/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              } else if (this.datos.periodOne === 'SEPTIEMBRE') {
                this.fechaUno = `01/09/${this.fechaPeriodoUno.fecha.slice(0, -16)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/10/${this.fechaPeriodoDos.fecha.slice(0, -16)}`;
              }






            }

          }, (error: HttpErrorResponse) => {
            console.log(error);

            swal.fire({
              title: 'Error',
              text: 'El usuario no cuenta con este tipo de certificado.',
              icon: 'error',
            });

          }
        );

      } else if (this.seleccionPeriodicidad === 2) {

        var tipoMunicipio: any;

        if (document.municipio === 'BOGOTA D.C') {
          tipoMunicipio = 1;
        } else if (document.municipio === 'CHIA') {
          tipoMunicipio = 3;
        } else if (document.municipio === 'MADRID') {
          tipoMunicipio = 2;
        }

        this.datos.crMunicipio = tipoMunicipio;

        var monthTwo: any;

        if (this.datos.periodOne === 'ENERO') {
          monthTwo = 'FEBRERO'
        } else if (this.datos.periodOne === 'MARZO') {
          monthTwo = 'ABRIL'
        } else if (this.datos.periodOne === 'MAYO') {
          monthTwo = 'JUNIO'
        } else if (this.datos.periodOne === 'JULIO') {
          monthTwo = 'AGOSTO'
        } else if (this.datos.periodOne === 'SEPTIEMBRE') {
          monthTwo = 'OCTUBRE'
        } else if (this.datos.periodOne === 'NOVIEMBRE') {
          monthTwo = 'DICIEMBRE'
        }

        this.datos.monthTwo = monthTwo;

        this.datosPrueba.crMunicipio = this.datos.crMunicipio;
        this.datosPrueba.monthTwo = this.datos.monthTwo;;
        this.datosPrueba.nitTercero = this.datos.nitTercero;
        this.datosPrueba.monthOne = this.datos.periodOne;
        this.datosPrueba.typeCertificate = this.datos.typeCertificate;
        this.datosPrueba.year = this.datos.year;


        this.spinnerService.show();
        this.generateCertificate.generateCertificate(this.datosPrueba).subscribe(
          (data) => {
            this.spinnerService.hide();
            this.listaDatosAnual = data;
            this.descarga = true;

            this.fechaPeriodoUno = this.listaDatosAnual[0];
            this.fechaPeriodoDos = this.listaDatosAnual[0];



            if (this.seleccionPeriodicidad === 1) {

              this.fechaUno = `01/01/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`
              this.fechaDos = `31/12/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`

            } else if (this.seleccionPeriodicidad === 2) {

              if (this.datos.periodOne === 'ENERO') {
                this.fechaUno = `01/01/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `28/02/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'JULIO') {
                this.fechaUno = `01/07/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/08/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'MARZO') {
                this.fechaUno = `01/03/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/04/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'MAYO') {
                this.fechaUno = `01/05/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/06/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'NOVIEMBRE') {
                this.fechaUno = `01/11/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/12/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'SEPTIEMBRE') {
                this.fechaUno = `01/09/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/10/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'FEBRERO') {
                this.fechaUno = `01/01/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `28/02/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'ABRIL') {
                this.fechaUno = `01/03/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/04/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'JUNIO') {
                this.fechaUno = `01/05/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `30/06/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'AGOSTO') {
                this.fechaUno = `01/07/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/08/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'OCTUBRE') {
                this.fechaUno = `01/09/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/10/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
              } else if (this.datos.periodOne === 'DICIEMBRE') {
                this.fechaUno = `01/11/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
                this.fechaUno.split('').reverse().join('');
                this.fechaDos = `31/12/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;

              }
            }

          }, (error: HttpErrorResponse) => {
            console.log(error);
            this.spinnerService.hide();

            swal.fire({
              title: 'Error',
              text: 'El usuario no cuenta con este tipo de certificado.',
              icon: 'error',
            });

          });


      }


    } else if (this.datos.typeCertificate === 5) {

      var tipoMunicipio: any;

      if (document.municipio === 'BOGOTA D.C') {
        tipoMunicipio = 1;
      } else if (document.municipio === 'CHIA') {
        tipoMunicipio = 2;
      } else if (document.municipio === 'MADRID') {
        tipoMunicipio = 3;
      }

      this.datos.crMunicipio = tipoMunicipio;

      this.datosPrueba.crMunicipio = this.datos.crMunicipio;
      this.datosPrueba.nitTercero = this.datos.nitTercero;
      this.datosPrueba.monthOne = this.datos.periodOne;
      this.datosPrueba.typeCertificate = this.datos.typeCertificate;
      this.datosPrueba.year = this.datos.year;

      this.spinnerService.show();
      this.generateCertificate.generateCertificate(this.datosPrueba).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.listaDatosAnual = data;

          this.listaDatosAnual.sort((a, b) => a.fecha > b.fecha);
          this.fechaPeriodoUno = this.listaDatosAnual[0];
          this.descarga = true;

          if (this.seleccionPeriodicidad === 1) {

            this.fechaUno = `01/01/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`
            this.fechaDos = `31/12/${new Date(this.fechaPeriodoDos.fecha).toISOString().slice(0, 4)}`

          } else if (this.seleccionPeriodicidad === 2) {

            if (this.datos.periodOne === 'ENERO') {
              this.fechaUno = `01/01/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `28/02/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            } else if (this.datos.periodOne === 'JULIO') {
              this.fechaUno = `01/07/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `31/08/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            } else if (this.datos.periodOne === 'MARZO') {
              this.fechaUno = `01/03/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `30/04/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            } else if (this.datos.periodOne === 'MAYO') {
              this.fechaUno = `01/05/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `30/06/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            } else if (this.datos.periodOne === 'NOVIEMBRE') {
              this.fechaUno = `01/11/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `31/12/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            } else if (this.datos.periodOne === 'SEPTIEMBRE') {
              this.fechaUno = `01/09/${this.fechaPeriodoUno.fecha.slice(0, -17)}`;
              this.fechaUno.split('').reverse().join('');
              this.fechaDos = `31/10/${this.fechaPeriodoDos.fecha.slice(0, -17)}`;
            }

          }



        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.spinnerService.hide();

          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });


        }
      );

    }

  }


  selectCertifiedPeriod(document): any {

    this.datos.periodOne = document.periodo;
    if (this.banderaAgregado) {
      if (this.agregado[0].periodo == document.periodo) {
        if (this.datos.periodOne === 'ENERO - FEBRERO') {
          this.datos.periodOne = 'FEBRERO'
        } else if (this.datos.periodOne === 'JULIO - AGOSTO') {
          this.datos.periodOne = 'AGOSTO'
        } else if (this.datos.periodOne === 'MARZO - ABRIL') {
          this.datos.periodOne = 'ABRIL'
        } else if (this.datos.periodOne === 'MAYO - JUNIO') {
          this.datos.periodOne = 'JUNIO'
        } else if (this.datos.periodOne === 'NOVIEMBRE - DICIEMBRE') {
          this.datos.periodOne = 'DICIEMBRE'
        } else if (this.datos.periodOne === 'SEPTIEMBRE - OCTUBRE') {
          this.datos.periodOne = 'OCTUBRE'
        }
      } else {
        if (this.datos.periodOne === 'ENERO - FEBRERO') {
          this.datos.periodOne = 'ENERO'
        } else if (this.datos.periodOne === 'JULIO - AGOSTO') {
          this.datos.periodOne = 'JULIO'
        } else if (this.datos.periodOne === 'MARZO - ABRIL') {
          this.datos.periodOne = 'MARZO'
        } else if (this.datos.periodOne === 'MAYO - JUNIO') {
          this.datos.periodOne = 'MAYO'
        } else if (this.datos.periodOne === 'NOVIEMBRE - DICIEMBRE') {
          this.datos.periodOne = 'NOVIEMBRE'
        } else if (this.datos.periodOne === 'SEPTIEMBRE - OCTUBRE') {
          this.datos.periodOne = 'SEPTIEMBRE'
        }

      }


    } else {

      if (this.datos.periodOne === 'ENERO - FEBRERO') {
        this.datos.periodOne = 'ENERO'
        this.datos.periodTwo = 'FEBRERO'
      } else if (this.datos.periodOne === 'JULIO - AGOSTO') {
        this.datos.periodOne = 'JULIO'
        this.datos.periodTwo = 'AGOSTO'
      } else if (this.datos.periodOne === 'MARZO - ABRIL') {
        this.datos.periodOne = 'MARZO'
        this.datos.periodTwo = 'ABRIL'
      } else if (this.datos.periodOne === 'MAYO - JUNIO') {
        this.datos.periodOne = 'MAYO'
        this.datos.periodTwo = 'JUNIO'

      } else if (this.datos.periodOne === 'NOVIEMBRE - DICIEMBRE') {
        this.datos.periodOne = 'NOVIEMBRE'
        this.datos.periodTwo = 'DICIEMBRE'

      } else if (this.datos.periodOne === 'SEPTIEMBRE - OCTUBRE') {
        this.datos.periodOne = 'SEPTIEMBRE'
        this.datos.periodTwo = 'OCTUBRE'

      }
    }



    if (this.datos.typeCertificate === 1 || this.datos.typeCertificate === 2) {

      this.spinnerService.show();
      this.generateCertificate.listMunicipalities(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.filteredMunicipal = data;
          this.certifiedMunicipalityDos = true;


        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.spinnerService.hide();

          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });
        }
      );

    } else if (this.datos.typeCertificate === 5) {

      this.spinnerService.show();
      this.generateCertificate.listMunicipalities(this.datos).subscribe(
        (data) => {
          this.spinnerService.hide();
          this.filteredMunicipal = data;
          this.certifiedMunicipalityDos = true;


        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.spinnerService.hide();

          swal.fire({
            title: 'Error',
            text: 'El usuario no cuenta con este tipo de certificado.',
            icon: 'error',
          });


        });


    }

  }




  // tslint:disable-next-line:typedef
  downloadPDF() {

    if (this.datos.typeCertificate === 1) {

      this.downloadPDFIca();

    } else if (this.datos.typeCertificate === 2) {

      this.downloadPDFIva();

    } else if (this.datos.typeCertificate === 3) {

      this.downloadPDFTimbre();

    } else if (this.datos.typeCertificate === 4) {

      this.downloadPDFRenta();

    } else if (this.datos.typeCertificate === 5) {

      this.downloadPDFCuentasParticipación2();

    }



  }


  downloadPDFIca() {
    var mes = this.fecha.getMonth() + 1;
    var mesCompleto = "";
    if (mes <= 9) {
      mesCompleto += '0' + mes;
    } else {
      mesCompleto = "" + mes;
    }


    var fecha = `${this.fecha.getDate()}/${mesCompleto}/${this.fecha.getFullYear()}`;
    var ciudad = this.datos.crMunicipio;
    var ciudadDos;

    if (ciudad === 1) {
      ciudad = 'en la ciudad de BOGOTÁ D.C.';
      ciudadDos = 'BOGOTÁ D.C.';
    } else if (ciudad === 3) {
      ciudad = 'en el municipio de CHIA';
      ciudadDos = 'CHIA';
    } else if (ciudad === 2) {
      ciudad = 'en el municipio de MADRID';
      ciudadDos = 'MADRID';
    }


    var logo = new Image();
    //logo.src = '/assets/images/fsfb.png';
    logo.src = '/wps/contenthandler/dav/fs-type1/themes/PROVEEDORES-Home/images/santafelogo.png';

    let doc = new jsPDF();
    doc.addImage(logo, 'JPEG', 10, 5, 50, 20);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(58, 25, `CERTIFICADO DE RETENCIÓN EN LA FUENTE POR ICA`);
    doc.text(90, 30, `AÑO GRAVABLE ${this.datos.year}`);
    doc.text(75, 35, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(92, 40, 'NIT: 860037950 - 2');
    doc.text(72, 45, 'CALLE 119 No. 7 - 75 TELÉFONO 6030303');
    doc.text(85, 50, `${ciudadDos} - COLOMBIA`);

    doc.text(96, 60, 'CERTIFICA');
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 65, `Que durante el periodo comprendido entre ${this.fechaUno} y ${this.fechaDos} ${ciudad} se práctico`);
    doc.text(20, 70, `y consignó retención en la fuente por Impuesto de Industria y Comercio a:`);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);

    var datos: any;
    var identificacion: any;

    if (this.dataUsuariosPJ === null) {

      datos = this.dataUsuariosPN.datosPNApellidos + " " + this.dataUsuariosPN.datosPNNombres;
      identificacion = this.dataUsuariosPN.datosPNIdentificacion;

    } else {
      datos = this.dataUsuariosPJ.datosPJ.datosPJRazonSocial;
      identificacion = this.dataUsuariosPJ.datosPJ.datosPJIdentificacion;
    }

    var titulo = 105;
    var tamañotITULO = datos.length;
    doc.text(titulo - tamañotITULO, 85, `${datos.toUpperCase()}`);
    doc.text(97, 90, `${identificacion}`);

    doc.text(30, 105, 'PERIODO');
    doc.text(55, 105, 'CONCEPTO');
    doc.text(116, 105, 'BASE');
    doc.text(150, 105, '% x MIL');
    doc.text(170, 105, 'RETENCIÓN');

    //  Porcentajes PDF
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);


    var data: number = 0;
    var retenido: number = 0;
    var base: number = 0;

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      retenido += element.retencion;

    }

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      base += element.base;

    }


    var retenidoTexto = trans.NumerosALetras(retenido) + " PESOS MCTE";


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      data = data + 5

      doc.setFontSize(8);
      doc.text(30, 110 + data, element.periodo);
      doc.text(55, 110 + data, element.concepto);
      doc.text(128, 110 + data, new Intl.NumberFormat("de-DE").format(element.base.toString()), { align: 'right' });
      doc.text(155, 110 + data, `${element.porcentaje.toString()}`);
      doc.text(190, 110 + data, new Intl.NumberFormat("de-DE").format(element.retencion.toString()), { align: 'right' });
    }
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(30, 120 + data, `TOTAL`);

    doc.text(115, 120 + data, `${new Intl.NumberFormat("de-DE").format(base)}`);
    doc.text(179, 120 + data, `${new Intl.NumberFormat("de-DE").format(retenido)}`);



    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 130 + data, `VALOR RETENIDO:  $${new Intl.NumberFormat("de-DE").format(retenido)}`);
    doc.setFontSize(8);
    doc.text(20, 135 + data, `${retenidoTexto}`);
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 155 + data, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(20, 160 + data, 'NIT: 860037950-2');
    doc.text(20, 165 + data, `FECHA DE EXPEDICIÓN:  ${fecha.toString()}`);

    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);
    doc.text(20, 175 + data, 'NOTA: LAS PERSONAS JURÍDICAS PODRÁN ENTREGAR LOS CERTIFICADOS DE RETENCIÓN EN LA FUENTE, EN FORMA CONTINUA IMPRESA');
    doc.text(20, 180 + data, 'POR COMPUTADOR, SIN NECESIDAD DE FIRMA AUTÓGRAFA (D.R. 836/91)LOS DOCUMENTOS QUE SE ENCUENTRAN ALMACENADOS EN');
    doc.text(20, 185 + data, 'MEDIOS MAGNÉTICOS O ELECTRÓNICOS PUEDAN SER IMPRESOS EN CUALQUIER PARTE UTILIZANDO EL COMPUTADOR, YA SEA EN LA SEDE');
    doc.text(20, 190 + data, 'DEL AGENTE DE RETENCIÓN O EN LA SEDE DEL RETENIDO (CONCEPTO DIAN 105489 DE 24-12-2007).LA UTILIZACIÓN DE ESTE CERTIFICADO');
    doc.text(20, 195 + data, 'EN LAS DECLARACIONES TRIBUTARIAS QUE SE SURTAN ANTE LAS AUTORIDADES COMPETENTES ES RESPONSABILIDAD EXCLUSIVA DE LA(S)');
    doc.text(20, 200 + data, 'PERSONA(S) EN CUYO FAVOR SE EXPIDE.');


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 260);
    doc.text(50, 215 + data, 'Calle 119 No. 7–75 Teléfono: 6030303 Fax: 6575714 Bogotá, D.C');
    doc.text(90, 220 + data, 'www.fsfb.org.co');

    doc.save(`ICA-${this.datos.nitTercero}.pdf`);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 8000);

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.certifiedMunicipalityDos = false;
    this.descarga = false;

  }

  downloadPDFIva() {
    var mes = this.fecha.getMonth() + 1;
    var mesCompleto = "";
    if (mes <= 9) {
      mesCompleto += '0' + mes;
    } else {
      mesCompleto = "" + mes;
    }


    var fecha = `${this.fecha.getDate()}/${mesCompleto}/${this.fecha.getFullYear()}`;
    var ciudad = this.datos.crMunicipio;
    var ciudadDos;

    if (ciudad === 1) {
      ciudad = 'en la ciudad de BOGOTÁ D.C.';
      ciudadDos = 'BOGOTÁ D.C.';
    } else if (ciudad === 3) {
      ciudad = 'en el municipio de CHIA';
      ciudadDos = 'CHIA';
    } else if (ciudad === 2) {
      ciudad = 'en el municipio de MADRID';
      ciudadDos = 'MADRID';
    }

    var logo = new Image();
    //logo.src = '/assets/images/fsfb.png';
    logo.src = '/wps/contenthandler/dav/fs-type1/themes/PROVEEDORES-Home/images/santafelogo.png';


    let doc = new jsPDF('', '', [600, 1000]);
    doc.addImage(logo, 'JPEG', 10, 5, 50, 20);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(58, 25, 'CERTIFICADO DE RETENCIÓN EN LA FUENTE POR IVA');
    doc.text(90, 30, `AÑO GRAVABLE ${this.datos.year}`);
    doc.text(75, 35, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(92, 40, 'NIT: 860037950 - 2');
    doc.text(72, 45, 'CALLE 119 No. 7 - 75 TELÉFONO 6030303');
    doc.text(85, 50, 'BOGOTÁ D.C - COLOMBIA');

    doc.text(96, 60, 'CERTIFICA');
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 65, `Que durante el periodo comprendido entre ${this.fechaUno} y ${this.fechaDos} ${ciudad} se práctico`);
    doc.text(20, 70, `y consignó retención en la fuente por Impuesto a la Venta a :`);

    var datos: any;
    var identificacion: any;

    if (this.dataUsuariosPJ === null) {
      datos = this.dataUsuariosPN.datosPNApellidos + " " + this.dataUsuariosPN.datosPNNombres;

      identificacion = this.dataUsuariosPN.datosPNIdentificacion;

    } else {
      datos = this.dataUsuariosPJ.datosPJ.datosPJRazonSocial;
      identificacion = this.dataUsuariosPJ.datosPJ.datosPJIdentificacion;
    }


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    var titulo = 105;
    var tamañotITULO = datos.length;
    doc.text(titulo - tamañotITULO, 85, `${datos.toUpperCase()}`);
    doc.text(97, 90, `${identificacion}`);

    doc.text(20, 105, 'PERIODO');
    doc.text(45, 105, 'CONCEPTO');
    doc.text(85, 105, 'VR.ANTES IVA');
    doc.text(115, 105, 'TAR.IVA');
    doc.text(144, 105, 'IVA');
    doc.text(162, 105, '%');
    doc.text(170, 105, 'RETENCIÓN');


    //  Porcentajes PDF
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);


    var data: number = 0;
    var vrAntesIva: number = 0;
    var idIva: number = 0;
    var retenido: number = 0;


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      retenido += element.retencion;

    }

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];
      vrAntesIva += element.valortotal;
    }

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];
      idIva += element.iva;
    }

    var retenidoTexto = trans.NumerosALetras(retenido) + " PESOS MCTE";


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      data = data + 10

      doc.setFontSize(8);
      doc.text(20, 105 + data, element.periodo);
      doc.text(45, 105 + data, element.concepto.slice(0, -16));
      doc.text(45, 110 + data, 'LEY 1607 DE 2012');
      doc.text(95, 105 + data, new Intl.NumberFormat("de-DE").format(element.valortotal.toString()));
      doc.text(125, 105 + data, element.tariva.toString());
      doc.text(138, 105 + data, new Intl.NumberFormat("de-DE").format(element.iva.toString()));
      doc.text(162, 105 + data, `${element.porcentaje.toString()}`);
      doc.text(180, 105 + data, new Intl.NumberFormat("de-DE").format(element.retencion.toString()));

    }


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(8);
    doc.text(40, 120 + data, `TOTAL`);
    doc.text(95, 120 + data, `${new Intl.NumberFormat("de-DE").format(vrAntesIva)}`);
    doc.text(138, 120 + data, `${new Intl.NumberFormat("de-DE").format(idIva)}`);
    doc.text(178, 120 + data, `${new Intl.NumberFormat("de-DE").format(retenido)}`);


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 130 + data, `VALOR RETENIDO:  $${new Intl.NumberFormat("de-DE").format(retenido)}`);
    doc.setFontSize(8);
    doc.text(20, 135 + data, `${retenidoTexto}`);
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 155 + data, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(20, 160 + data, 'NIT: 860037950-2');
    doc.text(20, 165 + data, `FECHA DE EXPEDICIÓN:  ${fecha.toString()}`);

    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);
    doc.text(20, 175 + data, 'NOTA: LAS PERSONAS JURÍDICAS PODRÁN ENTREGAR LOS CERTIFICADOS DE RETENCIÓN EN LA FUENTE, EN FORMA CONTINUA IMPRESA');
    doc.text(20, 180 + data, 'POR COMPUTADOR, SIN NECESIDAD DE FIRMA AUTÓGRAFA (D.R. 836/91)LOS DOCUMENTOS QUE SE ENCUENTRAN ALMACENADOS EN');
    doc.text(20, 185 + data, 'MEDIOS MAGNÉTICOS O ELECTRÓNICOS PUEDAN SER IMPRESOS EN CUALQUIER PARTE UTILIZANDO EL COMPUTADOR, YA SEA EN LA SEDE');
    doc.text(20, 190 + data, 'DEL AGENTE DE RETENCIÓN O EN LA SEDE DEL RETENIDO (CONCEPTO DIAN 105489 DE 24-12-2007).LA UTILIZACIÓN DE ESTE CERTIFICADO');
    doc.text(20, 195 + data, 'EN LAS DECLARACIONES TRIBUTARIAS QUE SE SURTAN ANTE LAS AUTORIDADES COMPETENTES ES RESPONSABILIDAD EXCLUSIVA DE LA(S)');
    doc.text(20, 200 + data, 'PERSONA(S) EN CUYO FAVOR SE EXPIDE.');


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 260);
    doc.text(50, 215 + data, 'Calle 119 No. 7–75 Teléfono: 6030303 Fax: 6575714 Bogotá, D.C');
    doc.text(90, 220 + data, 'www.fsfb.org.co');

    /*
      if (data >= 70 ) {
        tamañoPDF = 1000;

      } else {
        tamañoPDF = 840;
      }
    */

    doc.save(`IVA-${this.datos.nitTercero}.pdf`);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 8000);

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.descarga = false;
    this.certifiedMunicipalityDos = false;

  }


  downloadPDFTimbre() {

    var mes = this.fecha.getMonth() + 1;
    var mesCompleto = "";
    if (mes <= 9) {
      mesCompleto += '0' + mes;
    } else {
      mesCompleto = "" + mes;
    }


    var fecha = `${this.fecha.getDate()}/${mesCompleto}/${this.fecha.getFullYear()}`;
    var ciudad = this.datos.crMunicipio;
    var ciudadDos;

    if (ciudad === 1) {
      ciudad = 'en la ciudad de BOGOTÁ D.C.';
      ciudadDos = 'BOGOTÁ D.C.';
    } else if (ciudad === 3) {
      ciudad = 'en el municipio de CHIA';
      ciudadDos = 'CHIA';
    } else if (ciudad === 2) {
      ciudad = 'en el municipio de MADRID';
      ciudadDos = 'MADRID';
    }


    var logo = new Image();
    //logo.src = '/assets/images/fsfb.png';
    logo.src = '/wps/contenthandler/dav/fs-type1/themes/PROVEEDORES-Home/images/santafelogo.png';

    let doc = new jsPDF();
    doc.addImage(logo, 'JPEG', 10, 5, 50, 20);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(58, 25, 'CERTIFICADO DE RETENCIÓN EN LA FUENTE POR TIMBRE');
    doc.text(90, 30, `AÑO GRAVABLE ${this.datos.year}`);
    doc.text(75, 35, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(92, 40, 'NIT: 860037950 - 2');
    doc.text(72, 45, 'CALLE 119 No. 7 - 75 TELÉFONO 6030303');
    doc.text(85, 50, 'BOGOTÁ D.C - COLOMBIA');

    doc.text(96, 60, 'CERTIFICA');
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 65, `Que durante el periodo comprendido entre 01/01/${this.datos.year} y 31/12/${this.datos.year} ${ciudad} se práctico`);
    doc.text(20, 70, `y consignó retención en la fuente  por Impuesto de Timbre a:`);

    var datos: any;
    var identificacion: any;

    if (this.dataUsuariosPJ === null) {

      datos = this.dataUsuariosPN.datosPNApellidos + " " + this.dataUsuariosPN.datosPNNombres;
      identificacion = this.dataUsuariosPN.datosPNIdentificacion;

    } else {
      datos = this.dataUsuariosPJ.datosPJ.datosPJRazonSocial;
      identificacion = this.dataUsuariosPJ.datosPJ.datosPJIdentificacion;
    }


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    var titulo = 105;
    var tamañotITULO = datos.length;
    doc.text(titulo - tamañotITULO, 85, `${datos.toUpperCase()}`);
    doc.text(97, 90, `${identificacion}`);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(8);
    doc.text(20, 105, 'PERIODO');
    doc.text(50, 105, 'CONCEPTO');
    doc.text(80, 105, 'MONTO BASE');
    doc.text(110, 105, 'T.A.R');
    doc.text(130, 105, 'VR. IMPUESTO');
    doc.text(130, 108, 'PAGADO');
    doc.text(170, 105, 'VR. IMPUESTO');
    doc.text(170, 108, 'RETENIDO');

    //  Porcentajes PDF
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);


    var data: number = 0;
    var retenido: number = 0;

    var montoBasteTotal: number = 0;
    var impuestoPagadoTotal: number = 0;
    var impuestoretenidoTotal: number = 0;

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];
      retenido += element.impuestopagado;
      montoBasteTotal += element.montobase;
      impuestoPagadoTotal += element.impuestopagado;
      impuestoretenidoTotal += element.impuestoretenido;
    }

    var retenidoTexto = trans.NumerosALetras(retenido) + " PESOS MCTE";


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      data = data + 5

      doc.setFontSize(8);
      doc.text(20, 110 + data, element.periodo);
      doc.text(50, 110 + data, element.contrato == undefined ? "" : element.contrato);
      doc.text(99, 110 + data, new Intl.NumberFormat("de-DE").format(element.montobase.toString()), { align: 'right' });
      doc.text(114, 110 + data, `${element.tar}` == undefined ? "" : `${element.tar}`);
      doc.text(150, 110 + data, new Intl.NumberFormat("de-DE").format(element.impuestopagado.toString()), { align: 'right' });
      doc.text(190, 110 + data, new Intl.NumberFormat("de-DE").format(element.impuestoretenido.toString()), { align: 'right' });
    }

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(8);

    doc.text(20, 120 + data, "TOTAL");
    doc.text(99, 120 + data, new Intl.NumberFormat("de-DE").format(montoBasteTotal), { align: 'right' });
    doc.text(150, 120 + data, new Intl.NumberFormat("de-DE").format(impuestoPagadoTotal), { align: 'right' });
    doc.text(190, 120 + data, new Intl.NumberFormat("de-DE").format(impuestoretenidoTotal), { align: 'right' });


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 130 + data, `VALOR RETENIDO:  $` + new Intl.NumberFormat("de-DE").format(retenido));
    doc.setFontSize(8);
    doc.text(20, 135 + data, `${retenidoTexto}`);
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 155 + data, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(20, 160 + data, 'NIT: 860037950-2');
    doc.text(20, 165 + data, `FECHA DE EXPEDICIÓN:  ${fecha.toString()}`);

    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);
    doc.text(20, 175 + data, 'NOTA: LAS PERSONAS JURÍDICAS PODRÁN ENTREGAR LOS CERTIFICADOS DE RETENCIÓN EN LA FUENTE, EN FORMA CONTINUA IMPRESA');
    doc.text(20, 180 + data, 'POR COMPUTADOR, SIN NECESIDAD DE FIRMA AUTÓGRAFA (D.R. 836/91)LOS DOCUMENTOS QUE SE ENCUENTRAN ALMACENADOS EN');
    doc.text(20, 185 + data, 'MEDIOS MAGNÉTICOS O ELECTRÓNICOS PUEDAN SER IMPRESOS EN CUALQUIER PARTE UTILIZANDO EL COMPUTADOR, YA SEA EN LA SEDE');
    doc.text(20, 190 + data, 'DEL AGENTE DE RETENCIÓN O EN LA SEDE DEL RETENIDO (CONCEPTO DIAN 105489 DE 24-12-2007).LA UTILIZACIÓN DE ESTE CERTIFICADO');
    doc.text(20, 195 + data, 'EN LAS DECLARACIONES TRIBUTARIAS QUE SE SURTAN ANTE LAS AUTORIDADES COMPETENTES ES RESPONSABILIDAD EXCLUSIVA DE LA(S)');
    doc.text(20, 200 + data, 'PERSONA(S) EN CUYO FAVOR SE EXPIDE.');


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 260);
    doc.text(50, 215 + data, 'Calle 119 No. 7–75 Teléfono: 6030303 Fax: 6575714 Bogotá, D.C');
    doc.text(90, 220 + data, 'www.fsfb.org.co');

    doc.save(`TIMBRE-${this.datos.nitTercero}.pdf`);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 8000);

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.descarga = false;

  }

  downloadPDFRenta() {

    var mes = this.fecha.getMonth() + 1;
    var mesCompleto = "";
    if (mes <= 9) {
      mesCompleto += '0' + mes;
    } else {
      mesCompleto = "" + mes;
    }


    var fecha = `${this.fecha.getDate()}/${mesCompleto}/${this.fecha.getFullYear()}`;
    var ciudad = this.datos.crMunicipio;
    var ciudadDos;

    if (ciudad === 1) {
      ciudad = 'en la ciudad de BOGOTÁ D.C.';
      ciudadDos = 'BOGOTÁ D.C.';
    } else if (ciudad === 3) {
      ciudad = 'en el municipio de CHIA';
      ciudadDos = 'CHIA';
    } else if (ciudad === 2) {
      ciudad = 'en el municipio de MADRID';
      ciudadDos = 'MADRID';
    }


    var logo = new Image();
    //logo.src = '/assets/images/fsfb.png';
    logo.src = '/wps/contenthandler/dav/fs-type1/themes/PROVEEDORES-Home/images/santafelogo.png';

    let doc = new jsPDF('', '', [600, 1000]);
    doc.addImage(logo, 'JPEG', 10, 5, 50, 20);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(58, 25, `CERTIFICADO DE RETENCIÓN EN LA FUENTE POR RENTA`);
    doc.text(95, 30, `AÑO GRAVABLE ${this.datos.year}`);
    doc.text(75, 35, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(92, 40, 'NIT: 860037950 - 2');
    doc.text(72, 45, 'CALLE 119 No. 7 - 75 TELÉFONO 6030303');
    doc.text(85, 50, 'BOGOTÁ D.C - COLOMBIA');

    doc.text(96, 60, 'CERTIFICA');
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 65, `Que durante el periodo comprendido entre 01/01/${this.datos.year} y 31/12/${this.datos.year} ${ciudad} se práctico`);
    doc.text(20, 70, `y consignó retención en la fuente Título de Renta a:`);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);

    var datos: any;
    var identificacion: any;

    if (this.dataUsuariosPJ === null) {

      datos = this.dataUsuariosPN.datosPNApellidos + " " + this.dataUsuariosPN.datosPNNombres;
      identificacion = this.dataUsuariosPN.datosPNIdentificacion;

    } else {
      datos = this.dataUsuariosPJ.datosPJ.datosPJRazonSocial;
      identificacion = this.dataUsuariosPJ.datosPJ.datosPJIdentificacion;
    }

    var titulo = 105;
    var tamañotITULO = datos.length;
    doc.text(titulo - tamañotITULO, 85, `${datos.toUpperCase()}`);
    doc.text(97, 90, `${identificacion}`);
    

    if(this.listaDatosAnual.filter(el=>el.base_ingreso!=null).length > 0){
      doc.text(19, 105, 'PERIODO');
      doc.text(43, 105, 'CONCEPTO');
      doc.text(115, 105, 'BASE');
      doc.text(137, 105, '%');
      doc.text(149, 103, 'BASE \nINGRESO');
      doc.text(173, 105, 'RETENCIÓN');
    }else{
      doc.text(20, 105, 'PERIODO');
      doc.text(45, 105, 'CONCEPTO');
      doc.text(120, 105, 'BASE');
      doc.text(145, 105, '%');
      doc.text(170, 105, 'RETENCIÓN');
    }

    

    //  Porcentajes PDF
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);


    var data: number = 0;
    var retenido: number = 0;
    var base: number = 0;

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      

      retenido += element.retencion;

    }

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      base += element.base;

    }

    var retenidoTexto = trans.NumerosALetras(retenido) + " PESOS MCTE";


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      data = data + 5

      doc.setFontSize(8);

      //console.log(element.base_ingreso)
      

      if(this.listaDatosAnual.filter(el=>el.base_ingreso!=null).length > 0){
        doc.text(19, 110 + data, element.periodo);
        doc.text(43, 110 + data, element.concepto);
        doc.text(130, 110 + data, new Intl.NumberFormat("de-DE").format(element.base.toString()), { align: 'right' });
        doc.text(137, 110 + data, `${element.porcentaje.toString()}`);
        if(element.base_ingreso == null){
            element.base_ingreso = " "
            doc.text(150, 110 + data, `${element.base_ingreso.toString()}`);
        } else {
            doc.text(150, 110 + data, `${element.base_ingreso.toString()}`);
        } 
        

        doc.text(190, 110 + data, new Intl.NumberFormat("de-DE").format(element.retencion.toString()), { align: 'right' });
      } else{
        doc.text(20, 110 + data, element.periodo);
        doc.text(45, 110 + data, element.concepto);
        doc.text(135, 110 + data, new Intl.NumberFormat("de-DE").format(element.base.toString()), { align: 'right' });
        doc.text(145, 110 + data, `${element.porcentaje.toString()}`);
        doc.text(190, 110 + data, new Intl.NumberFormat("de-DE").format(element.retencion.toString()), { align: 'right' });
      }

      

    }
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(30, 120 + data, `Total`);
    doc.text(116, 120 + data, `${new Intl.NumberFormat("de-DE").format(base)}`);
    doc.text(175, 120 + data, `${new Intl.NumberFormat("de-DE").format(retenido)}`);



    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 130 + data, `VALOR RETENIDO:  $${new Intl.NumberFormat("de-DE").format(retenido)}`);
    doc.setFontSize(8);
    doc.text(20, 135 + data, `${retenidoTexto}`);
    //doc.text(20, 140 + data, `${resulRetenidoTextoDos.slice(0, -12).toUpperCase()}`);
    doc.setFont('helvetica');
    doc.setFontType('normal');

    doc.setFontSize(7);
    doc.text(20, 145 + data, 'LA BASE DE RETENCIÓN EN LA FUENTE, CORRESPONDE AL 100% DE SUS INGRESOS MENOS LAS DEDUCCIONES DE LEY SEGÚN EL ARTÍCULO');
    doc.text(20, 150 + data, '126 DEL ESTATUTO TRIBUTARIO (AFC, APORTES OBLIGATORIOS Y/O VOLUNTARIOS DE PENSIÓN), EN CASO DE TENERLOS.');

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 170 + data, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(20, 175 + data, 'NIT: 860037950-2');
    doc.text(20, 180 + data, `FECHA DE EXPEDICIÓN:  ${fecha.toString()}`);

    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);
    doc.text(20, 190 + data, 'NOTA: LAS PERSONAS JURÍDICAS PODRÁN ENTREGAR LOS CERTIFICADOS DE RETENCIÓN EN LA FUENTE, EN FORMA CONTINUA IMPRESA');
    doc.text(20, 195 + data, 'POR COMPUTADOR, SIN NECESIDAD DE FIRMA AUTÓGRAFA (D.R. 836/91)LOS DOCUMENTOS QUE SE ENCUENTRAN ALMACENADOS EN');
    doc.text(20, 200 + data, 'MEDIOS MAGNÉTICOS O ELECTRÓNICOS PUEDAN SER IMPRESOS EN CUALQUIER PARTE UTILIZANDO EL COMPUTADOR, YA SEA EN LA SEDE');
    doc.text(20, 205 + data, 'DEL AGENTE DE RETENCIÓN O EN LA SEDE DEL RETENIDO (CONCEPTO DIAN 105489 DE 24-12-2007).LA UTILIZACIÓN DE ESTE CERTIFICADO');
    doc.text(20, 210 + data, 'EN LAS DECLARACIONES TRIBUTARIAS QUE SE SURTAN ANTE LAS AUTORIDADES COMPETENTES ES RESPONSABILIDAD EXCLUSIVA DE LA(S)');
    doc.text(20, 215 + data, 'PERSONA(S) EN CUYO FAVOR SE EXPIDE.');


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 260);
    doc.text(50, 230 + data, 'Calle 119 No. 7–75 Teléfono: 6030303 Fax: 6575714 Bogotá, D.C');
    doc.text(90, 235 + data, 'www.fsfb.org.co');

    doc.save(`RETEFUENTE-${this.datos.nitTercero}.pdf`);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 8000);

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.certifiedMunicipalityDos = false;
    this.descarga = false;

  }

  downloadPDFCuentasParticipación2() {
    let filtradorAnio = this.dataCuentasParticipacion.adjuntos.filter(item => item.anio == this.datos.year);

    for (let index = 0; index < filtradorAnio.length; index++) {
      let element = filtradorAnio[index];
      let linkSource = `data:application/pdf;base64,${element.base64}`;
      let downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = element.nombre;
      downloadLink.click();

    }

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.certifiedMunicipalityDos = false;
    this.descarga = false;

  }
  downloadPDFCuentasParticipación() {

    var mes = this.fecha.getMonth() + 1;
    var mesCompleto = "";
    if (mes <= 9) {
      mesCompleto += '0' + mes;
    } else {
      mesCompleto = "" + mes;
    }


    var fecha = `${this.fecha.getDate()}/${mesCompleto}/${this.fecha.getFullYear()}`;
    var ciudad = this.datos.crMunicipio;
    var ciudadDos;

    if (ciudad === 1) {
      ciudad = 'en la ciudad de BOGOTÁ D.C.';
      ciudadDos = 'BOGOTÁ D.C.';
    } else if (ciudad === 3) {
      ciudad = 'en el municipio de CHIA';
      ciudadDos = 'CHIA';
    } else if (ciudad === 2) {
      ciudad = 'en el municipio de MADRID';
      ciudadDos = 'MADRID';
    }

    var logo = new Image();
    //logo.src = '/assets/images/fsfb.png';
    logo.src = '/wps/contenthandler/dav/fs-type1/themes/PROVEEDORES-Home/images/santafelogo.png';

    let doc = new jsPDF('', '', [600, 1000]);
    doc.addImage(logo, 'JPEG', 10, 5, 50, 20);
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(58, 25, `CERTIFICADO DE RETENCIÓN EN LA FUENTE POR CUENTAS`);
    doc.text(90, 30, `AÑO GRAVABLE ${this.datos.year}`);
    doc.text(75, 35, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(92, 40, 'NIT: 860037950 - 2');
    doc.text(72, 45, 'CALLE 119 No. 7 - 75 TELÉFONO 6030303');
    doc.text(85, 50, 'BOGOTÁ D.C - COLOMBIA');

    doc.text(96, 60, 'CERTIFICA');
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);
    doc.text(20, 65, `Que durante el periodo comprendido entre ${this.fechaUno} y ${this.fechaDos} ${ciudad} se práctico`);
    doc.text(20, 70, `y consignó retención en la fuente Título de Renta a:`);

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);

    var datos: any;
    var identificacion: any;

    if (this.dataUsuariosPJ === null) {

      datos = this.dataUsuariosPN.datosPNApellidos + " " + this.dataUsuariosPN.datosPNNombres;
      identificacion = this.dataUsuariosPN.datosPNIdentificacion;

    } else {
      datos = this.dataUsuariosPJ.datosPJ.datosPJRazonSocial;
      identificacion = this.dataUsuariosPJ.datosPJ.datosPJIdentificacion;
    }

    var titulo = 105;
    var tamañotITULO = datos.length;
    doc.text(titulo - tamañotITULO, 85, `${datos.toUpperCase()}`);
    doc.text(97, 90, `${identificacion}`);

    doc.text(20, 105, 'PERIODO');
    doc.text(45, 105, 'CONCEPTO');
    doc.text(114, 105, 'BASE');
    doc.text(134, 105, '%');
    doc.text(170, 105, 'RETENCIÓN');

    //  Porcentajes PDF
    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(10);


    var data: number = 0;
    var retenido: number = 0;
    var base: number = 0;

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      retenido += element.retencion;

    }

    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      base += element.base;

    }

    var retenidoTexto = trans.NumerosALetras(retenido) + " PESOS MCTE";


    for (let index = 0; index < this.listaDatosAnual.length; index++) {
      const element = this.listaDatosAnual[index];

      data = data + 5

      doc.setFontSize(8);
      doc.text(20, 110 + data, element.periodo);
      doc.text(45, 110 + data, element.concepto);
      doc.text(113, 110 + data, new Intl.NumberFormat("de-DE").format(element.base.toString()), { align: 'right' });
      doc.text(157, 110 + data, `${element.porcentaje.toString()}`);
      doc.text(190, 110 + data, new Intl.NumberFormat("de-DE").format(element.retencion.toString()), { align: 'right' });

    }
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(45, 120 + data, `TOTAL`);
    doc.text(113, 120 + data, `${new Intl.NumberFormat("de-DE").format(base)}`);
    doc.text(179, 120 + data, `${new Intl.NumberFormat("de-DE").format(retenido)}`);



    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 130 + data, `VALOR RETENIDO:  $${new Intl.NumberFormat("de-DE").format(retenido)}`);
    doc.setFontSize(8);
    doc.text(20, 135 + data, `${retenidoTexto.slice(0, -12).toUpperCase().replace("DE", "")}`);
    doc.setFont('helvetica');
    doc.setFontType('normal');

    doc.setFontSize(7);
    doc.text(20, 145 + data, 'LA BASE DE RETENCIÓN EN LA FUENTE, CORRESPONDE AL 100% DE SUS INGRESOS MENOS LAS DEDUCCIONES DE LEY SEGÚN EL ARTÍCULO');
    doc.text(20, 150 + data, '126 DEL ESTATUTO TRIBUTARIO (AFC, APORTES OBLIGATORIOS Y/O VOLUNTARIOS DE PENSIÓN), EN CASO DE TENERLOS.');

    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.text(20, 170 + data, 'FUNDACIÓN SANTA FE DE BOGOTÁ');
    doc.text(20, 175 + data, 'NIT: 860037950-2');
    doc.text(20, 180 + data, `FECHA DE EXPEDICIÓN:  ${fecha.toString()}`);

    doc.setFont('helvetica');
    doc.setFontType('normal');
    doc.setFontSize(7);
    doc.text(20, 190 + data, 'NOTA: LAS PERSONAS JURÍDICAS PODRÁN ENTREGAR LOS CERTIFICADOS DE RETENCIÓN EN LA FUENTE, EN FORMA CONTINUA IMPRESA');
    doc.text(20, 195 + data, 'POR COMPUTADOR, SIN NECESIDAD DE FIRMA AUTÓGRAFA (D.R. 836/91)LOS DOCUMENTOS QUE SE ENCUENTRAN ALMACENADOS EN');
    doc.text(20, 200 + data, 'MEDIOS MAGNÉTICOS O ELECTRÓNICOS PUEDAN SER IMPRESOS EN CUALQUIER PARTE UTILIZANDO EL COMPUTADOR, YA SEA EN LA SEDE');
    doc.text(20, 205 + data, 'DEL AGENTE DE RETENCIÓN O EN LA SEDE DEL RETENIDO (CONCEPTO DIAN 105489 DE 24-12-2007).LA UTILIZACIÓN DE ESTE CERTIFICADO');
    doc.text(20, 210 + data, 'EN LAS DECLARACIONES TRIBUTARIAS QUE SE SURTAN ANTE LAS AUTORIDADES COMPETENTES ES RESPONSABILIDAD EXCLUSIVA DE LA(S)');
    doc.text(20, 215 + data, 'PERSONA(S) EN CUYO FAVOR SE EXPIDE.');


    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 260);
    doc.text(50, 230 + data, 'Calle 119 No. 7–75 Teléfono: 6030303 Fax: 6575714 Bogotá, D.C');
    doc.text(90, 235 + data, 'www.fsfb.org.co');

    doc.save(`RETEFUENTE-${this.datos.nitTercero}.pdf`);

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinnerService.hide();
    }, 8000);

    this.resolvePassword.reset();
    this.certifiedYear = false;
    this.certifiedPeriodicity = false;
    this.certifiedPeriodicityDos = false;
    this.certifiedPeriod = false;
    this.certifiedMunicipality = false;
    this.certifiedMunicipalityDos = false;
    this.descarga = false;



  }


  close(): void {
    window.location.href = '/wps/portal/terceros/inicio';
  }



  private _filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.servicios.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private __filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.servicios.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  numberWithPoints(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  displayFn(item) {
    return item ? item.descripcion : undefined;
  }


}
