import Slider from "bootstrap-slider/dist/bootstrap-slider.js"
import "./Slider.less"


export default () => {
    return {
        restrict: 'E',
        scope: {
            min: "=",
            max: "=",
            value: "="
        },
        link: function (scope, elements, attr) {
            var opt = {
                min: Number(scope.min),
                max: Number(scope.max),
                value: Number(scope.value)
            };
            if (opt.min > opt.max) {
                opt.reversed = true;
                var a = opt.max;
                opt.max = opt.min;
                opt.min = a;
            }

            var slider = new Slider(elements[0], opt);
            scope.$watch('min', (val)=> slider.min = Number(val));
            scope.$watch('max', (val)=> slider.max = Number(val));
            scope.$watch('value', (val)=> slider.setValue(Number(val)));
            slider.on('change', ()=> {
                scope.value = slider.getValue();
                scope.$apply();
            });

        }
    }
};