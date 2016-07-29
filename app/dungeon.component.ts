import { Component, ViewChild} from '@angular/core';
import { Router }           from '@angular/router';
import { Hero }        from './hero';
import { HeroService } from './hero.service';
import { Map }        from './map';
import { MapService } from './map.service';
import { Dashboard }        from './dashboard';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'dungeon',
    templateUrl: 'app/dungeon.component.html',
})
export class DungeonComponent{
    @ViewChild('layout') canvasRef;
    heroes: Hero[] = [];
    canvas:any;
    map:Map;
    activeHero:Hero;
    dashboard:Dashboard;

    constructor(
        private router: Router,
        private heroService: HeroService,
        private mapService: MapService,
        private dashboardService: DashboardService) {
    }

    dungeon : any;
    ball   = new Image;
    startX : any;
    startY : any;

    drawGrid() {
        let gridOptions = {
            majorLines: {
                separation: this.map.gridSeperation,
                color: this.map.gridColor
            }
        };

        this.drawGridLines(gridOptions.majorLines);

        return;
    }

    drawGridLines(lineOptions) {

        let iWidth = this.canvas.width;
        let iHeight = this.canvas.height;

        let ctx = this.canvas.getContext('2d');

        ctx.strokeStyle = lineOptions.color;
        ctx.strokeWidth = 1;

        ctx.beginPath();

        let xCount = null;
        let yCount = null;
        let i = null;
        let x = null;
        let y = null;
        let startX = this.canvas.width / 2 - this.dungeon.width / 2;
        let startY = this.canvas.height / 2 - this.dungeon.height / 2;
        this.startX  = startX;
        this.startY  = startY;

        xCount = Math.floor(this.dungeon.width / lineOptions.separation);
        yCount = Math.floor(this.dungeon.height / lineOptions.separation);

        for (i = 0; i <= yCount; i++) {
            y = startY + (i * lineOptions.separation);
            ctx.moveTo(startX, y);
            ctx.lineTo(this.canvas.width / 2 + this.dungeon.width / 2, y);

        }
        ctx.stroke();

        for (i = 0; i <= xCount; i++) {
            x = startX + (i * lineOptions.separation);
            ctx.moveTo(x, startY);
            ctx.lineTo(x, this.canvas.height / 2 + this.dungeon.height / 2);

        }
        ctx.stroke();

        ctx.closePath();

        return;
    }


    redraw(ctx){
        // Clear the entire this.canvas
        let p1 = ctx.transformedPoint(0,0);
        let p2 = ctx.transformedPoint(this.canvas.width,this.canvas.height);
        ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        ctx.drawImage(this.dungeon, this.canvas.width / 2 - this.dungeon.width / 2,
            this.canvas.height / 2 - this.dungeon.height / 2);

        this.drawGrid();
        this.drawHeroes(ctx)
    }

    zoom = function(clicks, ctx, lastX, lastY, scaleFactor){
        let pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        let factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        this.redraw(ctx);
    }

    getHeroes() {
        return this.heroService
            .getHeroes()
            .then(result => this.heroes = result);
    }

    getMap(){
        return this.mapService
            .getMap(this.dashboard.map.id)
            .then(result => this.map = result);
    }

    drawHeroes(ctx){
        for (let hero of this.heroes) {
            if(!hero.dragged){
                let posx = this.startX + hero.posX * this.map.gridSeperation - this.map.gridSeperation/2;
                let posY = this.startY  + hero.posY *this.map.gridSeperation - this.map.gridSeperation/2;
                this.drawHero(hero, ctx, posx, posY);
            }
        }
    }

    degreesToRad(degrees){
        return degrees * Math.PI / 180;
    }

    drawHero(hero, ctx, posx, posY){
        ctx.translate( posx, posY );
        ctx.rotate( this.degreesToRad(hero.angle) );
        ctx.drawImage( hero.image, -this.map.gridSeperation/2 , -this.map.gridSeperation/2, this.map.gridSeperation, this.map.gridSeperation  );
        ctx.rotate( -this.degreesToRad(hero.angle) );
        ctx.translate( -posx, -posY );
        //ctx.drawImage(hero.image, posx, posY, this.map.gridSeperation, this.map.gridSeperation);
    }

