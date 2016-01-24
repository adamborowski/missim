import paper from "../../../../vendor/paper-full.min.js"
export default class Arrow {
    constructor(sx, sy, ex, ey, isDouble, text) {
        var endPoints = this.calcArrow(sx, sy, ex, ey);
        var startPoints = this.calcArrow(ex, ey, sx, sy);

        var style = {
            strokeColor: '#333333',
            strokeWidth: 1
        };

        var e0 = endPoints[0],
            e1 = endPoints[1],
            e2 = endPoints[2],
            e3 = endPoints[3],
            s0 = startPoints[0],
            s1 = startPoints[1],
            s2 = startPoints[2],
            s3 = startPoints[3];
        var line = new paper.Path({
            segments: [
                [sx, sy],
                [ex, ey]
            ],
            style: style
        });
        var arrow1 = new paper.Path({
            segments: [
                [e0, e1],
                [ex, ey],
                [e2, e3]
            ],
            style: style
        });


        var group = new paper.Group([line, arrow1], {});
        if (isDouble === true) {
            var arrow2 = new paper.Path({
                segments: [
                    [s0, s1],
                    [sx, sy],
                    [s2, s3]
                ],
                style: style
            });

            group.addChild(arrow2);
        }


        if (text != null) {
            group.addChild(new paper.PointText({
                point: [(ex + sx) / 2, (sy + ey) / 2 - 5],
                content: text,
                fillColor: 'black',
                fontFamily: 'Open Sans',
                fontSize: 10,
                justification: 'center'
            }));
        }


    }

    calcArrow(px0, py0, px, py) {
        var points = [];
        var l = Math.sqrt(Math.pow((px - px0), 2) + Math.pow((py - py0), 2));
        points[0] = (px - ((px - px0) * Math.cos(0.5) - (py - py0) * Math.sin(0.5)) * 10 / l);
        points[1] = (py - ((py - py0) * Math.cos(0.5) + (px - px0) * Math.sin(0.5)) * 10 / l);
        points[2] = (px - ((px - px0) * Math.cos(0.5) + (py - py0) * Math.sin(0.5)) * 10 / l);
        points[3] = (py - ((py - py0) * Math.cos(0.5) - (px - px0) * Math.sin(0.5)) * 10 / l);
        return points;
    }

}