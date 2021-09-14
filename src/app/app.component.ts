import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { GenerateCertificateService } from './services/generateCertificate/generate-certificate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {





  constructor(private fb: FormBuilder,
              private generateCertificate: GenerateCertificateService,
              public spinnerService: NgxSpinnerService,
              ) { }

  ngOnInit(): void {

  }


}
