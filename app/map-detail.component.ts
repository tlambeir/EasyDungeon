import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Map }        from './map';
import { MapService } from './map.service';
import { FileUploadComponent } from './file-upload.component';

@Component({
    selector: 'my-map-detail',
    templateUrl: 'app/map-detail.component.html',
    styleUrls: ['app/detail.component.css'],
    directives: [FileUploadComponent]
})
export class MapDetailComponent implements OnInit, OnDestroy {
    @Input() map: Map;
    @Output() close = new EventEmitter();
    error: any;
    sub: any;
    navigated = false; // true if navigated here
    constructor(
        private mapService: MapService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.navigated = true;
                this.mapService.getMap(id)
                    .then(map => this.map = map);
            } else {
                this.navigated = true;
                this.map = new Map();
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {
        this.mapService
            .save(this.map)
            .then(map => {
                this.map = map; // saved map, w/ id if new
                this.goBack(map);
            })
            .catch(error => this.error = error); // TODO: Display error message
    }
    goBack(savedMap: Map = null) {
        this.close.emit(savedMap);
        if (this.navigated) { window.history.back(); }
    }
}
