import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Signo } from "src/app/_model/signo";
import { SignosVitalesService } from "src/app/_service/signos-vitales.service";
import { SignosVitalesPacienteComponent } from "./signos-vitales-paciente/signos-vitales-paciente.component";

@Component({
  selector: "app-signos-vitales",
  templateUrl: "./signos-vitales.component.html",
  styleUrls: ["./signos-vitales.component.css"],
})
export class SignosVitalesComponent implements OnInit {
  dataSource: MatTableDataSource<Signo>;
  displayedColumns: string[] = [
    "idSigno",
    "fecha",
    "temperatura",
    "pulso",
    "ritmoRespitatorio",
    "idPaciente",
    "acciones",
  ];
  cantidad: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signosService: SignosVitalesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signosService.getSignoCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.signosService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }
  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }


  crearTabla(data: Signo[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(signo: Signo) {
    this.signosService.eliminar(signo.idSigno).pipe(switchMap(() => {
      return this.signosService.listar();
    })).subscribe(data => {
      this.signosService.setSignoCambio(data);
      this.signosService.setMensajeCambio('Se eliminó');
    });
  }

  verificarHijos() {
    return this.route.children.length !== 0;
  }

 
}
