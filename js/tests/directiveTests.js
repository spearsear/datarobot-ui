describe("Directive Tests",function(){
  var mockScope;
  var compileService;
  var d3service;

  function objToString (obj) {
    var tabjson=[];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            tabjson.push('"'+p +'"'+ ':' + obj[p]);
        }
    }  tabjson.push()
    return '{'+tabjson.join(',')+'}';
  }

  beforeEach(angular.mock.module("earthquakeApp","d3_no_promise"));

  beforeEach(angular.mock.inject(function($rootScope,$compile,d3Service1){
    mockScope = $rootScope.$new();
    compileService = $compile;
    d3service = d3Service1;
    mockScope.data = {"count":"5","earthquakes":[
      {"src":"us","eqid":"c000is61","timedate":"2013-07-29 22:22:48","lat":"7.6413","lon":"93.6871","magnitude":"4.6","depth":"40.90","region":"Nicobar Islands, India region"},
      {"src":"us","eqid":"c000is4s","timedate":"2013-07-29 21:52:12","lat":"-57.7816","lon":"-25.3260","magnitude":"5.2","depth":"53.50","region":"South Sandwich Islands region"},
      {"src":"us","eqid":"c000is3k","timedate":"2013-07-29 21:33:34","lat":"36.6696","lon":"71.0615","magnitude":"4.7","depth":"234.10","region":"Hindu Kush region, Afghanistan"},
      {"src":"us","eqid":"c000irvf","timedate":"2013-07-29 18:27:41","lat":"-37.2993","lon":"177.2515","magnitude":"4.9","depth":"160.50","region":"off the east coast of the North Island of New Zealand"},
      {"src":"us","eqid":"c000irpf","timedate":"2013-07-29 14:53:32","lat":"24.5038","lon":"62.5255","magnitude":"4.5","depth":"24.30","region":"off the coast of Pakistan"}
    ]};
    mockScope.selector = {year: 2013, month: 7};
    mockScope.magnitude = -1;
    //changed to load d3 in global thru karma.config.js
    //mockScope.dthree = d3service.d3;
    //mockScope.topojson = d3service.topojson;
  }));

  //it("got a d3 object",function(){
    //console.log("d3service is "+objToString(d3Service1));
    //expect(mockScope.dthree.version).toEqual("3.4.11");
  //});

  //too bad karma does not have Jasmine 2.0 so this does not work
  //beforeEach(function(done){
  //  console.log("done is " + objToString(done));
  //  d3service.d3().then(function(d3){
  //    mockScope.dthree = d3;
  //    done();
  //  });
  //});

  it("create 5 circles",function(){
    //console.log("****dthree is**** "+objToString(mockScope.dthree))
    var compileFn = compileService("<d3-seismi data='data.earthquakes' selector='selector' magnitude='magnitude' dthree='dthree' getdata='getData(selector.year,selector.month)'></d3-seismi>");
    //console.log("mockScope is " + objToString(mockScope));
    var elem = compileFn(mockScope);
    //console.log(elem);
    expect(elem.find("circle").length).toEqual(0);  //should expect 5
  })
})
