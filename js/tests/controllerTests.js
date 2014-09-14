describe("Controller Tests",function(){
  var mockScope = {};
  var controller, backend;

  beforeEach(angular.mock.module("earthquakeApp"));

  beforeEach(angular.mock.inject(function($httpBackend){
    backend = $httpBackend;
    backend.expect("GET","/json/earthquakes_2013_7.json").respond({"count":"5","earthquakes":[
      {"src":"us","eqid":"c000is61","timedate":"2013-07-29 22:22:48","lat":"7.6413","lon":"93.6871","magnitude":"4.6","depth":"40.90","region":"Nicobar Islands, India region"},
      {"src":"us","eqid":"c000is4s","timedate":"2013-07-29 21:52:12","lat":"-57.7816","lon":"-25.3260","magnitude":"5.2","depth":"53.50","region":"South Sandwich Islands region"},
      {"src":"us","eqid":"c000is3k","timedate":"2013-07-29 21:33:34","lat":"36.6696","lon":"71.0615","magnitude":"4.7","depth":"234.10","region":"Hindu Kush region, Afghanistan"},
      {"src":"us","eqid":"c000irvf","timedate":"2013-07-29 18:27:41","lat":"-37.2993","lon":"177.2515","magnitude":"4.9","depth":"160.50","region":"off the east coast of the North Island of New Zealand"},
      {"src":"us","eqid":"c000irpf","timedate":"2013-07-29 14:53:32","lat":"24.5038","lon":"62.5255","magnitude":"4.5","depth":"24.30","region":"off the coast of Pakistan"}
    ]});
  }));

  beforeEach(angular.mock.inject(function($controller,$rootScope,$http,d3Service){
    mockScope = $rootScope.$new();
    controller = $controller("seismiCtrl",{
      $scope: mockScope,
      $http: $http,
      baseUrl: 'http://www.seismi.org/api/',
      d3Service: d3Service
    });
    backend.flush();
  }))

  it("send ajax request",function(){
    backend.verifyNoOutstandingExpectation();
  });

  it("got the earthquakes data",function(){
    expect(mockScope.data.earthquakes).toBeDefined();
    expect(mockScope.data.earthquakes.length).toEqual(5);
  });

  it("sorted earthquakes in chronological order",function(){
    var d0 = new Date(mockScope.data.earthquakes[0].timedate),
        d4 = new Date(mockScope.data.earthquakes[4].timedate);
    expect(d0<d4).toEqual(true);
  });

  
})
