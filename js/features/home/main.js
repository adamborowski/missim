/**
 * ******************************************************************************************************
 *
 *   Defines a home feature
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 * ******************************************************************************************************
 */
'use strict';
import FeatureBase from 'lib/FeatureBase';
import Routes from './Routes';
import HomeController from './controller/HomeController';
import HomeService from './service/HomeService';
import customTpl from './partials/custom.html';
import ForceGraph from './directive/ForceGraph'

class Feature extends FeatureBase {

    constructor() {
        super('home');
        this.routes = Routes;
    }

    execute() {
        this.controller('HomeController', HomeController);
        this.service('HomeService', HomeService);
        this.directive("forceGraph", ForceGraph);
        this.run([
            '$templateCache',
            function($templateCache) {
                $templateCache.put('customTpl', customTpl);
            }
        ]);
    }
}

export default Feature;