    removeHero(hero){
        let ctx = this.canvas.getContext('2d');
        let posx = this.startX + hero.posX * this.map.gridSeperation - this.map.gridSeperation;
        let posY = this.startY  + hero.posY * this.map.gridSeperation - this.map.gridSeperation;
        ctx.clearRect(posx,posY,this.map.gridSeperation,this.map.gridSeperation);
        this.redraw(ctx);
    }


    turnHero(angle){
        this.activeHero.angle = angle;
        let ctx = this.canvas.getContext('2d');
        this.redraw(ctx);
        this.heroService.save(this.activeHero);
    }


    isHero(evt, lastX, lastY){
        let isHero = false;
        for (let hero of this.heroes) {
            let posx = this.startX + hero.posX * this.map.gridSeperation - this.map.gridSeperation;
            let posY = this.startY  + hero.posY * this.map.gridSeperation - this.map.gridSeperation;
            if(this.collides(posx, posY, lastX, lastY)){
                hero.oldX = hero.posX;
                hero.oldY = hero.posY;
                isHero = true;
                hero.dragged = true;
                this.removeHero(hero);
            }
        }
        return isHero;
    }

    collides(posx, posY, x, y) {
        let isCollision = false;

        let left = posx, right = posx+this.map.gridSeperation;
        let top = posY, bottom = posY+this.map.gridSeperation;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) {
            isCollision = true;
        }
        return isCollision;
    }

    draggedHeroLastX: any;
    draggedHeroLastY: any;
    dragHero(x,y){
        let ctx = this.canvas.getContext('2d');
        for (let hero of this.heroes) {
            if(hero.dragged){
                this.draggedHeroLastX = x;
                this.draggedHeroLastY = y;
                this.drawHero(hero, ctx, x, y);
            }
        }
    }

    positionHero(x,y){
        let ctx = this.canvas.getContext('2d');
        for (let hero of this.heroes) {
            if(hero.dragged){
                this.draggedHeroLastX = null;
                this.draggedHeroLastY = null;
                let newPosX = Math.ceil((x-this.startX)/this.map.gridSeperation);
                let newPosY = Math.ceil((y-this.startY)/this.map.gridSeperation);
                let taken = false;
                for (let otherHero of this.heroes) {
                    if(otherHero.id != hero.id){
                        if(otherHero.posX == newPosX && otherHero.posY == newPosY){
                            taken = true;
                        }
                    }
                }
                if(!taken){
                    hero.posX = newPosX;
                    hero.posY = newPosY;
                    this.heroService.save(hero);
                }
                hero.dragged = false;
                this.redraw(ctx);
                this.activeHero = hero;
            }
        }
    }

    // loader will 'load' items by calling thingToDo for each item,
    // before calling allDone when all the things to do have been done.
        loader(items, thingToDo, allDone) {
        if (!items) {
            // nothing to do.
            return;
        }

        if ("undefined" === items.length) {
            // convert single item to array.
            items = [items];
        }

        let count = items.length;

        // this callback counts down the things to do.
        let thingToDoCompleted = function (items, i) {
            count--;
            if (0 == count) {
                allDone(items);
            }
        };

        for (let i = 0; i < items.length; i++) {
            // 'do' each thing, and await callback.
            thingToDo(items, i, thingToDoCompleted);
        }
    }

    loadImage(items, i, onComplete){
        let onLoad = function (e) {
            e.target.removeEventListener("load", onLoad);
            // notify that we're done.
            onComplete(items, i);
        }
        items[i].image = new Image();
        items[i].image.addEventListener("load", onLoad.bind(this), false);
        items[i].image.src = items[i].imagePath;
    }

    ngAfterViewInit() {
        this.canvas = this.canvasRef.nativeElement;

        let ctx = this.canvas.getContext('2d');
        this.trackTransforms(ctx);

        this.dashboard = this.dashboardService.getDashboard();


        this.dungeon = new Image;
        this.dungeon.onload = () => {
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.getHeroes().then(()=>{
                this.loader(this.heroes, this.loadImage, function () {
                    this.redraw(ctx);
                }.bind(this));
            });
        };
        this.getMap().then(
            ()=>{
                this.dungeon.src = this.map.imagePath;
            }
        );

        let lastX=this.canvas.width/2, lastY=this.canvas.height/2;
        let dragStart,dragged;

        let targetElement = document.body;
        targetElement.addEventListener('keydown', function (event) {
            let angle;
            if(this.activeHero){
                switch (event.keyCode) {
                    case 37:
                        angle = 90;
                        event.preventDefault();
                        this.turnHero(angle);
                        break;
                    case 38:
                        angle = 180;
                        event.preventDefault();
                        this.turnHero(angle);
                        break;
                    case 39:
                        angle = 270;
                        event.preventDefault();
                        this.turnHero(angle);
                        break;
                    case 40:
                        angle = 0
                        event.preventDefault();
                        this.turnHero(angle);
                        break;
                }

            }

        }.bind(this));

        this.canvas.addEventListener('mousedown',function(evt){
            lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            let pt = ctx.transformedPoint(lastX,lastY);
            if(this.isHero(evt, pt.x, pt.y)){
                //drag the hero
            } else {
                //drag the map
                //document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'; // breaks ts compilation
                dragStart = ctx.transformedPoint(lastX,lastY);
                dragged = false;
            }

        }.bind(this),false);
        this.canvas.addEventListener('mousemove',function(evt){
            lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            let pt = ctx.transformedPoint(lastX,lastY);
            dragged = true;
            if (dragStart){
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                this.redraw(ctx);
            }
            if(this.draggedHeroLastX && this.draggedHeroLastY && (this.draggedHeroLastX!==pt.x || this.draggedHeroLastY !==pt.y)){
                ctx.clearRect(this.draggedHeroLastX,this.draggedHeroLastY,this.map.gridSeperation,this.map.gridSeperation);
                this.redraw(ctx);
            }
            this.dragHero(pt.x, pt.y);
        }.bind(this),false);
        this.canvas.addEventListener('mouseup',function(evt){
            dragStart = null;
            if (!dragged) this.zoom(evt.shiftKey ? -1 : 1 , ctx, lastX, lastY, scaleFactor);
            let pt = ctx.transformedPoint(lastX,lastY);
            this.positionHero(pt.x, pt.y);
        }.bind(this),false);

        let scaleFactor = 1.1;

        //this.canvas.addEventListener('DOMMouseScroll',handleScroll,false);
        this.canvas.addEventListener('mousewheel',function(evt){
            let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
            if (delta) this.zoom(delta , ctx, lastX, lastY, scaleFactor);
            return evt.preventDefault() && false;
        }.bind(this),false);

    }

    trackTransforms(ctx){
        let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        let xform = svg.createSVGMatrix();
        ctx.getTransform = function(){ return xform; };

        let savedTransforms = [];
        let save = ctx.save;
        ctx.save = function(){
            savedTransforms.push(xform.translate(0,0));
            return save.call(ctx);
        };
        let restore = ctx.restore;
        ctx.restore = function(){
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        let scale = ctx.scale;
        ctx.scale = function(sx,sy){
            xform = xform.scaleNonUniform(sx,sy);
            return scale.call(ctx,sx,sy);
        };
        let rotate = ctx.rotate;
        ctx.rotate = function(radians){
            xform = xform.rotate(radians*180/Math.PI);
            return rotate.call(ctx,radians);
        };
        let translate = ctx.translate;
        ctx.translate = function(dx,dy){
            xform = xform.translate(dx,dy);
            return translate.call(ctx,dx,dy);
        };
        let transform = ctx.transform;
        ctx.transform = function(a,b,c,d,e,f){
            let m2 = svg.createSVGMatrix();
            m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
            xform = xform.multiply(m2);
            return transform.call(ctx,a,b,c,d,e,f);
        };
        let setTransform = ctx.setTransform;
        ctx.setTransform = function(a,b,c,d,e,f){
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx,a,b,c,d,e,f);
        };
        let pt  = svg.createSVGPoint();
        ctx.transformedPoint = function(x,y){
            pt.x=x; pt.y=y;
            return pt.matrixTransform(xform.inverse());
        }
    }
}
