/** 
* Amy van der Gun
* 10791760
* 
* legend.js
*
* Creates a legend in a chart. 
*/

var width = 360;
var height = 360;
var legendRectSize = 20;
var legendSpacing = 6; 

var svg = d3.select(".legend")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(50,40)");

var squares = d3.scale.ordinal()
	.domain(["jo", "jojo", "jojojo", "jojojojo", "jojojojojo"])
	.range(["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"])

 var legend = svg.selectAll(".legend")
	.data(squares.domain())                  
	.enter()                               
	.append("g")                                          
	.attr("class", "legend")                              
	.attr("transform", function(d, i) {             
		var height = legendRectSize + legendSpacing;        
		var offset =  height * squares.domain().length / 2;   
		var horz = -2 * legendRectSize;                      
		var vert = i * height - offset;                      
		return "translate(" + horz + "," + vert + ")";      
});                                                   

legend.append("rect")                               
	.attr("width", legendRectSize)               
	.attr("height", legendRectSize)                   
	.style("fill", squares)                             
	.style("stroke", squares);                              

legend.append("text")                            
	.attr("x", legendRectSize + legendSpacing)             
	.attr("y", legendRectSize - legendSpacing)           
	.text(function(d) { return d; });       