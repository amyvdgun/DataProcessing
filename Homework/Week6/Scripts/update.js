/** 
* Amy van der Gun
* 10791760
* 
* update.js
*
* Creates an interactive map of the USA.
*
* With help from:
* https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3
*/

function updateBarchart(alldata, chosenState){

  var y = d3.scaleLinear()
    .domain([0, d3.max(babies)])
    .range([height, 0]);

	//set domain for the x axis
	xChart.domain(data.map(function(d){ return d.viewer_age; }) );
	//set domain for y axis
	yChart.domain( [0, d3.max(data, function(d){ return +d.watch_time_minutes; })] );
	
	//get the width of each bar 
	var barWidth = width / data.length;
	
	//select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chart.selectAll(".bar")
					.remove()
					.exit()
					.data(data)		

	//now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i){ return i * barWidth + 1 })
		.attr("y", function(d){ return yChart( d.watch_time_minutes); })
		.attr("height", function(d){ return height - yChart(d.watch_time_minutes); })
		.attr("width", barWidth - 1)
		.attr("fill", function(d){ 
			if(d.viewer_gender === "FEMALE"){
				return "rgb(251,180,174)";
			}else{
				return "rgb(179,205,227)";
			}
		});
	//left axis
	chart.select('.y')
		  .call(yAxis)
	//bottom axis
	chart.select('.xAxis')
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			
}//end update
