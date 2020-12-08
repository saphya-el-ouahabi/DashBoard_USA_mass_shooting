//largeur et hauteur de la carte
var width = 1060;
var height = 600;
var centered;


//création et ajout des éléments svg à la carte
var svg5 = d3.select("#map")
	.attr("width", width)
	.attr("height", height)
	.append("g");


//tooltip
var div = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0)

let tooltipVictims = div.append("div")
	.attr("id", "victims");	

tooltipVictims.append("div")
   .attr("id", "killed");

tooltipVictims.append("div")
   .attr("id", "injured");

let tooltipLine = div.append("hr")
	.attr("id", "separator");

let tootipcontext = div.append("div")
	.attr("id", "context");

tootipcontext.append("div")
   .attr("id", "title");

tootipcontext.append("div")
   .attr("id", "date");

tootipcontext.append("div")
   .attr("id", "location");

div.append("div")
   .attr("id", "description");


//carte
var projection = d3.geo.albersUsa()
	.translate([width / 2, height / 2])     //centrer
	.scale([1000]);          				//voir la carte en entière

//path
var path = d3.geo.path()               //converti geojson en svg
	.projection(projection); 		   //utilise la projection albersUsa


//couleur des états et légende
var color = d3.scale.linear()
	.range(["rgb(254, 150, 160)", "rgb(255, 111, 125)", "rgb(252, 93, 93)", "rgb(237, 0, 0)", "rgb(198, 8, 0)", "rgb(133, 6, 6)"]);

var legendText = ["+150", "100-150", "50-100", "30-50","10-30","0-10"];


//pour récupérer les états du dataset
d3.csv("datasets/database_usa_final.csv", function (data) {
	var expensesCount = d3.nest()
		.key(function (data) { return data.state; })
		.rollup(function (v) {
			return {
				total_victims: d3.sum(v, function (e) { return e.total_victims; }),
				r: reducevalue(d3.sum(v, function (e) { return e.total_victims; }))
			};
		}).entries(data);
	color.domain([0, 1, 2, 3, 4, 5]);

	//on fusionne les données geojson avec les données des états
	d3.json("datasets/us-states.json", function (json) {

		for (var i = 0; i < expensesCount.length; i++) {
			var dataState = expensesCount[i].key;
			var dataValue = expensesCount[i].values.r;

			for (var j = 0; j < json.features.length; j++) {
				var jsonState = json.features[j].properties.name;

				if (dataState == jsonState) {
					json.features[j].properties.r = dataValue;
					break;
				}
			}
		}

		//relie les données
		svg5.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
				.attr("d", path)
				.style("stroke", "#fff")
				.style("stroke-width", "1")
				.style("fill", function (d) {
					var value = d.properties.r;
					if (value) {
						return color(value);
					} else {
						return color(0);
					}
				})
			.on("mouseover", function (d) {})
			.on("dblclick", double_clicked);


		//pour zoomer sur la carte
		function double_clicked(d) {
			var x, y, k;
			if (d && centered !== d) {
				var centroid = path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				k = 4;
				centered = d;
			} else {
				x = width / 2;
				y = height / 2;
				k = 1;
				centered = null;
			}		
			svg5.selectAll("path")
				.classed("active", centered && function(d) { return d === centered; });		
			svg5.transition()
				.duration(750)
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
				.style("stroke-width", 1.5 / k + "px");
			}

		
		//pour afficher les cercles et les données correspondantes
		d3.csv("datasets/database_usa_final.csv", function (data) {
			svg5.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					return projection([d.longitude, d.latitude])[0];
				})
				.attr("cy", function (d) {
					return projection([d.longitude, d.latitude])[1];
				})
				.attr("r", function (d) {
					return Math.sqrt(d.total_victims) * 2;
				})
				.style("fill", "rgb(127, 127, 127)")
				.style("opacity", 0.85)
				.on("mouseover", function (d) {
					div.transition()
						.duration(200)
						.style("opacity", 1)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
									
					//nbr de décès
					d3.select("#killed")
					  .html("<b><font color=\"red\">" + Math.floor(d.fatalities) + "</font></b>" + " killed");
					//nobr de blessés
					d3.select("#injured")
					  .html("<b><font color=\"red\">" + Math.floor(d.injured) + "</font></b>" + " injured");

					//lieu de l'affaire
					d3.select("#location")
						.text(d.location);		
										
					//nom de l'affaire
					d3.select("#title")
						.text(d.case);
					//date
					d3.select("#date")
						.text(d.date);
					//description
					d3.select("#description")
						.text(d.summary);
				})             
				.on("mouseout", function (d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
				});
		});

		//légende
		var legend = d3.select("#legend")
			.attr("class", "legend")
			.attr("width", 140)
			.attr("height", 200)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter()
			.append("g")
			.attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function (d) { return d; });
	});

});