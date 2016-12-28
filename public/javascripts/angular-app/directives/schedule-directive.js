angular.module('app').directive('schedule', ['myConfig', '$rootScope', '$mdSidenav',

    function(myConfig, $rootScope, $mdSidenav) {

        return {
            restrict: 'A',
            templateUrl: "/javascripts/angular-app/tpl/navbar.tpl.html",
            link: function postLink(scope, iElement, iAttrs) {
                var weekDayBreakTime = [{
                    start: { hour: 12, minute: 33 },
                    end: { hour: 12, minute: 40 }
                }, {
                    start: { hour: 16, minute: 30 },
                    end: { hour: 17, minute: 0 }
                }, {
                    start: { hour: 19, minute: 0 },
                    end: { hour: 19, minute: 20 }
                }];


                var saturdayBreakTime = [{
                    start: { hour: 12, minute: 0 },
                    end: { hour: 12, minute: 30 }
                }, {
                    start: { hour: 15, minute: 0 },
                    end: { hour: 15, minute: 20 }
                }];

                var timeAvailable = {
                    0: {
                        open: { hour: 0, minute: 0 },
                        close: { hour: 0, minute: 0 },
                        break:[]
                    },
                    1: {
                        open: { hour: 8, minute: 30 },
                        close: { hour: 17, minute: 0 },
                        break: weekDayBreakTime
                    },
                    2: {
                        open: { hour: 8, minute: 30 },
                        close: { hour: 21, minute: 0 },
                        break: weekDayBreakTime
                    },
                    3: {
                        open: { hour: 8, minute: 30 },
                        close: { hour: 21, minute: 0 },
                        break: weekDayBreakTime
                    },
                    4: {
                        open: { hour: 8, minute: 30 },
                        close: { hour: 21, minute: 0 },
                        break: weekDayBreakTime
                    },
                    5: {
                        open: { hour: 8, minute: 30 },
                        close: { hour: 21, minute: 0 },
                        break: weekDayBreakTime

                    },
                    6: {
                        open: { hour: 10, minute: 0 },
                        close: { hour: 17, minute: 0 },
                        break: saturdayBreakTime
                    }
                }

                scope.toggleList = function() {
                    $mdSidenav('left').toggle();
                }




                // Hours: 

                // Sunday  Closed
                // Monday  8:30AM–4:30PM
                // Tuesday 8:30AM–9PM
                // Wednesday   8:30AM–9PM
                // Thursday    8:30AM–9PM
                // Friday  8:30AM–9PM
                // Saturday    10AM–5PM





                var easternDate = moment.tz('America/Toronto').date();
                var easternDay = moment.tz("America/Toronto").day();

                var openCloseInfo = timeAvailable[easternDay];
                var breakTimes = openCloseInfo.break;



                var openTime = moment.tz({ d: easternDate, h: openCloseInfo.open.hour, m: openCloseInfo.open.minute }, "America/Toronto");
                var closeTime = moment.tz({ d: easternDate, h: openCloseInfo.close.hour, m: openCloseInfo.close.minute }, "America/Toronto");
                $rootScope.openTime = openTime;
                $rootScope.closeTime = closeTime;
                var storeOpen = false;
                if (moment() > openTime && moment() < closeTime) {
                    storeOpen = true;
                }



                var onBreak = false;
                var breakTimeStart, breakTimeEnd;

                breakTimes.forEach(function(breakTime) {
                    var breakTimeStartCheck = moment.tz({ d: easternDate, h: breakTime.start.hour, m: breakTime.start.minute }, "America/Toronto");
                    var breakTimeEndCheck = moment.tz({ d: easternDate, h: breakTime.end.hour, m: breakTime.end.minute }, "America/Toronto").endOf('minute');
                    if (moment() > breakTimeStartCheck && moment() < breakTimeEndCheck) {
                        onBreak = true;
                        breakTimeStart = breakTimeStartCheck;
                        breakTimeEnd = breakTimeEndCheck;
                    }
                })



                $rootScope.onBreak = onBreak;
                $rootScope.storeAvailable = storeOpen;

                if (onBreak) {
                    scope.statusString = "ON BREAK";
                } else if (scope.storeAvailable) {
                    scope.statusString = "NOW OPEN";
                } else {
                    scope.statusString = "NOW CLOSED";
                }

                // scope.statusString = scope.storeAvailable ? "NOW OPEN" : "NOW CLOSED";
                scope.timeRange = openTime.format("h:mm A") + " - " + closeTime.format("h:mm A");
                console.log("openTime", openTime.format());

                console.log("closeTime", closeTime.format());
                if (openTime.format() === closeTime.format()) {
                    scope.timeRange = "Closed for Sunday";
                } else if (onBreak) {
                    $rootScope.breakTime.start = breakTimeStart.tz('America/Toronto').format("h:mm A");
                    $rootScope.breakTime.end = breakTimeEnd.tz('America/Toronto').format("h:mm A");
                }


            }
        }
    }
]);
