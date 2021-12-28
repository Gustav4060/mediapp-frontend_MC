import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Paciente } from "src/app/_model/paciente";
import { Signo } from "src/app/_model/signo";
import { PacienteService } from "src/app/_service/paciente.service";
import { SignosVitalesService } from "src/app/_service/signos-vitales.service";
import { SignosVitalesPacienteComponent } from "../signos-vitales-paciente/signos-vitales-paciente.component";

@Component({
  selector: "app-signos-vitales-edicion",
  templateUrl: "./signos-vitales-edicion.component.html",
  styleUrls: ["./signos-vitales-edicion.component.css"],
})
export class SignosVitalesEdicionComponent implements OnInit {
  id: number;
  signo: Signo;
  form: FormGroup;
  edicion: boolean = false;
  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  pacientes: Paciente[];
  pacientesFiltrados$: Observable<Paciente[]>;
  myControlPaciente: FormControl = new FormControl();

  constructor(
    private signoService: SignosVitalesService,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    public dialog: MatDialog
  ) {}

  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  ngOnInit(): void {
    this.signo = new Signo();

    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      idSigno: new FormControl(0),
      fecha: new FormControl(new Date()),
      temperatura: new FormControl(""),
      pulso: new FormControl(""),
      ritmoRespitatorio: new FormControl(""),
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.edicion = params["id"] != null;
      this.initForm();
    });
    this.listarPacientesFiltros();
    this.pacienteService.getUnPacienteCambio().subscribe((data) => {
      this.listarPacientesFiltros();
      this.myControlPaciente.setValue(data);
    });
  }

  listarPacientesFiltros() {
    this.listarPacientes();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(
      map((val) => this.filtrarPacientes(val))
    );
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe((data) => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(
        (el) =>
          el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
          el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) ||
          el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(
      (el) =>
        el.nombres.toLowerCase().includes(val?.toLowerCase()) ||
        el.apellidos.toLowerCase().includes(val?.toLowerCase()) ||
        el.dni.includes(val)
    );
  }

  initForm() {
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe((data) => {
        this.pacienteService.listarPorId(data.idPaciente).subscribe((da) => {
          this.myControlPaciente.setValue(da);
          this.form = new FormGroup({
            paciente: this.myControlPaciente,
            idSigno: new FormControl(data.idSigno),
            fecha: new FormControl(data.fecha),
            temperatura: new FormControl(data.temperatura),
            pulso: new FormControl(data.pulso),
            ritmoRespitatorio: new FormControl(data.ritmoRespitatorio),
            idPaciente: new FormControl(data.idPaciente),
          });
        });
      });
    }
  }
  operar() {
    this.signo.idSigno = this.form.value["idSigno"];
    this.signo.fecha = this.form.value["fecha"];
    this.signo.temperatura = this.form.value["temperatura"];
    this.signo.pulso = this.form.value["pulso"];
    this.signo.ritmoRespitatorio = this.form.value["ritmoRespitatorio"];
    this.signo.idPaciente = this.form.value["paciente"].idPaciente;

    if (this.signo != null && this.signo.idSigno > 0) {
      this.signoService
        .modificar(this.signo)
        .pipe(
          switchMap(() => {
            return this.signoService.listar();
          })
        )
        .subscribe((data) => {
          this.signoService.setSignoCambio(data);
          this.signoService.setMensajeCambio("Se modificó");
        });
    } else {
      this.signoService.registrar(this.signo).subscribe((data) => {
        this.signoService.listar().subscribe((especialidad) => {
          this.signoService.setSignoCambio(especialidad);
          this.signoService.setMensajeCambio("Se registró");
        });
      });
    }

    this.router.navigate(["/pages/signos-vitales"]);
  }

  abrirDialogo() {
    this.dialog.open(SignosVitalesPacienteComponent, {
      width: "280px",
    });
  }
}
