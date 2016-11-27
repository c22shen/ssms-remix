angular.module('app').directive('navBar', ['d3', '$rootScope', 'myConfig',

    function(d3, $rootScope, myConfig) {

        return {
            restrict: 'E',
            templateUrl: "/javascripts/angular-app/tpl/navbar.tpl.html",
            link: function postLink(scope, iElement, iAttrs) {
                var timeAvailable = {
                    0: {open: {hour: 0, minute: 0}, 
                        close: {hour: 0, minute: 0}},
                    1: {open: {hour: 8, minute: 30}, 
                        close: {hour: 21, minute: 0}},
                    2: {open: {hour: 8, minute: 30}, 
                        close: {hour: 21, minute: 0}},
                    3: {open: {hour: 8, minute: 30}, 
                        close: {hour: 21, minute: 0}},
                    4: {open: {hour: 8, minute: 30}, 
                        close: {hour: 21, minute: 0}},
                    5: {open: {hour: 8, minute: 30}, 
                        close: {hour: 21, minute: 0}},
                    6: {open: {hour: 10, minute: 0}, 
                        close: {hour: 17, minute: 0}}
            }






// Hours: 

// Sunday  Closed
// Monday  8:30AM–9PM
// Tuesday 8:30AM–9PM
// Wednesday   8:30AM–9PM
// Thursday    8:30AM–9PM
// Friday  8:30AM–9PM
// Saturday    10AM–5PM




                var currentTime = new moment({
                    h: new Date().getHours(),
                    m: new Date().getMinutes()
                });
                var weekDay = currentTime.weekday();

                var startHour = timeAvailable[weekDay].open.hour;
                var startMinute = timeAvailable[weekDay].open.minute;

                var endHour = timeAvailable[weekDay].close.hour;
                var endMinute = timeAvailable[weekDay].close.minute;


           


                var closeHour = timeAvailable[weekDay].close.hour;
                var closeMinute = timeAvailable[weekDay].close.minute;


                var startTime = moment({
                      h: startHour,
                      m: startMinute
                    });




                var closeTime = moment({
                      h: closeHour,
                      m: closeMinute
                    });

                scope.startTime = startTime.format("h:mm A");
                scope.closeTime = closeTime.format("h:mm A");
                
                scope.storeAvailable  = moment().isBetween(startTime, closeTime);
                scope.statusString = scope.storeAvailable ? "Now Open": "Closed";
            }
        }
    }
]);
