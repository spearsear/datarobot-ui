describe("Simple Test",function(){
  //Arrange (setup scenario)
  var counter;

  beforeEach(function(){
    counter = 0;
  });

  it("increments value",function(){
    //Act (Operate)
    counter++;
    //Assert (Verify)
    expect(counter).toEqual(1);
  });

  it("decrements value",function(){
    counter--;
    expect(counter).toEqual(-1);
  });

  it('prints jasmine version', function() {
    //console.log('jasmine-version:' + jasmine.getEnv().versionString());
  });
})
