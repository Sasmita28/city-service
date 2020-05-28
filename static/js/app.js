var department="ignore"
var status="ignore"
var source="Walk-in"
var year = "ignore"

// store variables in an array
var variables = [department, status, source , year];

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

var filterDropdown = d3.selectAll(".form-control")
filterDropdown.on("change", function() {
	var statusSelect = d3.select("#Status").node().value;
	var sourceSelect = d3.select("#Source").node().value;
	var deptSelect = d3.select("#Department").node().value;
	var yearSelect = d3.select("#Year").node().value;
	year = yearSelect
	department = deptSelect
	status = statusSelect
	source = sourceSelect
		
	console.log(year)
	console.log(department)
	console.log(status)
    console.log(source)
    //// starting point for developing query string
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
});



// string together elements of parameter_key array
var url = parameter_key.join("");

// print out url 
console.log(url);

d3.json(url).then((data) => {
    console.log("The data is here.")
    console.log(data)

    //Replace All "unknown" Values with None
    //Method Found at https://stackoverflow.com/questions/28263868/how-can-i-replace-the-text-in-json-string-with-a-userscript-for-greasemonkey
    var stringified = JSON.stringify(data);
    stringified = stringified.replace("unknown", null);
    var data1 = JSON.parse(stringified);

    //Create Traces
    //Method to Aggregate Values Found at https://plotly.com/javascript/aggregations/
    //Method to Fill Under Curves Found at https://plotly.com/python/filled-area-plots/
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

    chart_count = [{
        type:'scatter',
        x: data1.map(data => data['creation_month-day']),
        y: data1.map(data => data['days_to_close']),
        connectgaps: false,
        fill: 'tozeroy',
        transforms: [{
            type: 'aggregate',
            groups: data1.map(data => data['creation_month-day']),
            aggregations: [
              {target: 'y', func: 'count', enabled: true},
            ]
          }]
    }];

    //Create Layout
    layout_average = {
        title: "Average Days to Close vs Date",
        xaxis: {title: "Date", type:'category'},
        yaxis: {title: "Average Days to Close"}
    };

    layout_count = {
        title: "Count Days to Close vs Date",
        xaxis: {title: "Date", type:'category'},
        yaxis: {title: "Count Days to Close"}
    };

    //Assign Plot to ID
    Plotly.newPlot('average', chart_average, layout_average);
    Plotly.newPlot('count', chart_count, layout_count);
}).catch((error) => {
  console.error(error);
});