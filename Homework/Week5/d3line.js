/** 
* Amy van der Gun
* 10791760
* 
* d3line.js
*
* dropdown menu: https://bl.ocks.org/ProQuestionAsker/ee398d1478f6416bba9916cee66f145d
*
*
*/

// set the outer and inner width and height
var margin = {top: 40, bottom: 50, left: 80, right: 80},
  width = 1100 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// add the SVG element and set characteristics
var svg = d3.select(".d3line")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the range for x 
var x = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.1);

// set the range for y
var y = d3.scaleLinear()
	.rangeRound([height, 0]);

// create x-axis below plot
var xAxis = d3.axisBottom(x);

// create y-axis to the left of plot
var yAxis = d3.axisLeft(y);

// set the colors of plot
var color = d3.scaleOrdinal(d3.schemeCategory10);

// load in data from JSON files
queue()
	.defer(d3.json, "data2016.json")
	.defer(d3.json, "data2017.json")
	.await(function(error, data2016, data2017) {
		
		// convert data into numbers
		data2016.forEach(function(d) {
			d.Immigratie = parseInt(d.Immigratie);
			d.Emigratie = parseInt(d.Emigratie);
			d.TotaleBevolkingsgroei = parseInt(d.TotaleBevolkingsgroei);
		});

		// // convert data into numbers
		// data2017.forEach(function(d) {
		// 	d.Immigratie = parseInt(d.Immigratie);
		// 	d.Emigratie = parseInt(d.Emigratie);
		// 	d.TotaleBevolkingsgroei = parseInt(d.TotaleBevolkingsgroei);
		// });

		// set the domain for x and y based on the dataset
		x.domain(data2016.map(function(d) { return d.Datum; }));
		y.domain([
			d3.min(data2016, function(d) { return d.TotaleBevolkingsgroei; }),
			d3.max(data2016, function(d) { return d.Immigratie; }) 
		]);

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

		var line1 = d3.line()
			.x(function(data2016) {return x(data2016.Datum); })
			.y(function(data2016) {return y(data2016.Immigratie); });

		var line2 = d3.line()
			.x(function(data2016) {return x(data2016.Datum); })
			.y(function(data2016) {return y(data2016.Emigratie); });

		var line3 = d3.line()
			.x(function(data2016) {return x(data2016.Datum); })
			.y(function(data2016) {return y(data2016.TotaleBevolkingsgroei); });

		svg.append("path")
			.data([data2016])
			.attr("class", "line")
			.attr("d", line1)
			.style("stroke", "orange");

		svg.append("path")
			.data([data2016])
			.attr("class", "line")
			.attr("d", line2)
			.style("stroke", "steelblue");

		svg.append("path")
			.data([data2016])
			.attr("class", "line")
			.attr("d", line3)
			.style("stroke", "black");
});


