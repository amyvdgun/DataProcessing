/** 
* Amy van der Gun
* 10791760
* 
* barchart.js
*
* Creates an interactive barchart using data from a json file.
*
* With help from: 
* https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be 
*/

// creates the barchart using a json file and users input
function createBarchart(alldata, chosenState) {
  
  // set the outer and inner width and height
  var margin = {top: 40, bottom: 20, left: 200, right: 200},
    height = 500 - margin.top - margin.bottom,
    width = 1100 - margin.left - margin.right;

  // set the chart sizes
  var chart = d3.select("#barchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create interactive title
  document.getElementById("barchartTitle").innerHTML = "Babies born in " + chosenState;

  // add the tooltip and its content
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      var formatting = d3.format(",");
      return (formatting(d))});

  // start the tip
  chart.call(tip);

  // create arrays for the json data
  var years = ["2011", "2012", "2013", "2014", "2015", "2016", "2017"];
  var babies = [];

  // iterate over the data and push to the right array
  for (var i = 0; i < alldata.length; i++) {
    if (alldata[i].StateName === chosenState) {
      babies.push(alldata[i].Births2011);
      babies.push(alldata[i].Births2012);
      babies.push(alldata[i].Births2013);
      babies.push(alldata[i].Births2014);
      babies.push(alldata[i].Births2015);
      babies.push(alldata[i].Births2016);
      babies.push(alldata[i].Births2017);
    }
  }

  // set the range and domain for x 
  var x = d3.scaleBand()
    .range([0, width], .1)
    .padding(0.4)
    .domain(years);

  // set the range and domain for y
  var y = d3.scaleLinear()
    .domain([0, d3.max(babies)])
    .range([height, 0]);

  // create and draw x-axis on desired position
  var xAxis = d3.axisBottom(x);
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // create and draw y-axis on desired position
  var yAxis = d3.axisLeft(y);
  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  // set label of y axis
  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -margin.left / 2.5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font", "12px sans-serif")
    .text("Amount of births");

  // add bars with linked data to the chart
  chart.selectAll(".bar")
    .data(babies)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) { return x(years[i]); })
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })
    .attr("width", x.bandwidth())
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .style("fill", "#AF9483");
}

// this functions updates the barchart when user clicks on particular state
function update(alldata, state) {

  // set the outer and inner width and height
  var margin = {top: 40, bottom: 20, left: 200, right: 200},
    height = 500 - margin.top - margin.bottom,
    width = 1100 - margin.left - margin.right;

  // select the element to change and store in chart variable
  var chart = d3.select("#barchart").select("svg").select("g");

  // let the title change
  document.getElementById("barchartTitle").innerHTML = "Babies born in " + state;

  // create empty array
  var babies = [];

  // iterate over the data and push state data to the babies array
  for (var i = 0; i < alldata.length; i++) {
    if (alldata[i].StateName === state) {
      babies.push(alldata[i].Births2011);
      babies.push(alldata[i].Births2012);
      babies.push(alldata[i].Births2013);
      babies.push(alldata[i].Births2014);
      babies.push(alldata[i].Births2015);
      babies.push(alldata[i].Births2016);
      babies.push(alldata[i].Births2017);
    }
  }

  // add the tooltip and its content
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      var formatting = d3.format(",");
      return (formatting(d))});

  // start the tip
  chart.call(tip);

  // set the range and domain for y
  var y = d3.scaleLinear()
    .domain([0, d3.max(babies)])
    .range([height, 0]);

  // create and draw y-axis on desired position and set label
  var yAxis = d3.axisLeft(y);

  // call y axis and add transition
  d3.select(".y.axis")
    .transition()
    .duration(1000)
    .call(yAxis)

  // select bars and link data 
  var bars = chart.selectAll(".bar")
    .data(babies)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .style("fill", "#AF9483");

  // link new y coordinates to bars and add interactivity and transition
  bars
    .transition().duration(1000)
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })
    .style("fill", "#AF9483");
}

function searchState() {

    var input = document.getElementById("inputState");
    var filter = input.value.toUpperCase();

    console.log(input);
    console.log(filter);

    // // Loop through all list items, and hide those who don't match the search query
    // for (i = 0; i < li.length; i++) {
    //     a = li[i].getElementsByTagName("a")[0];
    //     if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
    //         li[i].style.display = "";
    //     } else {
    //         li[i].style.display = "none";
    //     }
    // }
}





