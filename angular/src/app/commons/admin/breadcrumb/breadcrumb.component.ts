import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <div class="page-breadcrumb" id="page-breadcrumb">
      <div class="row">
          <div class="col-12 d-flex align-items-center"> <!-- Ajusta el tamaño de la columna según tu preferencia -->
              <h2 class="titulo-pagina" style="font-family: 'Nunito', sans-serif; color: #3A3A3A">{{ pageTitle }}</h2>
              <nav aria-label="breadcrumb">
                  <ol class="breadcrumb" style="padding-left: 30px; padding-top: 18px">
                      <li class="breadcrumb-item" *ngFor="let crumb of breadcrumb; let last = last" [ngClass]="{ active: last }">
                          <ng-container *ngIf="!last; else lastItem">{{ crumb }}</ng-container>
                          <ng-template #lastItem><strong>{{ crumb }}</strong></ng-template>
                      </li>
                  </ol>
              </nav>
          </div>
      </div>
      <div class="dropdown-divider" style="background-color: #8F8F8F; height: 2px; margin-bottom:10px"></div>
    </div>
  `,
  styles: [`
    .titulo-pagina {
      margin-top: 15px; /* Ajusta el valor según tu preferencia */
    }
    .breadcrumb {
      margin-right: 30px;
    }
  `],
})
export class BreadcrumbComponent implements OnInit {
  pageTitle = 'Default Title';
  breadcrumb: string[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.pageTitle.subscribe((title) => (this.pageTitle = title));
    this.breadcrumbService.breadcrumb.subscribe((breadcrumb) => (this.breadcrumb = breadcrumb));
  }
}

