var text = {pre1: "ng new <nombre-proyecto> --routing",
                  pre2: "ng g service asignatura",
                  pre3: `ng g component components/listado\nng g component components/creacion`,
                  pre4: `export class Asignatura {
    id: number
    nombre: string
    descripcion: string
    creditos: number
    curso: number
    cuatrimestre: 'Primero' | 'Segundo'
}`,
                  pre5: `<h1 class="text-center">Listado de asignaturas</h1>
<div class="container my-5">
  <table class="table table-stripped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Créditos</th>
        <th>Curso</th>
        <th>Cuatrimestre</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let asignatura of asignaturas">
        <td>{{asignatura.id}}</td>
        <td>{{asignatura.nombre}}</td>
        <td>{{asignatura.descripcion}}</td>
        <td>{{asignatura.creditos}}</td>
        <td>{{asignatura.curso}}</td>
        <td>{{asignatura.cuatrimestre}}</td>
        <td>
          <a class="btn btn-primary" [routerLink]="['/editar', asignatura.id]">Editar</a>
          <a class="btn btn-danger"(click)="deleteAsignatura(asignatura.id)">Borrar</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
`,
                pre6: `import { Component, OnInit } from '@angular/core';
import { Asignatura } from '../../models/asignatura';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  asignaturas: Asignatura[]

  constructor(private listadoService: AsignaturaService) {
  }

  ngOnInit(): void {
    this.asignaturas = this.listadoService.getAsignaturas();
  }

  deleteAsignatura(_id){
    this.listadoService.deleteAsignatura(_id);
  }

}
`,
service: `import { Injectable } from '@angular/core';
import { Asignatura } from '../models/asignatura';


const AsignaturasDefault : Asignatura[] = [ ... ]  // Datos iniciales para la primera vez que accedas

const Asignaturas: Asignatura[] = JSON.parse(localStorage.getItem('asignaturas') ?? 'null') ?? AsignaturasDefault

function idDelUltimo() : number { ... }

var nextId = idDelUltimo() + 1


@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor() {}

  getAsignaturas() {
    return Asignaturas;
  }

  getAsignatura(_id: number) {
    return Asignaturas.find(asignatura => asignatura.id == _id)
  }

  addAsignatura(asignatura: Asignatura) {
    asignatura.id = nextId++
    Asignaturas.push(asignatura)
    localStorage.setItem('asignaturas', JSON.stringify(Asignaturas))
  }

  editAsignatura(editAsignatura: Asignatura) {
    const index = Asignaturas.findIndex(asignatura => asignatura.id == editAsignatura.id)

    Asignaturas[index] = editAsignatura
    localStorage.setItem('asignaturas', JSON.stringify(Asignaturas))
  }

  deleteAsignatura(_id : number) {
    const index = Asignaturas.findIndex(asignatura => asignatura.id == _id)
    Asignaturas.splice(index, 1)
    localStorage.setItem('asignaturas', JSON.stringify(Asignaturas))
    if (_id == nextId - 1) nextId = idDelUltimo() + 1
  }

}
`,
creacionForm: `<h1 class="text-center">{{ title }}</h1>
<div class="container my-5">
    <form>
        <div class="form-group">
            <label for="nombre">Nombre: </label>
            <input type="text" placeholder="Nombre" id="nombre" [(ngModel)]="asignatura.nombre" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="form-group">
            <label for="descripcion">Descripcion: </label>
            <textarea class="form-control" id="descripcion" rows="3" placeholder="Descripción" [(ngModel)]="asignatura.descripcion" [ngModelOptions]="{standalone: true}"></textarea>
        </div>
        <div class="form-group">
            <label for="creditos">Créditos: </label>
            <input type="number" placeholder="Créditos" id="creditos" min="1" [(ngModel)]="asignatura.creditos" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="form-group">
            <label for="anyo">Curso: </label>
            <input type="number" placeholder="Curso" id="curso" max="4" min="1" [(ngModel)]="asignatura.curso" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="form-group">
            <label for="cuatrimestre">Cuatrimestre:</label>
            <select class="form-control" id="cuatrimestre" [(ngModel)]="asignatura.cuatrimestre" [ngModelOptions]="{standalone: true}">
              <option>Primero</option>
              <option>Segundo</option>
            </select>
        </div>
        <div>
            <button class="btn btn-primary" (click)="enviar()">Enviar</button>
        </div>
    </form>
</div>

`,
creacionTS: `import { Component, OnInit } from '@angular/core';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { Asignatura } from '../../models/asignatura';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-creacion',
  templateUrl: './creacion.component.html',
  styleUrls: ['./creacion.component.css']
})
export class CreacionComponent implements OnInit {

  asignatura: Asignatura
  title: string

  constructor(
    private listadoService: AsignaturaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.asignatura = this.listadoService.getAsignatura(id)
        this.title = 'Edición de la asignatura ' + this.asignatura.nombre
      }
      else {
        this.asignatura = new Asignatura();
        this.title = 'Creación de asignaturas'
      }
    });
  }

  enviar(): void {
    if (this.asignatura.id) {
      this.listadoService.editAsignatura(this.asignatura)
    }
    else {
      this.listadoService.addAsignatura(this.asignatura)
    }
    this.router.navigate(['/'])
  }

}
`,
appModule : `import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListadoComponent } from './components/listado/listado.component';
import { CreacionComponent } from './components/creacion/creacion.component';
import { DetalleComponent } from './components/detalle/detalle.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListadoComponent,
    CreacionComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`,

generateModel: `ng g class asignatura`,

              }
      

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "20%";
  document.getElementById("mySidenav").style['min-width'] = "250px";
  document.getElementById("hamburger-contenido").style.display = "none";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mySidenav").style['min-width'] = "0";
  document.getElementById("hamburger-contenido").style.display = "inline-block";
}

document.addEventListener('DOMContentLoaded', function() {
  for(t in text){
    console.log(t)
    document.getElementById(t).textContent = text[t]
  }
})

