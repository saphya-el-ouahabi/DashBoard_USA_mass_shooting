var label = d3.select(".label");
// Set the dimensions of the canvas / graph
var	margin = {top: 60, right: 20, bottom: 30, left: 170},
	width = 965 - margin.left - margin.right, //600
	height = 400 - margin.top - margin.bottom; //270

// Parse the date / time
var	parseDate = d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);

// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.Year); })
	.y(function(d) { return y(d.Count); });
    
// Adds the svg canvas
var	svg1 = d3.select('#my_lineplot').append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("datasets/fusillade_count.json", function(error, data) {
	data.forEach(function(d) {
        d.Year = parseDate(d.Year);
        d.Count = +d.Count;
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.Year; }));
	y.domain([0, d3.max(data, function(d) { return d.Count; })]);

	// Add the valueline path.
	svg1.append("path")		// Add the valueline path.
		.attr("class", "line")
		.attr("d", valueline(data));
		
	// Add the valueline path.
	svg1		
		.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("r", 8)
	    .attr("cx", function(d) {
	    return x(d.Year)
	  })

	  .attr("cy", function(d) {
	    return y(d.Count)
	  })


	.on("mouseover", function(d) {
		div.transition()
			.duration(1000) //longer to easier be seen
			.style("opacity", 0.9); //this is for the tooltip
		var text = "Nombre de fusillade" + "<br/>" + d.Count;
		div.html(text)
			.style("left", (d3.event.pageX)+"px")
			.style("top", (d3.event.pageY-28) + "px")
			.attr("fill", "steelblue");

	})
    .on("mouseout",function(d){
        div.transition()
           .duration(500)
           .style("opacity",0);

 });
		
	// Add the X Axis
	svg1.append("g")		
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add the Y Axis
	svg1.append("g")			
		.attr("class", "y axis")
		.call(yAxis);

});