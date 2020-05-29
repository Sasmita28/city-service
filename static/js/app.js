var department="ignore"
var status="ignore"
var source="ignore"
var year = "2020"

// store variables in an array
var variables = [department, status, source , year];

function createQuery(variables){
  // create empty arrays for manipulating elements and indexes
  var query_variables = []
  var variables_index = []

  // grab the elements and indexes of elements in 'variables' not equal to ignore and push into seperate arrays defined above
  variables.forEach(function(element,index) {
      if (element != "ignore") {
          query_variables.push(element)
          variables_index.push(index)
      };
  });

  // starting point for developing query string
  var parameter_key = ["/query?"]

  // logic to look at positions of elements within arrays to build query string
  variables_index.forEach(function(element, index){
      if (element == 0 && index == 0){
          parameter_key.push("department=")
          parameter_key.push(query_variables[index])
      } else if (element == 0 && index != 0) {
          parameter_key.push("&department=")
          parameter_key.push(query_variables[index])
      } else if (element == 1 && index == 0) {
          parameter_key.push("status=")
          parameter_key.push(query_variables[index])
      } else if (element == 1 && index != 0) {
          parameter_key.push("&status=")
          parameter_key.push(query_variables[index])
      } else if (element == 2 && index == 0) {
          parameter_key.push("source=")
          parameter_key.push(query_variables[index])
      } else if (element == 2 && index != 0) {
          parameter_key.push("&source=")
          parameter_key.push(query_variables[index])
      } else if (element == 3 && index == 0) {
          parameter_key.push("year=")
          parameter_key.push(query_variables[index])
      } else if (element == 3 && index != 0) {
          parameter_key.push("&year=")
          parameter_key.push(query_variables[index])
      };
  });

  // string together elements of parameter_key array
  var url = parameter_key.join("");

  // print out url 
  // console.log(url)
  return url;

  // buildChart();
}



