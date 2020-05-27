var department="ignore"
var status="Resolved"
var source="Email"
var year = "2020"

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

// string together elements of parameter_key array
var url = parameter_key.join("");

// print out url 
console.log(url)

// call api
d3.json(url).then((data) => {

    // Groupby department to get count of occurence of calls
    const groupByDepartment = data.reduce((acc, val) => {
        acc[val.department] = acc[val.department] + 1 || 1;
        return acc;
    }, {});

    // extract label and values
    var labels = Object.keys(groupByDepartment);
    var values = Object.values(groupByDepartment);

    console.log(labels)
    console.log(values)

    var data = [{
        values: values,
        labels: labels,
        domain: {column: 0},
        name: 'GHG Emissions',
        hoverinfo: 'label+percent+name',
        hole: .4,
        type: 'pie'
    }];
      
    var layout = {
    title: 'Count of 311 Incidences by Department',
    height: 400,
    width: 600,
    showlegend: true,
    };
    
    Plotly.newPlot('pieChart', data, layout);
    
});

