describe("Filter Tests",function(){
  var filterInstance;

  beforeEach(angular.mock.module("earthquakeApp"));

  beforeEach(angular.mock.inject(function($filter){
    filterInstance = $filter("magnitude_level");
  }));

  it("-1 magnitude matches to All magnitude",function(){
    var result = filterInstance("-1");
    expect(result).toEqual("All");
  });

  it("0 magnitude matches to 0 to 1",function(){
    var result = filterInstance("0");
    expect(result).toEqual("0 to 1");
  });

  it("9 magnitude matches to 9 to 10",function(){
    var result = filterInstance("9");
    expect(result).toEqual("9 to 10");
  });

});
