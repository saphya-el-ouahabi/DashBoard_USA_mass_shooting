var pwidth = 410,
    pheight = 300,
    // find the min of width and height and devided by 2
    pradius = Math.min(pwidth, pheight) / 2;

// color for the pie
var pcolor = d3.scale.ordinal()
    .range(["#CD5C5C", "#D3D3D3", "#8FBC8F"]);

// Arc
var arc = d3.svg.arc()
    // the outer radius of the pie chart
    .outerRadius(pradius - 10)
    // the inner radius of the pie chart, set 0 for now
    .innerRadius(0);

// Constructs a new pie function
var pie = d3.layout.pie()
    // not sorting
    .sort(null)
    // set the pie chart value to population.
    .value(function(d) { return d.Count; });

var svg = d3.select("#my_pie").append("svg")
    .attr("width", pwidth)
    .attr("height", pheight)
    .append("g")
    .attr("transform", "translate(" + pwidth / 2 + "," + pheight / 2 + ")");

    
var div1= d3.select("body").append("div")
    .attr("class", "tooltip")         
    .style("opacity", 0);

d3.csv("datasets/mental.csv", function(error, data) {
  // convert all population to integer
  data.forEach(function(d) {
    d.Count = +d.Count;
  });

  // append a group
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .on("mouseover",function(d){
        div1.transition()
              .duration(200)
              .style("opacity",.9);
        div1.html(+d.data.pct + " %")
              .style("left",(d3.event.pageX +10)+"px")
              .style("top",(d3.event.pageY -50)+"px");
    })
        .on("mouseout",function(d){
            div1.transition()
              .duration(500)
              .style("opacity",0);
        });

  // append path, the pie for each legal
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return pcolor(d.data.Value); });

  // add text
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.Value; });

});
