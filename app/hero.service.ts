import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Hero } from './hero';

@Injectable()
export class HeroService {

    private heroesUrl = 'http://localhost:8000';  // URL to web api

    constructor(private http: Http) { }

    getHeroes(): Promise<Hero[]> {
        return this.http.get(this.heroesUrl)
            .toPromise()
            /*.then(response => response.json().data)*/
            .then(response => response.json())
            .catch(this.handleError);
    }

    getHero(id: number) {

        let url = `${this.heroesUrl}/?id=${id}`;

        return this.http
            .get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    saveHeroes(heroes: Hero[]){
        for (let hero of heroes) {
            this.save(hero);
        }
    }

    save(hero: Hero): Promise<Hero>  {
        let saveHero = new Hero;
        saveHero.id = hero.id;
        saveHero.name = hero.name;
        saveHero.posX = hero.posX;
        saveHero.posY = hero.posY;
        saveHero.imagePath = hero.imagePath;
        if (saveHero.id) {
            return this.put(saveHero);
        }
        return this.post(saveHero);
    }

    delete(hero: Hero) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.heroesUrl}/?id=${hero.id}`;

        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .catch(this.handleError);
    }

    // Add new Hero
    private post(hero: Hero): Promise<Hero> {

        console.dir(hero);
        let headers = new Headers({
            'Content-Type': 'application/json'});

        return this.http
            .post(this.heroesUrl, JSON.stringify(hero), {headers: headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    // Update existing Hero
    private put(hero: Hero) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let url = `${this.heroesUrl}/${hero.id}`;

        return this.http
            .put(url, JSON.stringify(hero), {headers: headers})
            .toPromise()
            .then(() => hero)
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