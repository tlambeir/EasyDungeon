import { Component, ViewChild} from '@angular/core';
import { Router }           from '@angular/router';
import { Hero }        from './hero';
import { HeroService } from './hero.service';

@Component({
    selector: 'dungeon',
    templateUrl: 'app/dungeon.component.html',
})
export class DungeonComponent{
    @ViewChild('layout') canvasRef;
    heroes: Hero[] = [];
    canvas:any;

    constructor(
        private router: Router,
        private heroService: HeroService) {
    }

    map : any;
    ball   = new Image;
    startX : any;
    startY : any;
    seperation = 75;

    drawGrid() {
        let gridOptions = {
            majorLines: {
                separation: this.seperation,
                color: '#FF0000'
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
        let startX = this.canvas.width / 2 - this.map.width / 2;
        let startY = this.canvas.height / 2 - this.map.height / 2;
        this.startX  = startX;
        this.startY  = startY;

        xCount = Math.floor(this.map.width / lineOptions.separation);
        yCount = Math.floor(this.map.height / lineOptions.separation);

        for (i = 0; i <= yCount; i++) {
            y = startY + (i * lineOptions.separation);
            ctx.moveTo(startX, y);
            ctx.lineTo(this.canvas.width / 2 + this.map.width / 2, y);
            ctx.stroke();
        }

        for (i = 0; i <= xCount; i++) {
            x = startX + (i * lineOptions.separation);
            ctx.moveTo(x, startY);
            ctx.lineTo(x, this.canvas.height / 2 + this.map.height / 2);
            ctx.stroke();
        }

        ctx.closePath();

        return;
    }


    redraw(ctx){
        // Clear the entire this.canvas
        let p1 = ctx.transformedPoint(0,0);
        let p2 = ctx.transformedPoint(this.canvas.width,this.canvas.height);
        ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        ctx.drawImage(this.map, this.canvas.width / 2 - this.map.width / 2,
            this.canvas.height / 2 - this.map.height / 2);

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
            .then(result => this.heroes = result)
            .catch(error => this.error = error);
    }

    drawHeroes(ctx){
        for (let hero of this.heroes) {
            let posx = this.startX + hero.posX * this.seperation - this.seperation;
            let posY = this.startY  + hero.posY * this.seperation - this.seperation*2;
            let heroImage = new Image;
            heroImage.onload = () => {
                ctx.drawImage(heroImage, posx, posY);
            };
            heroImage.src = hero.image;
        }
    }

    ngAfterViewInit() {
        this.canvas = this.canvasRef.nativeElement;

        let ctx = this.canvas.getContext('2d');
        this.trackTransforms(ctx);


        this.map = new Image;
        this.map.onload = () => {
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.getHeroes().then(()=>{
                this.redraw(ctx);
            });
        };
        this.map.src = 'images/map2.png';

        this.ball.src   = 'http://phrogz.net/tmp/alphaball.png';


        let lastX=this.canvas.width/2, lastY=this.canvas.height/2;
        let dragStart,dragged;
        this.canvas.addEventListener('mousedown',function(evt){
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            dragStart = ctx.transformedPoint(lastX,lastY);
            dragged = false;
        },false);
        this.canvas.addEventListener('mousemove',function(evt){
            lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
            dragged = true;
            if (dragStart){
                let pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                this.redraw(ctx);
            }
        }.bind(this),false);
        this.canvas.addEventListener('mouseup',function(evt){
            dragStart = null;
            if (!dragged) this.zoom(evt.shiftKey ? -1 : 1 , ctx, lastX, lastY, scaleFactor);
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