function buildChart() {

  // Creating map object

  // filterYear();
  var url = createQuery(variables);
  d3.json(url).then(data => {
  console.log(url)
  console.log(data.length);


  //  console.log(data)

    var source = data.map(row => row.source);
    var status = data.map(row => row.status);
    var department = data.map(row => row.department);
    var year = data.map(row => row.year);
    var type = data.map(row => row.type);

    // for Mike's Pie Chart
    // Groupby department to get count of occurence of calls
    const groupByDepartment = data.reduce((acc, val) => {
      acc[val.department] = acc[val.department] + 1 || 1;
      return acc;
      }, {});
      
        // extract label and values
        var labels = Object.keys(groupByDepartment);
        var values = Object.values(groupByDepartment);
    
      
    // *******************

    // for ben's Line Chart calculations****Part-1****
      //Sort Data by Month-Day
        //Method to Sort by Strings Found at https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
        var data = data.sort((a, b) => a['creation_month-day'].localeCompare(b['creation_month-day']));
    // ***********************************

    var result = [];
    result = type.reduce((total, value) => {
      total[value] = (total[value] || 0) + 1;
      result.push(total);
      return total;
      },
     {});

      var sortable = [];
      for (var type in result) {
          sortable.push([type, result[type]]);
      }
      
      sortable.sort(function(a, b) {
          return b[1] - a[1];
      });
      var sliced = sortable.slice(0,20);
    // Ben's Line Chart calculations ***** part-2*******
      //Return Rows Corresponding to the Top 20 Types
      var data1 = data.filter(row => row['type'] == Object.values(sliced)[0][0] || row['type'] == Object.values(sliced)[1][0]
      || row['type'] == Object.values(sliced)[2][0] || row['type'] == Object.values(sliced)[3][0] || row['type'] == Object.values(sliced)[4][0]
      || row['type'] == Object.values(sliced)[5][0] || row['type'] == Object.values(sliced)[6][0] || row['type'] == Object.values(sliced)[7][0]
      || row['type'] == Object.values(sliced)[8][0] || row['type'] == Object.values(sliced)[9][0] || row['type'] == Object.values(sliced)[10][0]
      || row['type'] == Object.values(sliced)[11][0] || row['type'] == Object.values(sliced)[12][0] || row['type'] == Object.values(sliced)[13][0]
      || row['type'] == Object.values(sliced)[14][0] || row['type'] == Object.values(sliced)[15][0] || row['type'] == Object.values(sliced)[16][0]
      || row['type'] == Object.values(sliced)[17][0] || row['type'] == Object.values(sliced)[18][0] || row['type'] == Object.values(sliced)[19][0]);
  //  console.log(data1);

   //Replace All "unknown" Values with None
   //Method Found at https://stackoverflow.com/questions/28263868/how-can-i-replace-the-text-in-json-string-with-a-userscript-for-greasemonkey
   var stringified = JSON.stringify(data1);
   stringified = stringified.replace("unknown", null);
   
   //Convert JSON String Back into Object
   var data1 = JSON.parse(stringified);
      // *************************************************

    initBar();
    initPie();
    initLine1();
    initLine2();
    initMap();
    // optionChanged();
    // ************* for Map ************
    function initMap() {
      // Create a map object
      var myMap = L.map("map", {
        center: [39.0997, -94.5786],
        zoom: 13
      });

      L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      }).addTo(myMap);

     
    };
   // ************* End Map ************
  //*****************For Line Chart1***********
   function initLine1() {
    chart_average = [{
      type:'scatter',
      x: data1.map(data => data['creation_month-day']),
      y: data1.map(data => data['days_to_close']),
      connectgaps: true,
      fill: 'tozeroy',
      transforms: [{
          type: 'aggregate',
          groups: data1.map(data => data['creation_month-day']), 
          aggregations: [
          {target: 'y', func: 'avg', enabled: true},
          ]
      }]
  }];
  

    //Create Layout
    layout_average = {
      title: "Average Days to Close vs Date",
      xaxis: {title: "Date"},
      yaxis: {title: "Average Days to Close"}
  };

    Plotly.newPlot("line1", chart_average, layout_average);
   
  };
  //*************End Line Chart1********************************
    //*****************For Line Chart1***********
    function initLine2() {
      chart_count = [{
        type:'scatter',
        x: data1.map(data => data['creation_month-day']),
        y: data1.map(data => data['days_to_close']),
        connectgaps: true,
        fill: 'tozeroy',
        transforms: [{
            type: 'aggregate',
            groups: data1.map(data => data['creation_month-day']),
            aggregations: [
            {target: 'y', func: 'count', enabled: true},
            ]
        }]
    }];
  
    layout_count = {
      title: "Count Days to Close vs Date",
      xaxis: {title: "Date"},
      yaxis: {title: "Count Days to Close"}
  };
      Plotly.newPlot("line2", chart_count, layout_count);
     
    };
    //*************End Line Chart1********************************
    // ************* for bar chart *******************************
    function initBar() {
      var data = [{

        x: sliced.map(item=>item[1]).reverse(),
        y: sliced.map(item=>item[0]).reverse(),
        marker:{
          color: ['#dc97a9', '#f2cb7c', '#edaf88', '#d3bfb6', '#addad7','#dc97a9', '#f2cb7c', '#edaf88', '#d3bfb6', '#addad7', '#dc97a9', '#f2cb7c', '#edaf88', '#d3bfb6', '#addad7','#dc97a9', '#f2cb7c', '#edaf88', '#d3bfb6', '#addad7'].reverse()
        },
        type: "bar",
        orientation : "h",
        text : sliced.map(item=>item[0]).reverse()
      }];
    
      var layout = {
        height: 800,
        width: 650
      };
    
      Plotly.newPlot("bar", data, layout);
     
    };
   // ************* End bar chart **********************************

  // ************* for Pie chart ***********************************
    function initPie() {

      var data = [{
        values: values,
        labels: labels,
        domain: {column: 0},
        name: 'Department',
        hoverinfo: 'label+percent',
        textinfo: "none",
        hole: .4,
        type: 'pie'
    }];
      
      var layout = {
      title: 'Percent Share of 311 Incidences by Department',
      showlegend: false
      };
      
      Plotly.newPlot('pie', data, layout);
    };
   // ************* End Pie chart **********************************

  });

  

}
buildChart();

// Event handle function

var filterDropdown = d3.selectAll(".form-control")

filterDropdown.on("change", function() {

	var statusSelect = d3.select("#Status").node().value
	var sourceSelect = d3.select("#Source").node().value
	var deptSelect = d3.select("#Department").node().value
	var yearSelect = d3.select("#Year").node().value
	year = yearSelect
	department = deptSelect
	status = statusSelect
	source = sourceSelect
		



var variables = [department, status, source , year];


    console.log(variables)

    var url = createQuery(variables);



    d3.json(url).then(data => {

      
    console.log(url);
    // console.log(data);
    console.log(data.length);

      var source = data.map(row => row.source);
      var status = data.map(row => row.status);
      var department = data.map(row => row.department);
      var year = data.map(row => row.year);
      var type = data.map(row => row.type);

      // console.log(type);

      // for Mike's Pie Chart
    // Groupby department to get count of occurence of calls
    const groupByDepartment = data.reduce((acc, val) => {
      acc[val.department] = acc[val.department] + 1 || 1;
      return acc;
      }, {});
      
        // extract label and values
        var labels = Object.keys(groupByDepartment);
        var values = Object.values(groupByDepartment);
      
        // console.log(labels)
        // console.log(values)
      var data = data.sort((a, b) => a['creation_month-day'].localeCompare(b['creation_month-day']));
    // *******************


      
        var result = [];
        result = type.reduce((total, value) => {
          total[value] = (total[value] || 0) + 1;
          result.push(total);
          return total;
          },
        {});
          // console.log(result);
          var sortable = [];
          for (var type in result) {
              sortable.push([type, result[type]]);
          }
          
          sortable.sort(function(a, b) {
              return b[1] - a[1];
          });

          // console.log(sortable);
          var sliced = sortable.slice(0,20);
          //Return Rows Corresponding to the Top 20 Types
          var data1 = data.filter(row => row['type'] == Object.values(sliced)[0][0] || row['type'] == Object.values(sliced)[1][0]
          || row['type'] == Object.values(sliced)[2][0] || row['type'] == Object.values(sliced)[3][0] || row['type'] == Object.values(sliced)[4][0]
          || row['type'] == Object.values(sliced)[5][0] || row['type'] == Object.values(sliced)[6][0] || row['type'] == Object.values(sliced)[7][0]
          || row['type'] == Object.values(sliced)[8][0] || row['type'] == Object.values(sliced)[9][0] || row['type'] == Object.values(sliced)[10][0]
          || row['type'] == Object.values(sliced)[11][0] || row['type'] == Object.values(sliced)[12][0] || row['type'] == Object.values(sliced)[13][0]
          || row['type'] == Object.values(sliced)[14][0] || row['type'] == Object.values(sliced)[15][0] || row['type'] == Object.values(sliced)[16][0]
          || row['type'] == Object.values(sliced)[17][0] || row['type'] == Object.values(sliced)[18][0] || row['type'] == Object.values(sliced)[19][0]);
          //  console.log(data1);

          //Replace All "unknown" Values with None
          //Method Found at https://stackoverflow.com/questions/28263868/how-can-i-replace-the-text-in-json-string-with-a-userscript-for-greasemonkey
          var stringified = JSON.stringify(data1);
          stringified = stringified.replace("unknown", null);
   
          //Convert JSON String Back into Object
          var data1 = JSON.parse(stringified);
          // *************************************************
          
        
        
          console.log(sliced);
          
          x= sliced.map(item=>item[1]).reverse(),
          y= sliced.map(item=>item[0]).reverse(),
          text = sliced.map(item=>item[0]).reverse()
        // console.log(x);
          values= values,
          labels= labels,
          domain= {column: 0}

          x1 = data1.map(data => data['creation_month-day']);
          y1 = data1.map(data => data['days_to_close']);
          x2 = data1.map(data => data['creation_month-day']);
          y2 = data1.map(data => data['days_to_close']);
          groups= data1.map(data => data['creation_month-day'])
      
      updateBar(x,y,text);
      updatePie(values,labels,domain);
      updateLine1(x,y,groups);
      updateLine2(x,y,groups);


    });

  });
  // };

  // });


// optionChanged();


function updateBar(x,y,text) {

  
  Plotly.restyle("bar","x",[x]);
  Plotly.restyle("bar","y",[y]);
  Plotly.restyle("bar","text",[text]);   
}

function updatePie(values,labels,domain) {

  
  Plotly.restyle("pie","values",[values]);
  Plotly.restyle("pie","labels",[labels]);
  Plotly.restyle("pie","domain",[domain]);
}

function updateLine1(x,y,groups) {
  
  Plotly.restyle("line1","x",[x1]);
  Plotly.restyle("line1","y",[y1]);
  Plotly.restyle("line1","groups",[groups]);   
}

function updateLine2(x,y,groups) {
  
  Plotly.restyle("line2","x",[x2]);
  Plotly.restyle("line2","y",[y2]);
  Plotly.restyle("line2","groups",[groups]);   
}

