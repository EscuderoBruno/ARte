// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private pageTitleSource = new BehaviorSubject<string>('Dashboard');
  pageTitle = this.pageTitleSource.asObservable();

  private breadcrumbSource = new BehaviorSubject<string[]>([]);
  breadcrumb = this.breadcrumbSource.asObservable();

  updateBreadcrumb(title: string, breadcrumb: string[]) {
    this.pageTitleSource.next(title);
    this.breadcrumbSource.next(breadcrumb);
    var bc = document.getElementById('page-breadcrumb');
    if (title == "") {
      if (bc) {
        bc.style.display = 'none';
      }    
    } else {
      if (bc) {
        bc.style.display = 'block';
      }    
    }
  }

}
