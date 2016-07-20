import { Component }          from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';

import { HeroService }        from './hero.service';

@Component({
    selector: 'my-app',
    template: `
    <router-outlet></router-outlet>
    <div style="position: absolute;left: 10px; top: 10px; background: white; display: inline-block; padding: 10px; border 1px solid #000">
        <h1>{{title}}</h1>
        <nav>
          <a [routerLink]="['/dashboard']" routerLinkActive="active">Dashboard</a>
          <a [routerLink]="['/heroes']" routerLinkActive="active">Heroes</a>
        </nav>
    </div>
  `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HeroService,
    ]
})
export class AppComponent {
    title = 'EasyDungeon';
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */