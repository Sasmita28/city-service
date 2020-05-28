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
      
        // console.log(labels)
        // console.log(values)
      
    // *******************

    // var filteredData = data.filter(row => row.year === '2020');
    // console.log(filteredData);

    // var typeFiltered = filteredData.map(row=>row.type);
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

    initBar();
    initPie();
   
    // optionChanged();
    
    // ************* for bar chart ************
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
   // ************* End bar chart ************

  // ************* for Pie chart ************
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
   // ************* End Pie chart ************

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
         
          
        
        
          console.log(sliced);
          
          x= sliced.map(item=>item[1]).reverse(),
          y= sliced.map(item=>item[0]).reverse(),
          text = sliced.map(item=>item[0]).reverse()
        // console.log(x);
          values= values,
          labels= labels,
          domain= {column: 0}

      
      updateBar(x,y,text);
      updatePie(values,labels,domain);


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

