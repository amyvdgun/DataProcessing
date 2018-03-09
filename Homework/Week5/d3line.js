/** 
* Amy van der Gun
* 10791760
* 
* d3line.js
*
* Creates an interactive multi-line chart using json files
*
*/

// first load data from 2016
window.onload = function() {
   loadData(2016);
};

// update data when another button is clicked
function change() {
    var year = document.getElementById("dropdown").value;
    loadData(year);
}

// load in the data for the selected year
function loadData(year) {

	// remove the svg of previous selected year
	d3.selectAll("svg > *").remove();

	// set the outer and inner width and height
	var margin = {top: 40, bottom: 40, left: 80, right: 100},
	width = 1100 - margin.left - margin.right,
	height = 550 - margin.top - margin.bottom;

	// add the SVG element and set characteristics
	var svg = d3.select(".d3line")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// set the range for x
	var x = d3.scaleTime()
		.range([0, width]);

	// set the range for y
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	// create x-axis below plot
	var xAxis = d3.axisBottom(x);

	// create y-axis to the left of plot
	var yAxis = d3.axisLeft(y);

	// set the colors of plot
	var color = d3.scaleOrdinal(d3.schemeCategory10);

	// create format to parse dates into months
	var parseMonth = d3.timeParse("%Y%m%d");
	var formatMonth = d3.timeFormat("%b");

	// load in data from the selected JSON file
	d3.json("data" + year + ".json", function(error, data) {

			// throw error message if fail to load data files
			if (error) throw error;

			// convert data into numbers and dates into month format
			data.forEach(function(d) {
				d.Gemiddelde = Math.round(d.Gemiddelde * 10) / 100;
				d.Minimum = Math.round(d.Minimum * 10) / 100;
				d.Maximum = Math.round(d.Maximum * 10) / 100;
				d.Datum = parseMonth(d.Datum);
			})

			// exclude the dates from the data
			var keys = d3.keys(data[0]).filter(function(key) { return key !== "Datum"; });

			// make sure that the temperature data have a unique id and return
			var TempData = keys.map(function(id) {
				return {
					id: id,
					values: data.map(function(d) {
						return {Datum: d["Datum"], Temperatuur: d[id]};
					})
				};
			});

			// set the domain for x and y based on the dataset
			x.domain(d3.extent(data, function(d) { return d.Datum; }));
			y.domain([
				d3.min(TempData, function(c) { return d3.min(c.values, function(d) { return d.Temperatuur; }); }),
				d3.max(TempData, function(c) { return d3.max(c.values, function(d) { return d.Temperatuur; }); })
				]);

			// set color based on the filtered data
			color.domain(keys);

			// draw x-axis on desired position and set label
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
			  	.call(xAxis
			  		.ticks(d3.timeMonth)
			  		.tickSize(0, 0)
			  		.tickFormat(d3.timeFormat("%B"))
			  		.tickSizeInner(5)
			  		.tickPadding(5))
			  .append("text")
				.attr("class", "label")
				.attr("fill", "#000")
				.attr("x", width)
				.attr("y", margin.bottom / 2)
				.style("text-anchor", "end");

			// draw y-axis on desired position and set label
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			  .append("text")
				.attr("class", "label")
				.attr("fill", "#000")
				.attr("transform", "rotate(-90)")
				.attr("x", 0)
				.attr("y", -margin.left / 2)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Temperatuur (C)");

			// initialize line per type of temperature based on id
			var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(d) { return x(d.Datum); })
				.y(function(d) { return y(d.Temperatuur); });

			// link temperature data to the right line based on id
			var TempType = svg.selectAll(".temp")
				.data(TempData)
				.enter().append("g")
		  			.attr("class", "temp");

			// draw line and assign the color based on id
			TempType.append("path")
				.attr("class", "line")
				.attr("d", function(d) { return line(d.values); })
				.style("stroke", function(d) { return color(d.id); });

			// create the legend
			var legend = svg.selectAll(".legend")
		      	.data(color.domain())
		      .enter().append("g")
		      	.attr("class", "legend")
		      	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		  
		  	// add rectangles for legend
			legend.append("rect")
		    	.attr("x", width)
		    	.attr("width", 18)
		    	.attr("height", 18)
		    	.style("fill", color);

		  	// add text for legend
			legend.append("text")
		    	.attr("x", width + 20)
		    	.attr("y", 9)
		    	.attr("dy", ".35em")
		    	.style("text-anchor", "left")
		    	.text(function(d) { return d; });

			// create interactivity
			var mouseG = svg.append("g")
	      		.attr("class", "mouse-over-effects");

		    // append vertical line 
		    mouseG.append("path")
				.attr("class", "mouse-line")
				.style("stroke", "black")
				.style("stroke-width", "1px")
				.style("opacity", "0");
	      
	    	var lines = document.getElementsByClassName('line');

	    	var mousePerLine = mouseG.selectAll('.mouse-per-line')
				.data(TempData)
				.enter()
				.append("g")
				.attr("class", "mouse-per-line");

		    // append little circles that correspond to the different lines
		    mousePerLine.append("circle")
				.attr("r", 7)
				.style("stroke", function(d) {
				return color(d.id);
				})
				.style("fill", "none")
				.style("stroke-width", "1px")
				.style("opacity", "0");

		    // append text 
		    mousePerLine.append("text")
		    	.attr("transform", "translate(10,3)");

		    // react to mouse movements
		    mouseG.append('svg:rect')
				.attr('width', width)
				.attr('height', height)
				.attr('fill', 'none')
				.attr('pointer-events', 'all')
				.on('mouseout', function() { 
				d3.select(".mouse-line")
					.style("opacity", "0");
				d3.selectAll(".mouse-per-line circle")
				  	.style("opacity", "0");
				d3.selectAll(".mouse-per-line text")
				  	.style("opacity", "0");
		      	})
				.on('mouseover', function() {
				d3.select(".mouse-line")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line circle")
					.style("opacity", "1");
				d3.selectAll(".mouse-per-line text")
					.style("opacity", "1");
		      	})
				.on('mousemove', function() {
					var mouse = d3.mouse(this);
					d3.select(".mouse-line")
					.attr("d", function() {
						var d = "M" + mouse[0] + "," + height;
						d += " " + mouse[0] + "," + 0;
						return d;
		      	});

	        d3.selectAll(".mouse-per-line")
				.attr("transform", function(d, i) {
				var xDate = x.invert(mouse[0]),
				bisect = d3.bisector(function(d) { return d.date; }).right;
				idx = bisect(d.values, xDate);

	        var beginning = 0,
	            end = lines[i].getTotalLength(),
	            target = null;

	        while (true) {
				target = Math.floor((beginning + end) / 2);
				pos = lines[i].getPointAtLength(target);
				if ((target === end || target === beginning) && pos.x !== mouse[0]) {
					break;
				}
				if (pos.x > mouse[0])      end = target;
				else if (pos.x < mouse[0]) beginning = target;
				else break;
	        }
	        
	        d3.select(this).select('text')
	        	.text(y.invert(pos.y).toFixed(2));
	          
	        return "translate(" + mouse[0] + "," + pos.y +")";
        	});
		});
	});
}

// call function change when button is clicked only when document is loaded
document.addEventListener("click", function() {
    if (document.readyState === "complete") {
        change();
    }	
});


