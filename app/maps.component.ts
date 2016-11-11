import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Dashboard }        from './dashboard';
import { DashboardService } from './dashboard.service';
import { Map }                from './map';
import { MapService }         from './map.service';
import { MapDetailComponent } from './map-detail.component';


@Component({
    selector: 'my-maps',
    templateUrl: 'app/maps.component.html',
    styleUrls:  ['app/maps.component.css'],
    directives: [MapDetailComponent],
    providers: [DashboardService]
})
export class MapsComponent implements OnInit {
    dashboard: Dashboard;
    maps: Map[];
    selectedMap: Map;
    addingMap = false;
    error: any;

    constructor(
        private router: Router,
        private dashboardService: DashboardService,
        private mapService: MapService) { }

    getMaps() {
        this.mapService
            .getMaps()
            .then(maps => this.maps = maps)
            .catch(error => this.error = error);
    }

    addMap() {
        this.addingMap = true;
        this.selectedMap = null;
    }

    close(savedMap: Map) {
        if (savedMap) { this.getMaps(); }
    }

    deleteMap(map: Map, event: any) {
        event.stopPropagation();
        this.mapService
            .delete(map)
            .then(res => {
                this.maps = this.maps.filter(h => h !== map);
                if (this.selectedMap === map) { this.selectedMap = null; }
            })
            .catch(error => this.error = error);
    }

    launchMap(map: Map, event: any){
        event.stopPropagation();
        this.dashboard = new Dashboard();
        this.dashboard.map = map;
        this.dashboardService.setDashboard(this.dashboard);
        this.router.navigate(['dungeon']);
    }

    ngOnInit() {
        this.getMaps();
        /*this.dashboard = this.dashboardService.getDashboard();*/
    }

    onSelect(map: Map) {
        this.selectedMap = map;
        this.gotoDetail();
    }

    gotoDetail() {
        if(this.selectedMap){
            this.router.navigate(['maps/detail', this.selectedMap.id]);
        } else {
            this.router.navigate(['maps/detail']);
        }
    }
}
