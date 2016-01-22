/**
 *  Defines the HomeController controller
 *
 *  @author  aborowski
 *  @date    Jan 20, 2016
 *
 */


export default class HomeController {
    test() {



    }
    constructor($scope, events, utils, HomeService, $alert) {

        $scope.$alert = $alert;

        var noty = function (type, msg) {
            events.emit('alert', {type: type, message: msg});
        };

        $scope.showSuccessNoty = function () {
            noty('success', 'This is success noti!!');
        };

        $scope.showErrorNoty = function () {
            noty('error', 'This is error noty');
        };

        $scope.showInfoNoty = function () {
            noty('info', 'This is info noty');
        };

        $scope.showInfo = function () {
            events.emit('info', {
                content: 'It\'s simple info dialog',
                onClose: function () {
                    noty('info', 'Dialog closed!');
                }
            });
        };

        $scope.showError = function () {
            events.emit('error', {
                content: 'It\'s error dialog',
                onClose: function () {
                    noty('info', 'Error Dialog closed!');
                }
            });
        };

        $scope.showConfirm = function () {
            events.emit('confirm', {
                content: 'It\'s confirm dialog',
                onConfirm: function () {
                    noty('info', 'Confirmed!');
                }
            });
        };

        $scope.showCustom = function () {
            events.emit('modal', {
                scope: $scope,
                title: 'It\'s custom dialog',
                animation: 'am-fade-and-slide-top',
                templateUrl: 'customTpl'
            });
        };

        $scope.closeCustom = function ($hide) {
            $hide();
            noty('info', 'custom modal closed!');
        };

        HomeService.getStates()
            .success(function (data) {
                $scope.states = data;
            });

        HomeService.getMenus()
            .success(function (data) {
                $scope.menus = data;
            });

        $scope.button = {radio: 'right'};

        HomeService.getDropdown()
            .success(function (data) {
                $scope.dropdowns = data;
            });

        $scope.selectTab = function (tab, $event) {
            utils.stopEvent($event);
            if (tab.active) {
                return;
            }
            tab.active = true;
            _.chain($scope.tabs)
                .reject({name: tab.name})
                .each(function (t) {
                    t.active = false;
                });
        };

        $scope.$on('$destroy', function () {
        });


        this.test()
    };
}
