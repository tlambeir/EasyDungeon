import {Component, Input} from '@angular/core';
import { Headers, Http, Response, RequestOptions, Request, RequestMethod } from '@angular/http';
import { Hero }        from './hero';

@Component({
    selector: 'file-upload',
    inputs: ['imagePath'],
    template: `
    <input type="file" (change)="changeListener($event)">
    `,
    //directives: [FORM_DIRECTIVES]
})
export class FileUploadComponent {
    @Input() hero: Hero
    public file: File;
    public url: string;
    headers: Headers;

    constructor(private http: Http) {
        //set the header as multipart
        this.headers = new Headers();
        this.headers.set('Content-Type', 'multipart/form-data');
        this.url = 'http://localhost:8000/image';
    }

//onChange file listener
    changeListener($event): void {
        this.postFile($event.target);
    }

//send post file to server
    postFile(inputValue: any): void {
        let fd = new FormData();
        fd.append('file', inputValue.files[0]);
        // transformRequest: angular.identity,
        this.http
            .post(this.url, fd)
            .toPromise()
            .then(response => this.hero.imagePath = response.json().imagePath)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


}