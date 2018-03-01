/** 
* Amy van der Gun
* 10791760
* 
* scatterplot.js
*
* Creates a scatterplot using data from a json file.
*/

// set the outer and inner width and height
var margin = {top: 30, right: 30, bottom: 40, left: 60},
    width = 950 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

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

var color = d3.scale.category10();

var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// load in the data file
d3.json("data.json", function(data) {

  data.forEach(function(d) {
    d.LifeExpectancy = parseFloat(d.LifeExpectancy);
    d.GPA = parseFloat(d.GPA);
  })

  x.domain(d3.extent(data, function(d) { return d.GPA; })).nice();
  y.domain(d3.extent(data, function(d) { return d.LifeExpectancy; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", margin.bottom/1.1)
      .style("text-anchor", "end")
      .text("GPA/Capita ($)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
	  .attr("y", -margin.left/1.25)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Life Expectancy");

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.GPA); })
      .attr("cy", function(d) { return y(d.LifeExpectancy); })
      .style("fill", function(d) { return color(d.Region); })
      .on("mouseover", function(d) {
      	tooltip.transition()
      		.duration(200)
      		.style("opacity", .9);
      	tooltip.html(d["Country"] + "<br>" + x + y);
      })
      .on("mouseout", function(d) {
      	tooltip.transition()
      		.duration(500)
      		.style("opacity", 0);
      });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});