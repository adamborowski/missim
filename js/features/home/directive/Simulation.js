import * as paper from "paper"
import './Simulation.less'
class ForceGraph {

    constructor(scope, element, attrs) {


        this.element = element;
        debugger;
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