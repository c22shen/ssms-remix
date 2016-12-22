angular.module('app').directive('mapChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http', '$mdDialog', '$compile',

    function(d3, $rootScope, myConfig, $timeout, $http, $mdDialog, $compile) {
        var svg;



        var responsivefy = function(svg) {
            // get container + svg aspect ratio
            var container = d3.select(svg.node().parentNode),
                width = 461.77,
                height = 209.32,
                aspect = width / height;
            // console.log("container", container);
            //       console.log("width", width);
            // console.log("height", height);

            // add viewBox and preserveAspectRatio properties,
            // and call resize so that svg resizes on inital page load
            svg.attr("viewBox", "0 0 " + width + " " + height)
                .attr("preserveAspectRatio", "xMinYMid")
                .call(resize);

            // to register multiple listeners for same event type,
            // you need to add namespace, i.e., 'click.foo'
            // necessary if you call invoke this function for multiple svgs
            // api docs: https://github.com/mbostock/d3/wiki/Selections#on
            d3.select(window).on("resize." + container.attr("id"), resize);

            // get width of container and resize svg to fit it
            function resize() {

                var targetWidth = parseInt(d3.select('.header').style("width"));
                // console.log("container width", parseInt(d3.select('.header').style("width")));
                // console.log("container height", parseInt(container.style("height")));

                if (targetWidth > 800) {
                    targetWidth = 800;
                }
                if (!!targetWidth) {
                    svg.attr("width", targetWidth);
                    svg.attr("height", Math.round(targetWidth / aspect));
                }
                // d3.select('#map').style("height", Math.round(targetWidth / aspect)+'px');
            }
        };

        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {
                var millingPathCreation = function(selection) {
                    selection
                        .attr('d', millingSvg)
                        .attr("transform", "scale(0.35,0.35)");
                }
                var totalWidth = 461.77;
                var totalHeight = 209.32;
                //height and width of original map svg


                var millingSvg = "M15.483,13.55h25.161c1.064,0,1.933-0.875,1.933-1.936V9.677c0-1.065-0.868-1.935-1.933-1.935H15.483 c-1.063,0-1.936,0.87-1.936,1.935v1.936C13.548,12.675,14.421,13.55,15.483,13.55z M40.645,1.936C40.645,0.87,38.913,0,36.772,0 C34.636,0,32.9,0.87,32.9,1.936v3.965h7.744V1.936z M27.097,15.39H15.483V29.03h11.613V15.39z M21.29,42.58l1.934-1.938v-2.029 h-3.869v2.029L21.29,42.58z M25.162,30.87h-7.741v5.903h7.741V30.87z M8.709,28.217c0.535,0,0.968-0.774,0.968-1.732v-4.229h1.936 v2.904h2.03v-7.74h-2.03v2.901H9.677v-4.226c0-0.96-0.433-1.73-0.968-1.73c-0.534,0-0.967,0.769-0.967,1.73v10.39 C7.742,27.442,8.175,28.217,8.709,28.217z M28.938,25.16h32.994v-7.74H28.938V25.16z M50.322,27.001v15.673h7.737V27.001H50.322z M6.773,59.997c0.536,0,0.969-0.432,0.969-0.966v-1.937h1.935v2.902h32.999v-7.741H9.677v2.906H7.742v-1.938 c0-0.534-0.433-0.969-0.969-0.969c-0.533,0-0.966,0.435-0.966,0.969v5.807C5.808,59.565,6.24,59.997,6.773,59.997z M42.676,61.839 H14.212l28.464,6.917V61.839z M0,73.544v3.872h65.803v-3.872H0z M52.821,53.057c-0.757,0.758-0.757,1.983,0,2.738 c0.756,0.754,1.983,0.754,2.739,0c0.756-0.755,0.756-1.98,0-2.738C54.805,52.304,53.577,52.304,52.821,53.057z M46.931,44.515 c-1.327,0-2.416,0.872-2.416,1.934v25.163c0,0.032,0.009,0.062,0.012,0.092h19.328c0.004-0.03,0.012-0.06,0.012-0.092V46.449 c0-1.062-1.086-1.934-2.419-1.934H46.931z M51.288,65.805c-1.071,0-1.935-0.863-1.935-1.939c0-1.068,0.863-1.931,1.935-1.931 c1.07,0,1.937,0.862,1.937,1.931C53.225,64.941,52.358,65.805,51.288,65.805z M51.454,57.163c-1.512-1.513-1.512-3.961,0-5.475 c1.253-1.253,3.144-1.45,4.618-0.626l2.223-0.742l-0.74,2.224c0.824,1.474,0.627,3.366-0.628,4.619 C55.417,58.673,52.967,58.673,51.454,57.163z M57.092,65.805c-1.066,0-1.934-0.863-1.934-1.939c0-1.068,0.868-1.931,1.934-1.931 c1.069,0,1.936,0.862,1.936,1.931C59.027,64.941,58.161,65.805,57.092,65.805z M13.548,50.415H29.03v-3.872H13.548V50.415z";
                var latheSvg = "M76.894,41.202h-7.062c-0.029,1.98-1.64,3.581-3.625,3.581H46.524c-1.985,0-3.598-1.601-3.624-3.579 L7.158,41.206v23.206H28.63l3.579-10.733h33.998l5.369,10.733h10.735V44.783h-1.79C78.536,44.783,76.919,43.183,76.894,41.202z M24.157,53.679H13.42c-0.493,0-0.893-0.401-0.893-0.896c0-0.493,0.4-0.895,0.893-0.895h10.737c0.493,0,0.893,0.401,0.893,0.895 C25.051,53.277,24.65,53.679,24.157,53.679z M24.157,50.1H13.42c-0.493,0-0.893-0.4-0.893-0.896c0-0.494,0.4-0.895,0.893-0.895 h10.737c0.493,0,0.893,0.4,0.893,0.895C25.051,49.699,24.65,50.1,24.157,50.1z M24.157,46.521H13.42 c-0.493,0-0.893-0.398-0.893-0.895c0-0.494,0.4-0.894,0.893-0.894h10.737c0.493,0,0.893,0.399,0.893,0.894 C25.051,46.122,24.65,46.521,24.157,46.521z M84.101,28.629h-3.579c-0.985,0-1.791,0.804-1.791,1.79v10.734 c0,0.984,0.806,1.788,1.791,1.788h3.579c0.983,0,1.788-0.804,1.788-1.788V30.419C85.889,29.433,85.084,28.629,84.101,28.629z M32.209,37.575v-7.156c0-0.983-0.806-1.79-1.789-1.79h1.789c0.984,0,1.788-0.805,1.788-1.789V1.79c0-0.986-0.804-1.79-1.788-1.79 H1.789C0.807,0,0,0.804,0,1.79v25.05c0,0.984,0.807,1.789,1.789,1.789h3.579c-0.983,0-1.788,0.807-1.788,1.79v7.156 c0,0.985,0.805,1.789,1.788,1.789H30.42C31.403,39.364,32.209,38.561,32.209,37.575z M12.526,25.048 c-0.988,0-1.788-0.801-1.788-1.789c0-0.987,0.8-1.79,1.788-1.79c0.988,0,1.788,0.803,1.788,1.79 C14.314,24.247,13.515,25.048,12.526,25.048z M14.316,12.524c0,1.977-1.604,3.577-3.578,3.577c-1.977,0-3.58-1.601-3.58-3.577 c0-1.979,1.603-3.579,3.58-3.579c0.66,0,1.274,0.192,1.807,0.506l1.838-1.839c-0.039-0.147-0.066-0.297-0.066-0.457 c0-0.988,0.801-1.789,1.789-1.789s1.791,0.801,1.791,1.789s-0.803,1.79-1.791,1.79c-0.159,0-0.312-0.028-0.457-0.066l-1.838,1.837 C14.123,11.248,14.316,11.861,14.316,12.524z M17.895,35.783c-0.988,0-1.791-0.8-1.791-1.786c0-0.99,0.803-1.791,1.791-1.791 c0.988,0,1.788,0.801,1.788,1.791C19.683,34.983,18.883,35.783,17.895,35.783z M19.683,25.048c-0.988,0-1.788-0.801-1.788-1.789 c0-0.987,0.8-1.79,1.788-1.79c0.988,0,1.791,0.803,1.791,1.79C21.474,24.247,20.671,25.048,19.683,25.048z M25.051,35.783 c-0.987,0-1.789-0.8-1.789-1.786c0-0.99,0.802-1.791,1.789-1.791c0.988,0,1.79,0.801,1.79,1.791 C26.841,34.983,26.039,35.783,25.051,35.783z M26.841,25.048c-0.988,0-1.79-0.801-1.79-1.789c0-0.987,0.802-1.79,1.79-1.79 c0.987,0,1.789,0.803,1.789,1.79C28.63,24.247,27.828,25.048,26.841,25.048z M28.631,8.945c-0.159,0-0.311-0.028-0.457-0.066 l-1.838,1.837c0.313,0.532,0.507,1.146,0.507,1.809c0,1.977-1.605,3.577-3.579,3.577c-1.976,0-3.579-1.601-3.579-3.577 c0-1.979,1.604-3.579,3.579-3.579c0.661,0,1.274,0.192,1.808,0.506l1.838-1.839c-0.039-0.147-0.066-0.297-0.066-0.457 c0-0.988,0.8-1.789,1.788-1.789c0.989,0,1.791,0.801,1.791,1.789S29.62,8.945,28.631,8.945z M39.366,19.683h3.579V8.945h-3.579 v-1.79h-3.578v14.315h3.578V19.683z M55.472,17.892h-1.789v-3.578h-1.79v3.578h-1.79l-1.33,5.318h8.028L55.472,17.892z M53.683,32.206c0.66,0,1.231,0.363,1.54,0.896h1.912c-0.398-1.54-1.787-2.683-3.452-2.683c-1.668,0-3.055,1.143-3.453,2.683h1.91 C52.45,32.569,53.021,32.206,53.683,32.206z M46.524,42.941h19.683c0.984,0,1.788-0.804,1.788-1.788V26.84 c0-0.985-0.804-1.79-1.788-1.79H46.524c-0.983,0-1.79,0.805-1.79,1.79v14.314C44.734,42.138,45.541,42.941,46.524,42.941z M62.628,28.629c0.99,0,1.79,0.802,1.79,1.79c0,0.987-0.8,1.787-1.79,1.787c-0.988,0-1.79-0.8-1.79-1.787 C60.838,29.431,61.64,28.629,62.628,28.629z M53.683,28.629c2.962,0,5.366,2.402,5.366,5.368c0,2.963-2.404,5.365-5.366,5.365 c-2.965,0-5.369-2.402-5.369-5.365C48.313,31.031,50.718,28.629,53.683,28.629z M53.683,35.783c-0.661,0-1.23-0.359-1.543-0.892 H50.23c0.398,1.54,1.784,2.683,3.452,2.683c1.665,0,3.052-1.143,3.452-2.683h-1.912C54.914,35.424,54.343,35.783,53.683,35.783z M42.895,30.365v-1.736h-7.532c-0.319,0.559-0.782,1.029-1.34,1.352c0.016,0.126,0.022,0.255,0.024,0.384H42.895z M71.576,28.629 h-1.739v1.736h7.06c0.029-1.978,1.642-3.577,3.625-3.577h3.579c0.652,0,1.26,0.187,1.788,0.49v-4.018H71.576V28.629z M76.892,32.206 h-7.055v3.577h7.055V32.206z M76.892,37.625h-7.055v1.737h7.055V37.625z M42.895,32.206h-8.847v3.577h8.847V32.206z M33.559,39.362 h9.336v-1.737h-8.85C34.034,38.259,33.854,38.848,33.559,39.362z M88.574,10.733c-0.495,0-0.895,0.401-0.895,0.896v1.789h-1.791 v-2.686H71.576v7.158h1.789v3.528h10.735v-3.528h1.788v-2.683h1.791v1.788c0,0.496,0.399,0.895,0.895,0.895 c0.495,0,0.894-0.399,0.894-0.895v-1.788v-1.79V11.63C89.468,11.135,89.069,10.733,88.574,10.733z M69.735,16.101v-3.577h-1.74 l-1.788,1.789l1.788,1.788H69.735z";
                var pathPerType = {
                    "M": millingSvg,
                    "L": latheSvg
                };
                var mapShadowPoints = "108.37,3.002 431.77,3.002 431.77,69.692 426.89,69.692 426.89,107.072 431.77,107.072 431.77,115.706 427.88,115.706 427.88,128.138 431.77,128.138 431.77,190.388 403,190.388 403,150.632 347.03,150.632 347.03,133.208 202.49,133.208 202.49,154.988 95.83,154.988 95.83,209.318 0,209.318 0,136.298 26.66,136.298 26.66,74.6 108.37,74.6";
                var mapPoints = "108.37,0.002 431.77,0.002 431.77,66.692 426.89,66.692 426.89,104.072 431.77,104.072 431.77,112.706 427.88,112.706 427.88,125.138 431.77,125.138 431.77,187.388 403,187.388 403,147.632 347.03,147.632 347.03,130.208 202.49,130.208 202.49,151.988 95.83,151.988 95.83,206.318 0,206.318 0,133.298 26.66,133.298 26.66,71.6 108.37,71.6";
                var arrowPath = "M62.002,1.851v30.945c0,0.745,0.504,1.349,1.126,1.349h118.477 c0.622,0,1.126,0.604,1.126,1.349v15.303c0,0.745-0.504,1.349-1.126,1.349H63.128c-0.622,0-1.126,0.604-1.126,1.349v30.295 c0,1.038-0.939,1.687-1.689,1.168L1.063,43.983c-0.751-0.519-0.751-1.817,0-2.336L60.312,0.683 C61.063,0.164,62.002,0.812,62.002,1.851z"
                var margin = { top: 0, right: 15, bottom: 0, left: 15 };
                var width = totalWidth - margin.left - margin.right;
                var height = totalHeight - margin.top - margin.bottom;
                var fontSize = 10;


                svg = d3.select(elements[0]).append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)
                    .call(responsivefy);


                var group = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



                var mapShadow = group
                    .append('g')
                    .attr("class", "drop-shadow")
                    .append('polygon')
                    .attr('points', mapShadowPoints)
                    .attr('transform', 'translate(' + 3 + ',' + 0 + ')');

                var map = group
                    .append('g')
                    .attr("class", "map")
                    .append('polygon')
                    .attr('fill', "#808080")
                    .attr('points', mapPoints);


                var office = group
                    .append('g')
                    .attr("class", "office")
                    .append('text')
                    .attr('transform', 'translate(' + 30 + ',' + 80 + ') rotate(90)')
                    .attr('fill', 'white')
                    .attr('stroke', 'none')
                    .attr('font-size', 15)
                    .text("OFFICE");

                var arrowGroup = group
                    .append('g')
                    .attr('transform', "scale(0.20,0.20)")
                    .attr("class", "arrow");

                var arrowText = arrowGroup
                    .append('g')
                    .attr("class", "entrance")
                    .append('text')
                    .attr('transform', 'translate(' + 2030 + ',' + 460 + ')')
                    .attr('fill', 'white')
                    .attr('stroke', 'none')
                    .attr('font-size', 40)
                    .text("ENTRANCE");

                var arrowShadow = arrowGroup
                    .append('path')
                    .attr('transform', 'translate(' + 2045 + ',' + 475 + ')')
                    .attr('d', arrowPath)
                    .attr("fill", "#1665a3");

                var arrow = arrowGroup
                    .append('path')
                    .attr('transform', 'translate(' + 2040 + ',' + 470 + ')')
                    .attr('d', arrowPath)
                    .attr("fill", "#2196F3");



                function render(scope) {
                    var update = group.selectAll('.machine')
                        .data($rootScope.machineData)


                    update.select('.machinePath')
                        // .transition(transitionStyle)
                        .style('fill', function(data) {
                            // console.log("data iRms", data.iRms);
                            // console.log("data statusChangeTime", data.statusChangeMoment);
                            return data.statusColor;
                        });

                    update.select('.timeText')
                        // .append('text')
                        // .transition(transitionStyle)
                        .text(function(data) {
                            return !!data.datetime ? moment(data.datetime, "h:mm:ssa").format("h:mm:ss") : null;
                        });



                    var machineUnit = update
                        .enter()
                        .append('g')
                        .classed('machine', true)
                        .on('click', function(d, i, elements) {
                            // $mdDialog.show({
                            //         locals: { data: d },
                            //         controller: ['$scope', 'data', function($scope, data) {
                            //             $scope.data = data;
                            //             $scope.exit = function() {
                            //                 $mdDialog.hide();
                            //             }
                            //             // capture display Data
                            //         }],
                            //         templateUrl: '/javascripts/angular-app/tpl/dialog.tpl.html',
                            //         parent: angular.element(document.body),
                            //         // targetEvent: ev,

                            //         clickOutsideToClose: true,
                            //         fullscreen: true // Only for -xs, -sm breakpoints.
                            //     })
                            //     .then(function() {}, function() {});
                        })
                        .on('mouseover', function(mouseoverData, i, elements) {

                            if (mouseoverData.iRms !== undefined && mouseoverData.iRms !== null) {
                                d3.select(this).style("cursor", "pointer");
                                var popoverDiv = d3.select('.popover').transition()
                                    .duration(200)
                                    .style("opacity", 0.95)
                                    .style("left", (d3.event.pageX - 60) + "px")
                                    .style("top", (d3.event.pageY + 18) + "px");
                                // d3.select('.popover .machineName').html(mouseoverData.text);
                                // d3.select('.popover .machineStatus').html($rootScope.determineStatus(d.iRms));
                                $rootScope.$apply(function() { // This wraps the changes.
                                    $rootScope.popOverPanId = mouseoverData.panId;
                                    $rootScope.popOverIndex = $rootScope.machineData.findIndex(function(d) {
                                        return mouseoverData.panId === d.panId;
                                    });

                                    // console.log("mouseover popOVerData", $rootScope.popOverData);
                                });
                            }

                        })
                        .on('mouseout', function(d, i, elements) {
                            d3.select(this).style("cursor", "default");
                            d3.select('.popover').transition()
                                .duration(500)
                                .style("opacity", 0);

                        });


                    machineUnit
                        .append('path')
                        .attr('d', function(data) {
                            return pathPerType[data.type];
                        })
                        .style('fill', 'black')
                        .attr('transform', function(data) {
                            var xCord = data.xCoordinate + 1;
                            var yCord = data.yCoordinate + 1;
                            return "translate( " + xCord + ',' + yCord + '), scale(0.35,0.35)';
                        })

                    machineUnit
                        .append('path')
                        .attr('class', 'machinePath')
                        .attr('d', function(data) {
                            return pathPerType[data.type];
                        })
                        .style('fill', function(d){
                            console.log("fill data", d);
                            return 'white';
                        })
                        .attr('transform', function(data) {
                            return "translate( " + data.xCoordinate + ',' + data.yCoordinate + '), scale(0.35,0.35)';
                        })

                    machineUnit
                        .append("text")
                        .classed("machineText", true)
                        .attr('transform', function(data) {
                            var yCoord = data.yCoordinate + 40;
                            return 'translate(' + data.xCoordinate + ',' + yCoord + ')';
                        })
                        .attr('fill', 'white')
                        .attr('stroke', 'none')
                        .attr('font-size', fontSize)
                        .text(function(data) {
                            return data.text;
                        });
                    machineUnit
                        .append("text")
                        .classed("timeText", true)
                        .attr('transform', function(data) {
                            var yCoord = data.yCoordinate + 50;
                            return 'translate(' + data.xCoordinate + ',' + yCoord + ')';
                        })
                        .attr('fill', 'white')
                        .attr('stroke', 'none')
                        .attr('font-size', fontSize - 2)
                        .text(function(data) {
                            return data.datetime;
                        });
                }

                // render();






                return function(scope, element, attrs) {
                    $timeout(function() { responsivefy(svg) }, 100);

                    scope.$watch('$root.machineData', function() {
                        render(scope);
                    }, true);

                    // element.removeAttr("map-chart");
                    //  $compile(element)(scope);
                };
            }
        }
    }
]);
