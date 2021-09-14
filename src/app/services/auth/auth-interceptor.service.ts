import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert'
import { GenerateCertificateService } from '../generateCertificate/generate-certificate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(public service: GenerateCertificateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          swal({
            title: 'No autenticado',
            text: 'Su sesión ha caducado. Inicie sesión nuevamente.',
            icon: 'error'
          }).then(() => this.service.logout())
        }

        if (err.status == 403) {
          swal({
            title: 'No autorizado',
            text: 'Usted no tiene permitido realizar esta acción.',
            icon: 'error',
          });
        }
        return throwError(err)
      })
    )
  }
}
