import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Map } from './map';

@Injectable()
export class MapService {

    private mapsUrl = 'http://localhost:8000/maps';  // URL to web api

    constructor(private http: Http) { }

    getMaps(): Promise<Map[]> {
        return this.http.get(this.mapsUrl)
            .toPromise()
            /*.then(response => response.json().data)*/
            .then(response => response.json())
            .catch(this.handleError);
    }

    getMap(id: number) {

        let url = `${this.mapsUrl}/${id}`;

        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    saveMaps(maps: Map[]){
        for (let map of maps) {
            this.save(map);
        }
    }

    save(map: Map): Promise<Map>  {
        let saveMap = new Map;
        saveMap.id = map.id;
        saveMap.name = map.name;
        saveMap.imagePath = map.imagePath;
        saveMap.gridColor = map.gridColor;
        saveMap.gridEnabled = map.gridEnabled;
        saveMap.gridSeperation = map.gridSeperation;
        if (saveMap.id) {
            return this.put(saveMap);
        }
        return this.post(saveMap);
    }

    delete(map: Map) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.mapsUrl}/${map.id}`;

        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    // Add new Map
    private post(map: Map): Promise<Map> {

        let headers = new Headers({
            'Content-Type': 'application/json'});

        return this.http
            .post(this.mapsUrl, JSON.stringify(map), {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    // Update existing Map
    private put(map: Map) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.mapsUrl}/${map.id}`;

        return this.http
            .put(url, JSON.stringify(map), {headers: headers})
            .toPromise()
            .then(() => map)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}



/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */