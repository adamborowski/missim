import paper from "../../../vendor/paper-full.min.js"
import './Simulation.less'


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
                    center: r / 8,
                    radius: r / 3
                })
            ],
            fillColor: new paper.Color(gradient, 0, r, r / 8),
        });


        this.item = new paper.Group({
            children: [ball],
            transformContent: false,
            position: this.point
        });
    }
}


class Simulator {
    constructor() {
        this.letter = new paper.PointText({
            point: [50, 50],
            content: 'The contents of the point text',
            fillColor: 'black',
            fontFamily: 'Ubuntu',
            fontWeight: 'bold',
            fontSize: 25
        });
    }

    renderFrame(frame) {
        this.letter.content = "frame: " + frame;
    }


}


class Simulation {

    constructor(scope, element, attrs) {


        var canvas = document.createElement("canvas");
        element[0].appendChild(canvas);


        // Create an empty project and a view for the canvas:
        paper.setup(canvas);

        paper.view.viewSize = new paper.Size(700, 600);


        var simulator = new Simulator();


        simulator.renderFrame(attrs.frame);

        scope.$watch("frame", (value)=> {
            simulator.renderFrame(value);
            paper.view.draw();
        });

        paper.view.draw();


    }

}


export default () => {
    return {
        restrict: 'E',
        scope: {
            frame: "@frame",
        },
        link: function () {
            return new Simulation(...arguments)
        }
    }
};