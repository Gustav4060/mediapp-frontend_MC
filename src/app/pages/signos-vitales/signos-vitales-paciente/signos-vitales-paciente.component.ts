import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { Paciente } from "src/app/_model/paciente";
import { PacienteService } from "src/app/_service/paciente.service";

@Component({
  selector: "app-signos-vitales-paciente",
  templateUrl: "./signos-vitales-paciente.component.html",
  styleUrls: ["./signos-vitales-paciente.component.css"],
})
export class SignosVitalesPacienteComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SignosVitalesPacienteComponent>,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      nombres: new FormControl(""),
      apellidos: new FormControl(""),
      dni: new FormControl(""),
      telefono: new FormControl(""),
      direccion: new FormControl(""),
      email: new FormControl(""),
    });
  }
  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value["id"]; //this.form.get('idPaciente').value;
    paciente.nombres = this.form.value["nombres"];
    paciente.apellidos = this.form.value["apellidos"];
    paciente.dni = this.form.value["dni"];
    paciente.telefono = this.form.value["telefono"];
    paciente.direccion = this.form.value["direccion"];
    paciente.email = this.form.value["email"];

    this.pacienteService.registrar(paciente).subscribe(
      (data: any) => {
        console.log(data);
        this.pacienteService.setUnPacienteCambio(data);
        this.pacienteService.setMensajeCambio("SE REGISTRO");
      },
      (err) => {
        console.log("prueba de error " + err);
      }
    );
    this.cerrar();
  }
  cerrar() {
    this.dialogRef.close();
    this.router.navigate(["/pages/signos-vitales/nuevo"]);
  }
}
