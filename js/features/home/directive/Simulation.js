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


class ForceGraph {

    constructor(scope, element, attrs) {

        var canvas = document.createElement("canvas");
        element[0].appendChild(canvas);


        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:
        path.lineTo(start.add([200, -50]));
        // Draw the view now:

        paper.view.viewSize = new paper.Size(700, 600);


        for (var i = 0; i < 10; i++) {
            var ball = new Ball(i * 40, i * 40, i * 10);
        }


        paper.view.draw();


    }

}


export default () => {
    return {
        restrict: 'E',
        scope: {
            seq1: "@seq1",
            seq2: "@seq2"
        },
        link: function () {
            return new ForceGraph(...arguments)
        }
    }
};