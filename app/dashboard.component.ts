import { Component, OnInit } from '@angular/core';
import { Router }           from '@angular/router';

import { Dashboard }        from './dashboard';
import { DashboardService } from './dashboard.service';
import { Map }                from './map';
import { MapService } from './map.service';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    dashboard: Dashboard;
    maps: Map[];

    constructor(
        private router: Router,
        private dashboardService: DashboardService,
        private mapService: MapService) {
    }

    ngOnInit() {
        this.mapService.getMaps()
            .then(maps => this.maps = maps);
        this.dashboard = this.dashboardService.getDashboard();
        console.info('dashboard loaded',this.dashboard);

    }

    start(){
        this.router.navigate(['dungeon']);
    }

    onChange(dashboard){
        console.info('dashboard change',dashboard);
        this.dashboardService.setDashboard(this.dashboard);
    }

}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */