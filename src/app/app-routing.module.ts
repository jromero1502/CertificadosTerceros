import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarCertificadoComponent } from './component/logeado/generar-certificado/generar-certificado.component';
import { PruebaComponent } from './component/prueba/prueba.component';

const routes: Routes = [
  {
    path: '',
    component: GenerarCertificadoComponent
  },
  {
    path: 'prueba',
    component: PruebaComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
