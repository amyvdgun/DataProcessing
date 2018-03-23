/** 
* Amy van der Gun
* 10791760
* 
* map.js
*
* Creates an interactive map of the USA.
*
* With help from:
* https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3
*/

// execute function when DOM is loaded
window.onload = function() {

  // set the outer and inner width and height
  var margin = {top: 20, bottom: 20, left: 20, right: 20},
      height = 600 - margin.top - margin.bottom,
      width = 1200 - margin.left - margin.right;

  // set the colors corresponding to the highest and lowest values
  var lowColor = "#f9f9f9"
  var highColor = "#92B558"

  // scale and center to the screen
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale([1000]);

  // create path
  var path = d3.geoPath()
    .projection(projection);

  // create the tooltip for interactivity and set its content
  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function (d) {
        var formatting = d3.format(",");
        return ("State: " + d.properties.name + "<br>" + "Population: " + formatting(d.properties.value))});

  // add the SVG element and set characteristics
  var svg = d3.select("#map")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // call the tooltip
  svg.call(tip);

  // load in two json files 
  d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.json, "alldata.json")
    .await(function (error, us, alldata) {

      // throw error if files cannot be loaded
      if (error) throw error;

      // create an empty array and push the population data in it
      var dataArray = [];
      alldata.forEach(function (d) {
        d.Population = parseInt(d.Population);
        dataArray.push(+d.Population);
      });

      // create barchart and use Alabama as the default state
      createBarchart(alldata, "Alabama");

      // determine the extreme values and set domain and range
      var min = d3.min(dataArray)
      var max = d3.max(dataArray)
      var color = d3.scaleLinear().domain([min,max]).range([lowColor,highColor])
      
      // iterate over the data file and separate into name and value
      for (var i = 0; i < alldata.length; i++) {
        var dataState = alldata[i].StateName;
        var dataValue = alldata[i].Population;

        // iteratue over the us data file and store state name in variable
        for (var j = 0; j < us.features.length; j++) {
          var jsonState = us.features[j].properties.name;

          // link the population value if state names in the two files match
          if (dataState == jsonState) {
            us.features[j].properties.value = dataValue;
            break;
        }
      }
    }

    // put the data into the SVG and create path
    svg.selectAll("path")
      .data(us.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) { return color(d.properties.value) })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .on("click", function(d) { var chosenState = d.properties.name;
        update(alldata, chosenState); });

    // create the legend
    var key = d3.select("svg")
      .append("svg")
      .attr("width", 140)
      .attr("height", 150)
      .attr("class", "legend");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    // set top of legend
    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);
      
    // set bottom of legend
    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

    // append rectangle for the legend
    key.append("rect")
      .attr("width", 20)
      .attr("height", 150)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(20,10)");

    // create y variable
    var y = d3.scaleLinear()
      .range([150, 0])
      .domain([min, max]);

    // create y axis
    var yAxis = d3.axisRight(y);

    // set y axis
    key.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(41,10)")
      .call(yAxis)
    });
};







