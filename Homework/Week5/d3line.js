/** 
* Amy van der Gun
* 10791760
* 
* d3line.js
*
*
*/

// load in data form JSON files
queue()
	.defer(d3.json, "data.json")
	.defer(d3.json, "data2017.json")
	.await(function(data2016, data2017) {
		
		// convert data into numbers
		data2016.forEach(function(d) {
    		d.Immigratie = parseInt(d.Immigratie);
    		d.Emigratie = parseInt(d.Emigratie);
    		d.TotaleBevolkingsgroei = parseInt(d.TotaleBevolkingsgroei);
  		});

		// convert data into numbers
  		data2017.forEach(function(d) {
  			d.Immigratie = parseInt(d.Immigratie);
  			d.Emigratie = parseInt(d.Emigratie);
  			d.TotaleBevolkingsgroei = parseInt(d.TotaleBevolkingsgroei);
  		});

  		console.log(data2016);
  		console.log(data2017);
 	});

