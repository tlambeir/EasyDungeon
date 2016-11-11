import { Injectable }    from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Dashboard } from './dashboard';

export class DashboardService {
    public dashboard:Dashboard;

    constructor() { }

    getDashboard() {
        console.log('getDashboard');
        return JSON.parse(this.getCookie("dashboard"));
    }

    setDashboard(dashboard){
        this.setCookie("dashboard", JSON.stringify(dashboard),360)
    }
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

}
