import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidenciaService } from '../../service/incidencia.service';
import { Reporte } from 'src/app/admin_residentereporte/interfaces/reporte.interface';

@Component({
  selector: 'app-listado-reporte',
  templateUrl: './listado-reporte.component.html',
  styleUrls: ['./listado-reporte.component.css']
})
export class ListadoReporteComponent implements OnInit{

  mireporte: Reporte[] = [];

  estadoActual: string = '0';

  constructor(
    private incidenciaService: IncidenciaService,
    private route: ActivatedRoute,
    private router: Router
  ){}


  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      if(params['estado']){
        this.estadoActual = params['estado']
      }else{
        this.router.navigate([], {queryParams: {estado: '0'}, replaceUrl: true})
      }
      this.listarmireporte(this.estadoActual);
    })
  }

  listarmireporte(estado: string){
    const token = localStorage.getItem('token');
    if(!token){
      throw new Error('el token no existe')
    }

    this.incidenciaService.listarMiReporte(token, estado)
    .subscribe(reportes => {
      this.mireporte = reportes.map(item => {
        const url = item.incidencia_foto;
        const nombreImagen = 'imagen';

        return {
          ...item,
          incidencia_foto: nombreImagen,
          incidencia_foto_url: url,
        };
      });
    })
  }
}
