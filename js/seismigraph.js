    angular.module("earthquakeApp",["d3"])
    .constant('baseUrl','http://www.seismi.org/api/')
    .filter("magnitude_level",function(){
      return function(value){
        if(value==-1){
          return "All"
        }else{
          return value + " to " + (parseInt(value)+1);
        }
      }
    })
    .controller('seismiCtrl',['$scope','$http','baseUrl','d3Service',function($scope,$http,baseUrl,d3Service){
      $scope.data = {};
      //default selection
      $scope.selector = {year: 2013, month: 7};
      $scope.magnitude = -1;
      $scope.d3 = {};
      $scope.convertToDate = function(str){return new Date(str)};
      $scope.zeroPad = function(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
      }
      $scope.getData = function(year,month){
        if(!angular.isUndefined(year) && !angular.isUndefined(month)){
          $http({
            //No 'Access-Control-Allow-Origin' header is present on the requested resource
            //url: baseUrl+'eqs/'+year+'/'+$scope.zeroPad(month,2)+'?min_magnitude=1'
            url: '/json/earthquakes_'+year+'_'+month+'.json'
            //url: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk'
          }).success(function(data){
              $scope.data.earthquakes = data.earthquakes;
              //angular.forEach($scope.data.earthquakes,function(earthquake){
              //  earthquake.timedate = $scope.convertToDate(earthquake.timedate);
              //});
              function compareChronological(quake1,quake2) {
                var q1 = new Date(quake1.timedate),
                    q2 = new Date(quake2.timedate);
                if (q1 < q2)
                  return -1;
                if (q1 > q2)
                  return 1;
                return 0;
              }
              $scope.data.earthquakes.sort(compareChronological);
          }).error(function(error){
              $scope.data.earthquakes = [];
          });
        }
      };
      $scope.getData($scope.selector.year,$scope.selector.month);
      d3Service.d3().then(function(d3){
        $scope.d3 = d3;
      })
    }])
    .directive('d3Seismi',['$window',function($window){
      return {
        restrict: 'EA',
        template: function(){
          return angular.element(document.querySelector("#selectorsTemplate")).html();
        }, 
        scope: {
          data: "=",  //bi-directional data bnding with controller scope
          selector: "=",
          magnitude: "=",  //selected magnitude level
          dthree: "=",
          getDataFn: "&getdata"
        },
        link: function(scope,ele,attrs){
          if(true){
            //refer to global d3 is any
            var d3_global = $window.d3;
            //local d3
            var d3;
          //d3Service.d3().then(function(d3){
            //d3 object obtained thru promise
            scope.aspect_ratio = 0.5;

            //browser resize event
            window.onresize = function(){
              //since window resize is not an angular event, angular will not know anything has changed, hence we need to tell angular to check any value has changed and apply the changes through the $apply call. ie start the digestion cycle explicitely
              scope.$apply();
            }

            //watch for resize event
            scope.$watch(function(){
              return angular.element($window)[0].innerWidth;
            },function(){
              scope.width = angular.element($window)[0].innerWidth;
              scope.height = angular.element($window)[0].innerWidth * scope.aspect_ratio;
              scope.renderMap();
            })

            scope.$watch('selector',function(newSelector){
              scope.getDataFn(newSelector.year,newSelector.month);
            },true);

            scope.$watch('data',function(newData){
              scope.renderEarthquake(newData);
            },true);

            scope.$watch('magnitude',function(newMag){
              scope.renderEarthquake(scope.data);
            },true);

            scope.$watch(function(){
	      return scope.dthree;
            },function(newValue,oldValue){
              d3 = newValue;
              scope.renderMap();
            })

            scope.renderMap = function(){
              d3 = d3_global || scope.dthree;
              if(angular.isObject(d3) && d3.hasOwnProperty("version")){
                if(scope.svg){
                  d3.selectAll("svg").remove();
                }
                var svg = d3.select(ele[0]).append("svg")
                  .attr("width",scope.width)
                  .attr("height",scope.height);
                var projection = d3.geo.mercator()
                  .center([0,5])
                  .scale((scope.width/960)*100)
                  .rotate([-180,0]);
                var path = d3.geo.path().projection(projection);
                scope.svg = svg;
                scope.projection = projection;

                var g = svg.append("g");
                var topojson = $window.topojson || topojson;
                d3.json("/json/world-110m2.json",function(error,topology){
                  if(topology){
                    g.selectAll("path")
                      .data(topojson.object(topology,topology.objects.countries).geometries)
                      .enter()
                      .append("path")
                      .attr("d",path);
                  }
                  scope.renderEarthquake(scope.data);
                });
              }
            };

            scope.renderEarthquake = function(data){
              d3 = d3_global || scope.dthree;
              if(angular.isObject(d3) && d3.hasOwnProperty("version")){
                scope.svg.selectAll("g circle").remove();
                var depthColorScale = d3.scale.linear()
                  .domain([d3.min(data,function(d){return d.depth}),
                           d3.max(data,function(d){return d.depth})])
                  .range(["#EEDC82","#DC143C"]);
                var magnitudeScale = d3.scale.linear()
                  .domain([d3.min(data,function(d){return d.magnitude}),
                           d3.max(data,function(d){return d.magnitude})])
                  .range([2*(scope.width/960),20*(scope.width/960)]);
                var timedateScale = d3.time.scale()
                  .domain([d3.min(data,function(d){
                              var t =  new Date(d.timedate);
                              return t;
                           }),
                           d3.max(data,function(d){
                              var t =  new Date(d.timedate);
                              return t;
                           })])
                  .rangeRound([1,4000]);

                var setIntervalEnhanced = function(callback, final_callback, delay, repetitions) {
                  var x = 0;
                  var intervalID = window.setInterval(function () {
                      callback();
                      if (++x === repetitions) {
                          window.clearInterval(intervalID);
                          final_callback();
                      }
                  }, delay);
                }

                var shake = function(thecircle,radius,color) {
		  thecircle
                     .style("fill","none")
                     .style("stroke",color)
                     .style("stroke-width","3px")
                     .transition()
		     .duration(500)
		     .attr("r", 0)
		     .ease('sine');
                  setIntervalEnhanced(function(){
			 scope.svg.select("g").append("circle")
			      .attr("class", "ring")
                              .attr("transform","translate("+thecircle.attr("cx")+","+thecircle.attr("cy")+")")
			      .attr("r", 6)
			      .style("stroke-width", 2)
			      .style("stroke", color)
			    .transition()
			      .ease("linear")
			      .duration(6000)
			      .style("stroke-opacity", 1e-6)
			      .style("stroke-width", 0.5)
			      .style("stroke", "brown")
			      .attr("r", radius * 3)    //magnitude scaled
			      .remove();
                   }, function(){
                      thecircle
                         .style("fill",color)
                         .attr("r",0)
                         .transition()
                         .duration(2000)
                         .attr("r",radius)
                         .ease('linear');
                   }, 750, 10);
                }

	        var shake2 = function(thecircle,radius,color) {
                  var count = 0, shake_max=4;
		  (function repeat() {
                     if (count<=shake_max) {
		       thecircle
                         .style("fill","none")
                         .style("stroke",color)
                         .style("stroke-width","3px")
                         .transition()
			 .duration(500)
			 .attr("r", 0)
			 .transition()
			 .duration(1000)
			 .attr("r", radius)
			 .ease('sine')
			 .each("end", repeat);
                       count++;
                     }else{
                       thecircle
                         .style("fill",color)
                         .attr("r",0)
                         .transition()
                         .duration(500)
                         .attr("r",radius)
                         .ease('linear');
                     }
		  })();
                }

                scope.svg.select("g")
                   //earthquake points
                   .selectAll("circle")
                   .data(data).enter().append("svg:circle")
                   .filter(function(d,i){
                     return parseInt(scope.magnitude)!=-1 ? Math.floor(d.magnitude)==parseInt(scope.magnitude) : true;
                   })
                   .style("fill",function(d){
                     return depthColorScale(d.depth);
                   })
		   .attr("visibility","hidden")
                   .attr("cx",function(d){
                     return scope.projection([d.lon,d.lat])[0];
                   })
                   .attr("cy",function(d){
                     return scope.projection([d.lon,d.lat])[1];
                   })
                   .attr("r",function(d){
                     return magnitudeScale(d.magnitude)/10;
                   });

                scope.svg.selectAll("circle")
                   //delay cause problem in unit test?
                   .transition()
                   .delay(function(d,i){
                     //return timedateScale(t);
                     return i*10;
                   })
                   .duration(500)
                   .ease("elastic",10,0.45)
                   .attr("class","ring")
                   .attr("visibility","visible")
                   .attr("r",function(d){
                     return magnitudeScale(d.magnitude);
                   })
                   .each(function(d){
                     d3.select(this).on("mousedown",function(){
			 shake(d3.select(this),magnitudeScale(d.magnitude),depthColorScale(d.depth));
		     });
                   })
                   .each(function(d){
                     d3.select(this).on("mouseover",function(){
                        d3.select(this).append("svg:title")
                          .text(function(d){return d.region});
                     });
                   });
                };

                scope.svg.select("g")
                   .selectAll("circle")
                   .data(data).exit().remove();

            }//end render Earthquake function

            //useful for unit test
            if(d3_global || scope.dthree){
              d3 = d3_global || scope.dthree;
              scope.renderMap();
            }

          //});
          };
        }
      }
    }]);
