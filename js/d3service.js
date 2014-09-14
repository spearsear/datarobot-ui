//d3 service provided by angular
angular.module('d3',[])
.factory('d3Service',['$document','$q','$rootScope',function($document,$q,$rootScope){
  var ds = [$q.defer(),$q.defer()];
  var d3srcs = ['http://d3js.org/d3.v3.min.js','http://d3js.org/topojson.v0.min.js']
  var onscriptloadfuncs = [];
  //create the script tags for d3 libraries
  var s = $document[0].getElementsByTagName('head')[0];
  for (var i=0;i<d3srcs.length;i++){
    onscriptloadfuncs[i] = (function(){
      var index = i;
      return function(){
        //signals that the deferred activity has completed with the value d3
        $rootScope.$apply(function(){ds[index].resolve(window.d3);});
      }
    })();
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = d3srcs[i];
    scriptTag.onreadystatechange = function(){
      if (this.readyState == 'complete') onscriptloadfuncs[i]();
    }
    scriptTag.onload = onscriptloadfuncs[i];
    s.appendChild(scriptTag);
  }

  return {
    desc: function() {return "d3service"},
    d3: function() {return $q.all([ds[0].promise,ds[1].promise]).then(function(d3s){
      return d3s[0];
    })}
  }
}])
