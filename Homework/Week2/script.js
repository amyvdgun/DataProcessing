// initialize request 
var request = new XMLHttpRequest();

// open data file
request.open("get", "data.csv", true);

request.onreadystatechange = function (){
    if (request.readyState === 4 && request.status === 200){

		// split the data and store in array
		var data = request.responseText.trim().split("\n");

		// get chart element from html
		var chart = document.getElementById("graph");
		var context = chart.getContext("2d");

		// set chart characteristics
		chart.width = data.length;
		chart.height = 350;
		context.strokeStyle = "black";
		context.fillStyle = "black";
		context.font = "12px calibri";

      	// transform the x and y coordinates to canvas coordinates
      	transformX = createTransform([0,chart.width], [chart.width, 0]);
      	transformY = createTransform([-50, chart.height],[chart.height, 0]);

		context.beginPath();
		// iterate over the data and divide into date and temperature
		for (count = 0; count < data.length; count++) {
			var row = data[count].trim().split(",");
			var date = new Date(row[0].substring(0,4) + '-' + row[0].substring(4,6) + '-' + row[0].substring(6,8));
			var temperature = parseInt(row[1]);

			// draw data lines using the createTransform function
			context.lineTo(transformX(count), transformY(temperature));
		}
		context.stroke();

		// create axes 
		context.strokeRect(0, 0, chart.width, chart.height);

		// draw x-axis and labels
		context.beginPath();
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var monthcounter = 0;
		for(var countX = 0; countX <= chart.width; countX += chart.width / 12) {
			context.moveTo(countX, chart.height);
			context.lineTo(countX, chart.height - 5);
			context.fillText(months[monthcounter], countX + 3, chart.height - 5);
			monthcounter++;
		}
		context.stroke();

		// draw y-axis and labels
		context.beginPath();
		var temperature = -5;
		for (var countY = 0; countY < 9; countY ++) {
			context.moveTo(0, chart.height - 44*countY);
			context.lineTo(5, chart.height - 44*countY);
			if (temperature != -5){
				context.fillText(temperature + "C", 5, chart.height - 44*countY);
			}
			temperature += 5;
		}
		context.stroke();
	}
}
request.send();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

