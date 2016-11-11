import { Component, OnInit }          from '@angular/core';
import { Router, ROUTER_DIRECTIVES }  from '@angular/router';

import { HeroService }        from './hero.service';
import { MapService }        from './map.service';

@Component({
    selector: 'my-app',
    template: `
    <div>
        <router-outlet></router-outlet>
        <div style="position: absolute;left: 10px; top: 10px; background: white; display: inline-block; padding: 10px; border 1px solid #000">
            <h1>{{title}}</h1>
            <nav>
              <a [routerLink]="['/heroes']" routerLinkActive="active">Heroes</a>
              <a [routerLink]="['/maps']" routerLinkActive="active">Maps</a>
              <a [routerLink]="['/dungeon']" routerLinkActive="active">Dungeon</a>
            </nav>
        </div>
    </div>
  `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        HeroService,
        MapService
    ]
})
export class AppComponent implements OnInit {
    title = 'EasyDungeon';
    constructor(
        private router: Router) {
    }
    ngOnInit() {
        console.log(this.router.url)
    }

}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */