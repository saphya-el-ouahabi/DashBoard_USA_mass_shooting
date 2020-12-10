// Bar chart sur la répartition des ethnies 

// on récupère les données de notre fichier csv (créé en amont grace au TPd3js.py )
d3.csv("datasets/repartition_ethnie.csv", function(error, data){
    data.forEach(function (d) {
      d.Count = +d.Count;
    });
    // console.log(data)
    var margin = {top: 65, bottom: 50, left: 50, right: 30}, axisPadding = 10;
    var Width = 630, Height = 300;
    var svgWidth = Width + margin.left + margin.right,
        svgHeight = Height + margin.top + margin.bottom;
    var maxCount = d3.max(data, function(d){ return d.Count; });
    
    
    // on définit les échelles et les axes
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d){ return d.Race; }))
        .rangeBands([0, Width], 0.1);
    var yScale = d3.scale.linear()
        .domain([0, maxCount])
        .range([0, Height]);  
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0,0)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale.copy().domain([maxCount, 0]))
        .tickSize(6,0)
        .ticks(5)
        .orient('left');
    
    // ainsi que les couleurs de nos barres 
    var color=d3.scale.ordinal()
        .range(["#708090","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
    
    // Création du svg qui va être appelé dans notre fichier html
    var svg = d3.select('#my_chart1').append('svg')
        .attr({width: svgWidth, height: svgHeight})
    
    // On dessine les axes 
    var xGroup = svg.append('g')
        .attr('class', 'xGroup')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height + axisPadding] + ')');
    xGroup.call(xAxis);
    styleAxis(xGroup);
    var yGroup = svg.append('g')
        .attr('class', 'yGroup')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    yGroup.call(yAxis);
    styleAxis(yGroup);


    // on créé la variable label et on associe le positionnement 
    var label = svg.append('g')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');

    //visualisation pour le corps du graph
    var graph = svg.append('g')
        .attr('class', 'graph')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height] + ')');
    var bars = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d,i){ return 'translate(' + [xScale(d.Race), -1 * yScale(d.Count)] + ')'; });
    bars.append('rect')
        .each(function(d,i){
            d3.select(this).attr({
                fill: color.range()[i],
                width: xScale.rangeBand(),
                height: yScale(d.Count),
            })
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    bars.append('text')
    .text(function(d){ return d.Count; })
    .each(function(d,i){
        d3.select(this).attr({
            fill: color.range()[i],
            stroke: 'none',
            x: xScale.rangeBand() / 2,
            y: -5,
            'text-anchor': 'middle',
        });
    })
    
    
    // tooltips
    var div = d3.select('#my_chart1').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
    function mouseover(){
        div.style('display', 'inline');
    }
    function mousemove(){
        var d = d3.select(this).data()[0]
        div
            .html(d.Race + '<hr/>' + d.Count)
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }
    function mouseout(){
        div.style('display', 'none');
    }
})


function styleAxis(axis){
    // path
    axis.select('.domain').attr({
        fill: 'none',
        stroke: '#888',
        'stroke-width': 1
    });
    // tick
    axis.selectAll('.tick line').attr({
        stroke: '#000',
        'stroke-width': 1,
    })

  }
