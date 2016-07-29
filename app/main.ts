// The usual bootstrapping imports
import { bootstrap }      from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent }         from './app.component';
import { appRouterProviders }   from './app.routes';
import {LocalStorageService, LocalStorageSubscriber} from 'angular2-localstorage/LocalStorageEmitter';

/*
 bootstrap(AppComponent, [
 appRouterProviders,
 HTTP_PROVIDERS
 ]);
 */
var appPromise = bootstrap(AppComponent, [
    appRouterProviders,
    HTTP_PROVIDERS,
    LocalStorageService
]);
LocalStorageSubscriber(appPromise);

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */