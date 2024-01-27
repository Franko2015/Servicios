import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { TicketService } from 'src/app/Servicios/ticket/ticket.service';
import { TraductorService } from 'src/app/Servicios/traductor.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { UsuariosService } from 'src/app/Servicios/login/usuarios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/Servicios/error/error.service';
declare var require: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{
  @ViewChild('chart') chart: ElementRef | any;

  rut_usuario: any = localStorage.getItem("UserId")

  datos: any = [];
  chartData: any = [];
  SOPORTE: any
  TECNICO: any
  
  constructor(private traductor: TraductorService, private trad: TranslateService, private ticketService: TicketService, private usuariosService: UsuariosService, private errorService: ErrorService) {
    this.ticketService.getAll().subscribe({
      next: (data: any) => {
        this.datos = data;
        this.processData();
      },
    });
  }

  datosUsuario(){
    this.usuariosService.getOne(this.rut_usuario).subscribe({
      next: (data: any) => {
        if(data.tipo_cuenta == 'SOPORTE'){
          this.SOPORTE = data.tipo_cuenta
        }else if(data.tipo_cuenta == 'TECNICO'){
          this.TECNICO = data.tipo_cuenta
        }
      },
      error: (event: HttpErrorResponse) => {
        this.errorService.msjError(event);
      },
    })
  }

  processData() {
    // Aquí procesa los datos para obtener el conteo por día
    const countsByDay = this.datos.reduce((acc: any, ticket: any) => {
      const fecha = new Date(ticket.fecha_creacion).toLocaleDateString().split('-');
      const dia = fecha[0]
      const mes = fecha[1]
      const año = fecha[2]
      const nuevaFecha = `${dia}/${mes}/${año}`
      acc[nuevaFecha] = (acc[nuevaFecha] || 0) + 1;
      return acc;
    }, {});

    // Convierte los datos a un formato que pueda ser utilizado por el gráfico
    this.chartData = Object.keys(countsByDay).map((fecha) => ({
      name: fecha,
      value: countsByDay[fecha],
    }));
  }

  generarPDF() {
    const DATA: any = this.chart.nativeElement;
    const options = {
      background: 'transparent',
      scale: 3,
    };
  
    html2canvas(DATA, options).then((canvas: { toDataURL: (arg0: string) => any; height: number; width: number }) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      this.addTable(doc);
  
      const pdfWidth = canvas.width / 3;
      const pdfHeight = canvas.height / 3;
  
      const xPosition = (doc.internal.pageSize.width - pdfWidth) / 2;
      const yPosition = 10;

      const imagen = canvas.toDataURL("image/png");
      doc.addImage(imagen, 'PNG', xPosition, yPosition, pdfWidth, pdfHeight, undefined, 'FAST');
  
      doc.save('Reporte.pdf');
    });  
  }
  
  
  

  addTable(doc: any) {
    // Set up table data
    const headers = Object.keys(this.datos[0]);
    const rows = this.datos.map((row: any) => Object.values(row));
  
    // Configure table style
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 5,
      styles: {
        headStyles: { fillColor: [200, 200, 200] },
        cellWidth: 'auto',
        cellPadding: 1,
        angle: 'vertical', // Rotate the entire table horizontally
      },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 20 }, /* Add more columns if needed */ },
    });
  }
  

  addChart(doc: any) {
    // Create a sample chart with Chart.js
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Configure your chart here (replace this code with your own logic)
      const chartData = {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [{
          label: 'Dataset',
          data: [10, 20, 30],
          backgroundColor: ['red', 'green', 'blue'],
        }],
      };

      new Chart(ctx, {
        type: 'bar',
        data: chartData,
      });

      // Add chart to PDF
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'png', 15, 250, 300, 200);
    }
  }

  changeLanguage(lang: string) {
    this.traductor.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  getTranslation(key: string) {
    return this.trad.instant(key);
  }
}
