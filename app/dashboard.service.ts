import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Dashboard } from './dashboard';
import {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";

@Injectable()
export class DashboardService {
    @LocalStorage() public dashboard:Dashboard;

    constructor() { }

    getDashboard() {
        return this.dashboard;
    }

    setDashboard(dashboard){
        return this.dashboard = dashboard;
    }

}
