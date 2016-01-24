import paper from "../../../vendor/paper-full.min.js"
import './Simulation.less'
import Arrow from "./sim/Arrow"

class Ball {
    constructor(x, y, r) {
        this.r = r;

        this.point = new paper.Point(x, y);

        var gradient = new paper.Gradient(["#ffcc33", 'black'], true);

        var ball = new paper.CompoundPath({
            children: [
                new paper.Path.Circle({
                    radius: r
                }),
                new paper.Path.Circle({
                    center: -r * 3 / 7,
                    radius: r / 4
                })
            ],
            fillColor: new paper.Color(gradient, 0, r, r * 8 / 8),
        });


        this.item = new paper.Group({
            children: [ball],
            transformContent: false,
            position: this.point
        });
    }
}

class PhysicSimulator {
    render(t_sec) {

    }
}

class SimToRealUnitConverter {
    constructor() {
        this.timeScale = 1;//ile razy szybciej chcemy odtwarzać
        this.pixelsPerMeter = 100;//jeden metr ma 100 pixeli na ekranie
    }

    getPixelsForMeters(meters) {
        return meters * this.pixelsPerMeter;
    }

    getRealTime(userTime) {
        return userTime * this.timeScale;
    }


}


class Simulator {

    drawScale() {
        var arrowWidth = this.converter.getPixelsForMeters(1);
        var margin = 20;
        var arrow = new Arrow(this.width - arrowWidth - margin, margin, this.width - margin, margin, true, "1 metr");
    }

    constructor(converter, $filter) {
        this.converter = converter;
        this.$filter = $filter;
        var width = this.width = 700;
        var height = this.height = 600;

        this.drawScale();




        this.letter = new paper.PointText({
            point: [width - 57, 50],
            fillColor: '#333333',
            fontFamily: 'Open Sans',
            fontSize: 15
        });

        this.radius = 0.25;//metry??
        this.ball = new Ball(0, 0, this.converter.getPixelsForMeters(this.radius));
        this.angle = 5;
        this.g = 9.81;
        this.lastRotation = 0;
        this.slopeStartY = this.radius * 2;

        //


        var angle = this.angle / 180 * Math.PI;

        var distance = Math.sqrt(width * width + height * height);

        this.line = new paper.Path({
            strokeColor: 'black',
            strokeWidth: 2,
            fillColor: '#553344',
            closed: true,
            segments: [
                [-1, 0],
                [width + 1, 0],
                [width + 1, height + 1],
                [-1, height + 1]
            ]
        });


    }

    updateSlope() {
        var angle = this.angle / 180 * Math.PI;
        var sx = 0;
        var sy = this.converter.getPixelsForMeters(this.slopeStartY);
        var ex = this.width;
        var ey = (ex - sx) / Math.cos(angle) * Math.sin(angle) + sy;

        this.line.segments[0].point.y = sy;
        this.line.segments[1].point.y = ey;
    }

    renderFrame(time) {
        this.letter.content = "" + this.$filter('number')(time, 2) + ' s.';

        var angle = this.angle / 180 * Math.PI;
        var sin_angle = Math.sin(angle);
        var cos_angle = Math.cos(angle);

        var t = this.converter.getRealTime(time);

        var s_t = 5 / 14 * this.g * sin_angle * t * t;

        var dx_t = s_t * cos_angle;
        var dy_t = s_t * sin_angle;


        var offx = sin_angle * this.radius;
        var offy = cos_angle * this.radius;


        this.ball.item.position.x = this.converter.getPixelsForMeters(dx_t + offx);
        this.ball.item.position.y = this.converter.getPixelsForMeters(dy_t - offy + this.radius * 2);


        var radius = this.radius;
        var length = 2 * Math.PI * this.radius;


        var d_w = s_t / (length) * 2 * Math.PI;

        d_w = d_w / Math.PI * 180;


        this.ball.item.rotate(d_w - this.lastRotation);


        this.lastRotation = d_w;

        this.updateSlope();

    }


}


class Simulation {

    constructor($filter, scope, element, attrs) {


        var canvas = document.createElement("canvas");
        element[0].appendChild(canvas);


        // Create an empty project and a view for the canvas:
        paper.setup(canvas);

        paper.view.viewSize = new paper.Size(700, 600);


        var simulator = new Simulator(new SimToRealUnitConverter(), $filter);


        simulator.renderFrame(attrs.time);

        scope.$watch("time", (value)=> {
            simulator.renderFrame(Number(value));
            paper.view.draw();
        });

        scope.$watch("angle", (value)=> {
            simulator.angle = Number(value);
            simulator.renderFrame(Number(attrs.time));
            paper.view.draw();
        });

        //scope.$watch("radius", (value)=> {
        //    simulator.radius = Number(value);
        //    simulator.renderFrame(Number(attrs.time));
        //    paper.view.draw();
        //});

        paper.view.draw();


    }

}


export default ($filter) => {
    return {
        restrict: 'E',
        scope: {
            time: "@time",
            angle: "@angle",
            radius: "@radius",
        },
        link: function () {
            return new Simulation($filter, ...arguments)
        }
    }
};