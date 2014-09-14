datarobot-ui
============

Code exercise at datarobot -- Seismigraph

Features:

1: User can select year and month and filter by magnitude level to see earthquake circle on a worldmap
2: Circle radius represent magnitude of earthquake
3: Circle color represent depth of earthquake, light yellow represents shallow earthquake, red one represents deep ones
4: Mouseover a circle will popup region text
5: Mousedown a circle will show animations of the earthquake
6: Resize window will cause seimigraph to resize also, earthquake circle size will adapt

Design:

1: D3 module has a d3Service, which has a d3 method to return a promise with d3 object as result
2: D3 object generation, data api interaction, default settings are kept in angular controller
3: Angular directive d3Seismi is to create the whole Seismigraph, with year/month/magnitude selection 
   and map and earthquakes
4: Directive isolatedscope bidirectional communicate with controller scope
5: Whenver user selections happen, controller scope change are reflected in directive scope change and watched, 
   triggering map rerendering
6: Used karma jasmine for unit test by mocking scope and http response

Challenges:

1: data api example: http://www.seismi.org/api/eqs/2013/07?min_magnitude=1
2: no 'Access-Control-Allow-Origin' header is present on the requested resource, so I downloaded the data in json folder
3: unit test for d3 created elements
4: topojson needs topology, however jasmine does not see the topology object somehow
5: created global d3 object in karma.config.js for unit testing to avoid missing "Done" before jasmine version 2
