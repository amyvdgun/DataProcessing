/** 
* Amy van der Gun
* 10791760
* 
* scatterplot.js
*
* Creates a scatterplot using data from a json file.
*/

// set the outer and inner width and height
var margin = {top: 40, bottom: 50, left: 100, right: 200},
  width = 1100 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// add the SVG element and set characteristics
var svg = d3.select(".scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the range for x 
var x = d3.scale.linear()
  .range([0, width]);

// create x-axis below plot
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// set the range for y
var y = d3.scale.linear()
  .range([height, 0]);

// create y-axis to the left of plot
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

// set the colors of plot
var color = d3.scale.category10();

// add the tooltip and its content
var tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-10, 0])
  .html(function (d) {
    return (d.Country + "<br>" + "GPA: " 
    + d.GPA + "<br>" + "Life Expectancy: " + d.LifeExpectancy)});

// start the tip
svg.call(tip);

// load in the data file
d3.json("data.json", function(data) {

  // convert data into numbers with 2 decimal points
  data.forEach(function(d) {
    d.LifeExpectancy = Math.round(d.LifeExpectancy * 100) / 100;
    d.GPA = Math.round(d.GPA * 100) / 100;
  })

  // set the domain for x and y based on the dataset
  x.domain(d3.extent(data, function(d) { return d.GPA; })).nice();
  y.domain(d3.extent(data, function(d) { return d.LifeExpectancy; })).nice();

  // draw x-axis on desired position and set label
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", margin.bottom/1.15)
      .style("text-anchor", "end")
      .text("GPA/Capita ($)");

  // draw y-axis on desired position and set label
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", -margin.left/2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Life Expectancy");
  
  // create dots in the plot for each data point
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function(d) { return x(d.GPA); })
      .attr("cy", function(d) { return y(d.LifeExpectancy); })
      .style("fill", function(d) { return color(d.Region); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  // create the legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
  // add rectangles for legend
  legend.append("rect")
    .attr("x", width + 15)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // add text for legend
  legend.append("text")
    .attr("x", width + 40)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "left")
    .text(function(d) { return d; });

});