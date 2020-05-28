//Create Function for the Initial Charts
function initLines() {
    var department="ignore"
    var status="ignore"
    var source="ignore"
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

    // string together elements of parameter_key array
    var url = parameter_key.join("");

    // print out url 
    console.log(url);
    d3.json(url).then((data) => {
        console.log("The data is here.")
        console.log(data)

        //Define Variables for Columns
        var type = data.map(row => row.type);
        

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
        //Return the Top 20 Types
        var sliced = sortable.slice(0, 20);
        console.log(sortable);
        console.log(sliced);
        console.log(Object.values(sliced)[0][0]);
        
        //Return Rows Corresponding to the Top 20 Types
        var data1 = data.filter(row => row['type'] == Object.values(sliced)[0][0] || row['type'] == Object.values(sliced)[1][0]
            || row['type'] == Object.values(sliced)[2][0] || row['type'] == Object.values(sliced)[3][0] || row['type'] == Object.values(sliced)[4][0]
            || row['type'] == Object.values(sliced)[5][0] || row['type'] == Object.values(sliced)[6][0] || row['type'] == Object.values(sliced)[7][0]
            || row['type'] == Object.values(sliced)[8][0] || row['type'] == Object.values(sliced)[9][0] || row['type'] == Object.values(sliced)[10][0]
            || row['type'] == Object.values(sliced)[11][0] || row['type'] == Object.values(sliced)[12][0] || row['type'] == Object.values(sliced)[13][0]
            || row['type'] == Object.values(sliced)[14][0] || row['type'] == Object.values(sliced)[15][0] || row['type'] == Object.values(sliced)[16][0]
            || row['type'] == Object.values(sliced)[17][0] || row['type'] == Object.values(sliced)[18][0] || row['type'] == Object.values(sliced)[19][0]);
        console.log(data1);

        //Replace All "unknown" Values with None
        //Method Found at https://stackoverflow.com/questions/28263868/how-can-i-replace-the-text-in-json-string-with-a-userscript-for-greasemonkey
        var stringified = JSON.stringify(data1);
        stringified = stringified.replace("unknown", null);
        
        //Convert JSON String Back into Object
        var data1 = JSON.parse(stringified);

        console.log(data1);

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

        //Create Layout
        layout_average = {
            title: "Average Days to Close vs Date",
            xaxis: {title: "Date", type:'category', categoryorder:'category ascending'},
            yaxis: {title: "Average Days to Close", type:'category', 'categoryorder':'category ascending'}
        };

        layout_count = {
            title: "Count Days to Close vs Date",
            xaxis: {title: "Date", type:'category', categoryorder:'category ascending'},
            yaxis: {title: "Count Days to Close", type:'category', 'categoryorder':'category ascending'}
        };

        //Assign Plot to ID
        Plotly.newPlot('average', chart_average, layout_average);
        Plotly.newPlot('count', chart_count, layout_count);
    }).catch((error) => {
    console.error(error);
})};

initLines();

function buildChart() {
    //Apply Filter Selections to New Query
    var filterDropdown = d3.selectAll(".form-control")
    filterDropdown.on("change", function() {
        var statusSelect = d3.select("#Status").node().value;
        var sourceSelect = d3.select("#Source").node().value;
        var deptSelect = d3.select("#Department").node().value;
        var yearSelect = d3.select("#Year").node().value;
        var year = yearSelect
        var department = deptSelect
        var status = statusSelect
        var source = sourceSelect
            
        console.log(year)
        console.log(department)
        console.log(status)
        console.log(source)

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
        
        // string together elements of parameter_key array
        var url = parameter_key.join("");

    // print out url 
    console.log(url);

    d3.json(url).then((data) => {
        console.log("The data is here.")
        console.log(data)
    
        //Define Variables for Columns
        var type = data.map(row => row.type);
        
    
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
        //Return the Top 20 Types
        var sliced = sortable.slice(0, 20);
        console.log(sortable);
        console.log(sliced);
        console.log(Object.values(sliced)[0][0]);
        
        //Return Rows Corresponding to the Top 20 Types
        var data1 = data.filter(row => row['type'] == Object.values(sliced)[0][0] || row['type'] == Object.values(sliced)[1][0]
            || row['type'] == Object.values(sliced)[2][0] || row['type'] == Object.values(sliced)[3][0] || row['type'] == Object.values(sliced)[4][0]
            || row['type'] == Object.values(sliced)[5][0] || row['type'] == Object.values(sliced)[6][0] || row['type'] == Object.values(sliced)[7][0]
            || row['type'] == Object.values(sliced)[8][0] || row['type'] == Object.values(sliced)[9][0] || row['type'] == Object.values(sliced)[10][0]
            || row['type'] == Object.values(sliced)[11][0] || row['type'] == Object.values(sliced)[12][0] || row['type'] == Object.values(sliced)[13][0]
            || row['type'] == Object.values(sliced)[14][0] || row['type'] == Object.values(sliced)[15][0] || row['type'] == Object.values(sliced)[16][0]
            || row['type'] == Object.values(sliced)[17][0] || row['type'] == Object.values(sliced)[18][0] || row['type'] == Object.values(sliced)[19][0]);
        console.log(data1);
    
        //Replace All "unknown" Values with None
        //Method Found at https://stackoverflow.com/questions/28263868/how-can-i-replace-the-text-in-json-string-with-a-userscript-for-greasemonkey
        var stringified = JSON.stringify(data1);
        stringified = stringified.replace("unknown", null);
        
        //Convert JSON String Back into Object
        var data1 = JSON.parse(stringified);
    
        console.log(data1);

        x1 = data1.map(data => data['creation_month-day']);
        y1 = data1.map(data => data['days_to_close']);
        x2 = data1.map(data => data['creation_month-day']);
        y2 = data1.map(data => data['days_to_close']);
        
            transforms = [{
                type: 'aggregate',
                groups: data1.map(data => data['creation_month-day']), 
                aggregations: [
                {target: 'y', func: 'avg', enabled: true},
                ]
            }]

        // Note the extra brackets around 'x' and 'y'
        Plotly.restyle("average", "x", [x1]);
        Plotly.restyle("average", "y", [y1]);
        Plotly.restyle("count", "x", [x2]);
        Plotly.restyle("count", "y", [y2]);
        });
    });  
};

buildChart();