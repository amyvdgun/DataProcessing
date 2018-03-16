/** 
* Amy van der Gun
* 10791760
* 
* barchart.js
*
* Creates an interactive barchart using data from a json file.
*/

function createBarchart (data, us) {
  
  // set the outer and inner width and height
  var margin = {top: 20, bottom: 20, left: 20, right: 20},
      height = 550 - margin.top - margin.bottom,
      width = 1200 - margin.left - margin.right;

  // set the chart sizes
  var chart = d3.select("#barchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataArray = [];
  var dateArray = ["2011", "2012", "2013", "2014", "2015", "2016", "2017"];
  data.forEach(function (d) {
    dataArray.push(+d.Births2011);
    dataArray.push(+d.Births2012);
    dataArray.push(+d.Births2013);
    dataArray.push(+d.Births2014);
    dataArray.push(+d.Births2015);
    dataArray.push(+d.Births2016);
    dataArray.push(+d.Births2017);
  });

  var min = d3.min(dataArray);
  var max = d3.max(dataArray);

  // set the range and domain for x 
  var x = d3.scaleOrdinal()
    .range([0, width])
    .domain(dateArray);

  // set the range and domain for y
  var y = d3.scaleLinear()
    .domain([0, max])
    .range([height, 0]);

  // create and draw x-axis on desired position and set label
  var xAxis = d3.axisBottom(x);
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width)
    .attr("y", margin.bottom/1.5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font", "12px sans-serif")
    .text("Year");

  // create and draw y-axis on desired position and set label
  var yAxis = d3.axisLeft(y);
  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -margin.left/1)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font", "12px sans-serif")
    .text("Amount of births");

  // add bars with linked data to the chart
  chart.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(dateArray) { return x(dateArray["2011"]); })
    .attr("y", function(dataArray) { return y(dataArray.Births2011); })
    .attr("height", function(dataArray) { return height - y(dataArray.Births2011); })
    //.attr("width", x.rangeBand())



  //  // iterate over the data file and separate into name and value
  // for (var i = 0; i < data.length; i++) {
  //   var dataState = data[i].StateName;
  //   var value2011 = data[i].Births2011;
  //   var value2012 = data[i].Births2012;
  //   var value2013 = data[i].Births2013;
  //   var value2014 = data[i].Births2014;
  //   var value2015 = data[i].Births2015;
  //   var value2016 = data[i].Births2016;
  //   var value2017 = data[i].Births2017;

  //   // iteratue over the us data file and store state name in variable
  //   for (var j = 0; j < us.features.length; j++) {
  //     var jsonState = us.features[j].properties.name;

  //     // link the population value if state names in the two files match
  //     //if (dataState == jsonState) {
  //       //us.features[j].properties.value = dataValue;
  //       //break;
  //     //}
  //   }
  // }






}





