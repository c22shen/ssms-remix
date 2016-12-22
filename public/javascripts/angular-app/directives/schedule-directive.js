angular.module('app').directive('schedule', ['myConfig', '$rootScope',

    function(myConfig, $rootScope) {

        return {
            restrict: 'A',
            templateUrl: "/javascripts/angular-app/tpl/navbar.tpl.html",
            link: function postLink(scope, iElement, iAttrs) {
                var weekDayBreakTime = [{
                    start: { hour: 12, minute: 0 },
                    end: { hour: 12, minute: 30 }
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
                        close: { hour: 0, minute: 0 }
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






                // Hours: 

                // Sunday  Closed
                // Monday  8:30AM–4:30PM
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

                // console.log("is between the dates", moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'));


                var closeTime = moment({
                    h: closeHour,
                    m: closeMinute
                });

                var startTime = startTime.format("h:mm A");
                // console.log("startTime", startTime);
                var closeTime = closeTime.format("h:mm A");
                // console.log("closeTime", closeTime);

                // console.log("moment", moment());
                var currentHour = moment().hour();
                var currentMinute = moment().minutes();

                if (currentHour > startHour && currentHour < endHour) {
                    scope.storeAvailable = true;
                } else if (currentHour === startHour && currentMinute > startMinute) {
                    scope.storeAvailable = true;
                } else if (currentHour === endHour && currentMinute < endMinute) {
                    scope.storeAvailable = true;
                } else {
                    scope.storeAvailable = false;
                }

                scope.onBreak = false;
                $rootScope.onBreak = scope.onBreak;
                if (scope.storeAvailable) {
                    var breakTimes = timeAvailable[weekDay].break;
                    breakTimes.forEach(function(breakTime) {
                        var startTime = new moment({ h: breakTime.start.hour, m: breakTime.start.minute });
                        var endTime = new moment({ h: breakTime.end.hour, m: breakTime.end.minute });

                        if (moment() > startTime && moment() < endTime) {
                            scope.onBreak = true;
                            scope.timeRange = startTime.format("h:mm A") + " - " + endTime.format("h:mm A");
                        }
                    })

                }

                $rootScope.onBreak = scope.onBreak;
                $rootScope.storeAvailable = scope.storeAvailable;

                if (scope.onBreak) {
                    scope.statusString = "ON BREAK";
                } else if (scope.storeAvailable) {
                    scope.statusString = "NOW OPEN";
                } else {
                    scope.statusString = "NOW CLOSED";
                }

                // scope.statusString = scope.storeAvailable ? "NOW OPEN" : "NOW CLOSED";
                if (startTime === closeTime) {
                    scope.timeRange = "Closed for Sunday";
                } else if (!scope.timeRange) {
                    scope.timeRange = startTime + " - " + closeTime;
                }
            }
        }
    }
]);
