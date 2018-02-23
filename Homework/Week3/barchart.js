/** 
* Amy van der Gun
* 10791760
* 
* barchart.js
*
* Creates an interactive barchart using data from a json file.
*/

// set the outer and inner width and height
var margin = {top: 30, right: 30, bottom: 40, left: 60},
    width = 950 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// set the chart sizes
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create arrays for the json data
var years = [];
var babies = [];

// load in the data file
d3.json("data.json", function(data) {

	// iterate over the data and push elements to the right array
  for (var element = 0; element < data.length; element++) {
		years.push(data[element].Year);
    babies.push(data[element].Babies);
	}

  // set the range and domain for x 
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(years);

	// set the range and domain for y
  var y = d3.scale.linear()
    .domain([0, d3.max(babies)])
    .range([height, 0]);

  // create x-axis below the bars
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  // draw x-axis on desired position and set label
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

  // create y-axis to the left of the bars
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // draw y-axis on desired position and set label
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
    .text("Amount of babies");

  // add bars with linked data to the chart
  chart.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Year); })
    .attr("y", function(d) { return y(d.Babies); })
    .attr("height", function(d) { return height - y(d.Babies); })
    .attr("width", x.rangeBand())

    // add interactivity to the chart
    .on("mouseover", function(d) {
        chart.append("text")
        .attr("id", "interactivity")
        .attr("y", y(d.Babies) - 12)
        .attr("x", x(d.Year) + 7)
        .style("text-anchor", "start")
        .style("font", "12px sans-serif")
        .text(d.Babies);
      d3.select(this)
        .style("fill", "orange");
    })

    // remove interactivity
    .on("mouseout", function(d) {
      d3.select(this)
        .style("fill", "grey")
      d3.select("#interactivity").remove();
    })
});