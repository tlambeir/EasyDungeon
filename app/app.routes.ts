import { provideRouter, RouterConfig }  from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { MapsComponent } from './maps.component';
import { MapDetailComponent } from './map-detail.component';
import { DungeonComponent } from './dungeon.component';

const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/dungeon',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'heroes/detail/:id',
        component: HeroDetailComponent
    },
    {
        path: 'heroes/detail',
        component: HeroDetailComponent
    },
    {
        path: 'maps/detail/:id',
        component: MapDetailComponent
    },
    {
        path: 'maps/detail',
        component: MapDetailComponent
    },
    {
        path: 'maps',
        component: MapsComponent
    },
    {
        path: 'heroes',
        component: HeroesComponent
    },
    {
        path: 'dungeon',
        component: DungeonComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */