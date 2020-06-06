

var department="ignore"
var status="ignore"
var source="ignore"
var year = "ignore"

// store variables in an array
var variables = [department, status, source , year];

if(variables[0] ==='ignore' && variables[1] ==='ignore' && variables[2] ==='ignore' && variables[3] ==='ignore'){
  var url = '/query';
}

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

  
    if(query_variables[0] ==='ignore' && query_variables[1] ==='ignore' && query_variables[2] ==='ignore' && query_variables[3] ==='ignore'){
      var url = '/query';
    }
    else { 
      // string together elements of parameter_key array
      var url = parameter_key.join("");
    }
 
    
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
    // var myMap = null;
    function initMap() {

      
      // var container = L.DomUtil.get('map');if(container != null ) {container.leaflet_id = null;}
      // Create a map object
      var myMap =L.map("map", {
        center: [39.0997, -94.5786],
        zoom: 13
      });

      L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        // tileSize: 60,
        // zoomOffset: -1,  
        accessToken: API_KEY
      }).addTo(myMap);

      
      // extracting the zip code from json_data and the grouping by zipcode to see the number of call counts per zipcode
      var zipCode = data.map(row => row.zip_code);
      var countCalls = [];
        var countCalls = zipCode.reduce((total, value) => {
          total[value] = (total[value] || 0) + 1;
          countCalls.push(total)
          return total;
          },
        {});

      // Separating the zipcodes and their counts
      var zipcode_unique = Object.keys(countCalls);
      var call_counts = Object.values(countCalls);
      //  console.log(zipcode_unique[0]);
    
      // filtering json_data for the unique zipcodes
      var data_filter =[];
      var lat = [];
      for (i=0;i< zipcode_unique.length ;i++){
        data_filter.push(data.filter( element => element.zip_code == zipcode_unique[i]));
        
      }
 
   
    // console.log(data_filter);
    // Extracting only the latlongs from the array of arrays

    var latlons= data_filter.map(arr => arr.map(element => `${element.lat},${element.lon}`) );


   
    // console.log(data_filter);
    
    
    // making these latlong elements as list and converting them to numbers again
   var latlong1 =latlons.map(arr => arr.map(element => ([element])));

   
    var latlong2 = latlong1.map(arr =>arr.map(element => (element[0].split(',').map(x=>+x))) );

    
  //  Extracting the lats and longs separately
    var lat = latlong2.map(num =>num.map(item=> item[0]));
    var long = latlong2.map(num =>num.map(item=> item[1]));
  
    // console.log(lat);
    // for (var i = 0; i < zipcode_unique.length; i++) {
              
    //       L.marker([lat[i][0], long[i][0]]).bindPopup("<h5><h5>Zip: "  + zipcode_unique[i] + "</h5>"+ "<h5><h5>Call Count: " + call_counts[i] + "</h5>").addTo(myMap);
    //       // console.log([lat[i][0]]);
    
     
    // }
  // Initializing the heat array
    var heatArray = [];
      
    for (var i = 0; i < zipcode_unique.length; i++) {
      for( var j= 0; j< call_counts[i];j++){

        var location = latlong2[i];
  
        if (location) {
          heatArray.push([location[j][0], location[j][1]]);
          
          // console.log([location[j][1]]);
        }
      }
      
    }
  
  //  console.log(heatArray);
  

  var heat = L.heatLayer(heatArray, {
    radius:20,
    blur:25,
    maxZoom:15,
    // gradient: {
    //   0.0: 'blue',
    //   0.5: 'yellow',
    //   1.0: 'red'
    // }
  }).addTo(myMap);

  
  
     
    };
   // ************* End Map ************
  //*****************For Line Chart1***********
   function initLine1() {
    chart_average = [{
      type:'scatter',
      x: data1.map(data=> data['creation_month-day']),
      y: data1.map(data =>data['days_to_close']),
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
      title: '<b>'+'Average Days to Close vs Date'+'</b>',
      xaxis: {title: '<b>'+'Date'+'</b>'},
      yaxis: {title: '<b>'+'Average days to Close'+'<b>'},
      
  };

    var config = {responsive: true}
    Plotly.newPlot("line1", chart_average, layout_average, config);
    // Plotly.newPlot("line1", chart_average, layout_average);
 
   
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
            groups: data1.map(data=> data['creation_month-day']),
            aggregations: [
            {target: 'y', func: 'count', enabled: true},
            ]
        }]
    }];
  
    layout_count = {
      title: '<b>'+'Count Days to Close vs Date'+'</b>',
      xaxis: {title:'<b>'+ 'Date'+'</b>'},
      yaxis: {title: '<b>'+'Count Days to Close'+'</b>'},
      
    
    };
    var config = {responsive: true}
    Plotly.newPlot("line2", chart_count, layout_count, config);
    // Plotly.newPlot("line2", chart_count, layout_count);
     
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
        title: '<b>'+'No.of calls per request'+'</b>',
        yaxis: {
          automargin: true
          }
        };
    
      var config = {responsive: true}
      Plotly.newPlot("bar", data, layout, config);
      // Plotly.newPlot("bar", data, layout);
     
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
        marker:{
          colors: ['#DC97A9', '#F2CB7C', '#EDAF88', '#D3BFB6', '#ADDAD7','#DC97A9', '#F2CB7C', '#EDAF88', '#D3BFB6', '#ADDAD7', '#DC97A9', '#F2CB7C', '#EDAF88', '#D3BFB6', '#ADDAD7','#DC97A9', '#F2CB7C', '#EDAF88', '#D3BFB6', '#ADDAD7'].reverse()
        },
        type: 'pie'
    }];
      var layout = {
      title: '<b>'+'Percent Share of 311 Incidences by Department'+'</b>',
      showlegend: true
      };
      var config = {responsive: true}
      Plotly.newPlot("pie", data, layout, config);
      // Plotly.newPlot("pie", data, layout);
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
  // console.log(year);



  var variables = [department, status, source , year];

  console.log(variables);

  if(department ==='ignore' && status ==='ignore' && source ==='ignore' && year ==='ignore'){
    var url = '/query';
  }
  
  else {
     var url = createQuery(variables);
  };
 


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
    const groupByDepartment =data.reduce((acc, val) => {
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
          
        
        
          // console.log(sliced);
          
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
          // console.log(x1);
      updateBar(x,y,text);
      updatePie(values,labels,domain);
      updateLine1(x1,y1,groups);
      updateLine2(x2,y2,groups);
      updateMap();


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

function updateLine1(x1,y1,groups) {
  
  Plotly.restyle("line1","x",[x1]);
  Plotly.restyle("line1","y",[y1]);
  Plotly.restyle("line1","groups",[groups]);   
}

function updateLine2(x2,y2,groups) {
  
  Plotly.restyle("line2","x",[x2]);
  Plotly.restyle("line2","y",[y2]);
  Plotly.restyle("line2","groups",[groups]);   
}

function updateMap(){

  var url = createQuery(variables);

  d3.json(url).then(data => {

    var container = L.DomUtil.get('map');
    if(container != null){
    container._leaflet_id = null;
    }

    // myMap.invalidateSize()
    // var container = L.DomUtil.get('map');if(container != null ) {container.leaflet_id = null;}
      // Create a map object
      var myMap =L.map("map", {
        center: [39.0997, -94.5786],
        zoom: 13
      });

      L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        // tileSize: 60,
        // zoomOffset: -1,  
        accessToken: API_KEY
      }).addTo(myMap);

      
      // extracting the zip code from json_data and the grouping by zipcode to see the number of call counts per zipcode
      var zipCode = data.map(row => row.zip_code);
      var countCalls = [];
        var countCalls = zipCode.reduce((total, value) => {
          total[value] = (total[value] || 0) + 1;
          countCalls.push(total)
          return total;
          },
        {});

      // Separating the zipcodes and their counts
      var zipcode_unique = Object.keys(countCalls);
      var call_counts = Object.values(countCalls);
      //  console.log(zipcode_unique[0]);
    
      // filtering json_data for the unique zipcodes
      var data_filter =[];
      var lat = [];
      for (i=0;i< zipcode_unique.length ;i++){
        data_filter.push(data.filter( element => element.zip_code == zipcode_unique[i]));
        
      }

  
    // console.log(data_filter);
    // Extracting only the latlongs from the array of arrays

    var latlons= data_filter.map(arr => arr.map(element => `${element.lat},${element.lon}`) );


  
    // console.log(data_filter);
    
    
    // making these latlong elements as list and converting them to numbers again
  var latlong1 =latlons.map(arr => arr.map(element => ([element])));

  
    var latlong2 = latlong1.map(arr =>arr.map(element => (element[0].split(',').map(x=>+x))) );

    
  //  Extracting the lats and longs separately
    var lat = latlong2.map(num =>num.map(item=> item[0]));
    var long = latlong2.map(num =>num.map(item=> item[1]));

    // console.log(lat);
    // for (var i = 0; i < zipcode_unique.length; i++) {
              
    //       L.marker([lat[i][0], long[i][0]]).bindPopup("<h5><h5>Zip: "  + zipcode_unique[i] + "</h5>"+ "<h5><h5>Call Count: " + call_counts[i] + "</h5>").addTo(myMap);
    //       // console.log([lat[i][0]]);
    
    
    // }
  // Initializing the heat array
    var heatArray = [];
      
    for (var i = 0; i < zipcode_unique.length; i++) {
      for( var j= 0; j< call_counts[i];j++){

        var location = latlong2[i];

        if (location) {
          heatArray.push([location[j][0], location[j][1]]);
          
          // console.log([location[j][1]]);
        }
      }
      
    }

  //  console.log(heatArray);


  var heat = L.heatLayer(heatArray, {
    radius:20,
    blur:25,
    maxZoom:10,
  //   gradient: {
  //     0.0: 'blue',
  //     0.5: 'yellow',
  //     1.0: 'red'
  // }
  }).addTo(myMap);



   

  });

}