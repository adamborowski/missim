import * as d3 from "d3"
import './ForceGraph.less'
import * as Nt from "../../../vendor/ntseq.js"
class ForceGraph {

    prepareData(width, height, _seq1, _seq2) {
        _seq1 = _seq1.toUpperCase();
        _seq2 = _seq2.toUpperCase();
        var seq = (new Nt.Seq()).read(_seq1); //read string into seq

        var querySeq = (new Nt.Seq()).read(_seq2); //read string into seq
        var map = seq.mapSequence(querySeq); //alignment
        var seq1 = seq.sequence();//toString()
        var seq2 = map.best().alignmentMask().sequence();//GCG---CG--- .toString()

        console.log("seq1", seq1, "seq2", seq2);


        var offset = map.best().position; //


        //var match = seq2.match(".*[^\-]+");
        //if (match == null) {
        //    return {allNodes: [], edges: [], secondaryEdges: []};
        //}
        //seq2 = match[0];


        var nodes1 = [];
        var nodes2 = [];
        var allNodes = [];
        var edges = [];
        var secondaryEdges = [];

        var dy = 120;
        var sy = 150;
        var firstRowSpace = width / (seq1.length - 1) / 2;
        var secondRowSpace = width / (seq2.length - 1) / 2;
        var sx = width / 4;

        for (var i = 0; i < seq1.length; i++) {
            var node = {x: firstRowSpace * i + sx, y: sy, char: seq1.charAt(i)};
            nodes1[i] = node;
            allNodes.push(node);
            if (i > 0) {
                edges.push({source: allNodes[i - 1], target: node});
            }
        }
        var lastNode2;
        var numGaps = 0;
        for (var i = 0; i < seq2.length; i++) {
            if (true || seq2.charAt(i) == seq1.charAt(i + offset)) {
                var newChar = seq2.charAt(i);
                var node = {
                    x: secondRowSpace * (i - numGaps) + sx,
                    y: dy + sy,
                    char: _seq2.charAt(i),
                    free: newChar == '-'
                };
                nodes2[i] = node;
                allNodes.push(node);

                var source = nodes1[i + offset];
                if (source) {
                    secondaryEdges.push({
                        source: source,
                        target: node,
                        vertical: newChar != '-',
                        hidden: newChar == '-'
                    });
                }
                if (lastNode2) {
                    edges.push({source: lastNode2, target: node, gaps: numGaps});
                }
                lastNode2 = node;
                numGaps = 0;
            }
            else {
                numGaps++;
            }
        }
        //
        //var dd = 20;
        //
        //var p1 = {x: dd, y: dd, pilot: true, fixed: true};
        //allNodes.push(p1);
        //var p2 = {x: width - dd * 2, y: dd, pilot: true, fixed: true};
        //allNodes.push(p2);
        //var p3 = {x: dd, y: height - dd * 2, pilot: true, fixed: true};
        //allNodes.push(p3);
        //var p4 = {x: width - dd * 2, y: height - dd * 2, pilot: true, fixed: true};
        //allNodes.push(p4);
        //edges.push({source: p1, target: nodes1[0]});
        //edges.push({source: p2, target: nodes1[nodes1.length - 1]});
        //edges.push({source: p3, target: nodes2[0]});
        //edges.push({source: p4, target: nodes2[nodes2.length - 1]});
        return {allNodes, edges, secondaryEdges};
    }

    visualize(attrs) {
        var width = 800,
            height = 550;
        var data = this.prepareData(width, height, attrs.seq1, attrs.seq2);
        var fill = d3.scale.category20();


        var stage = 0;


        var force = d3.layout.force()
            .size([width, height])
            .nodes(data.allNodes) // initialize with a single node
            .links(data.edges)
            .linkDistance((a)=> {
                var space = 30;
                if (stage == 0) {
                    return space;
                }
                if (a.vertical || stage == 0) return 65;
                var number = ((a.gaps || 0) + 1) * space;
                console.log(number);
                return number;
            })
            .linkStrength(0.9)
            .charge(-100)
            .friction(0.6)
            .gravity(0.0003)
            .on("tick", tick);

        var svg = this.svg;
        svg.selectAll("*").remove();
        svg
            .
            attr("width", width)
            .attr("height", height)
        //.on("mousemove", mousemove)
        //.on("mousedown", mousedown);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        var nodes = force.nodes(),
            links = force.links(),
            node = svg.selectAll(".node"),
            link = svg.selectAll(".link");

        //var cursor = svg.append("circle")
        //    .attr("r", 30)
        //    .attr("transform", "translate(-100,-100)")
        //    .attr("class", "cursor");

        restart();

        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=> {
            data.edges.push(...data.secondaryEdges);
            stage = 1;
            restart();
        }, 1600);

        //function mousemove() {
        //    cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
        //}
        //
        //function mousedown() {
        //    var point = d3.mouse(this),
        //        node = {x: point[0], y: point[1]},
        //        n = nodes.push(node);
        //
        //    // add links to any nearby nodes
        //    nodes.forEach(function (target) {
        //        var x = target.x - node.x,
        //            y = target.y - node.y;
        //        if (Math.sqrt(x * x + y * y) < 30) {
        //            links.push({source: node, target: target});
        //        }
        //    });
        //
        //    restart();
        //}

        function tick() {
            link.attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        function restart() {
            link = link.data(links);

            node = node.data(nodes);

            var group = node.enter().insert("g", ".cursor")
                .attr("class", "node")
                .attr("data-letter", (a)=>a.char)
                .call(force.drag);

            group.append('circle')
                .attr("r", 15);
            group.append('text')
                .attr("class", "node-letter")
                .attr("dx", -5)
                .attr("dy", 5)

                .text((a)=>a.char);

            link.enter().insert("line", ".node")
                .attr("class", "link")
                .classed({
                    link: true,
                    vertical: (a)=>a.vertical == true,
                    hidden: (a)=>a.hidden,
                    free: (a)=>a.free
                });


            force.start();
        }
    }


    constructor(scope, element, attrs) {


        this.element = element;
        this.svg = d3.select(this.element[0]).append("svg");
        this.visualize(scope)
        scope.$watch("[seq1,seq2]", (value)=> {
            this.visualize(scope)
        });
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