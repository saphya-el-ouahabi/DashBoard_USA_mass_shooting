var tabulate = function (data,columns) {
    var table = d3.select('body').append('table')
      var thead = table.append('thead')
      var tbody = table.append('tbody')
  
      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .text(function (d) { return d })
  
      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')
  
      var cells = rows.selectAll('td')
          .data(function(row) {
              return columns.map(function (column) {
                  return { column: column, value: row[column] }
            })
        })
        .enter()
      .append('td')
        .text(function (d) { return d.value })
  
    return table;
  }
  
  d3.csv('datasets/database_usa_final.csv',function (data) {
      var columns = ['case','location','date','summary','fatalities','injured','total_victims',
      'place','age_of_shooter','prior_signs_mental_health_issues','weapons_obtained_legally',
      'weapon_type','race','gender','sources','latitude','longitude','city','state']
    tabulate(data,columns)
  })