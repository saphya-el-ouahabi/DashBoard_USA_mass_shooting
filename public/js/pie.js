// Pie chart sur la répartition des problèmes mentaux 

var pwidth = 410,
    pheight = 300,
    // trouver le minimum largeur et de hauteur et on divise par 2
    pradius = Math.min(pwidth, pheight) / 2;

// on definit les couleurs des catégories de notre pie 
var pcolor = d3.scale.ordinal()
    .range(["#CD5C5C", "#D3D3D3", "#8FBC8F"]);

// Arc
var arc = d3.svg.arc()
    // le rayon extérieur du pie
    .outerRadius(pradius - 10)
    // le rayon intérieur du pie, on le set à 0 p set 0 pour l'instant
    .innerRadius(0);

// Création d'une fontion pie
var pie = d3.layout.pie()
    // pas ordonné
    .sort(null)
    // on définit la valeur du pie par rapport à la colonne Count de notre fichier csv (nombre de personnes).
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

  // chemin append, on associe a chaque part du pie sa valeur (ici oui non autre)
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return pcolor(d.data.Value); });

  // ajoute le texte
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.Value; });

});
