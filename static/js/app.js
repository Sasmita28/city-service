console.log("Hello Team")
console.log("Hi there.")
d3.json("/query").then((data) => {
    console.log("The data is here.")

    //Create Traces
    //Method to Fill Under Curves Found at https://plotly.com/python/filled-area-plots/
    chart_average = [{
        type:'scatter',
        x: data.map(data => data['creation_month-day']),
        y: data.map(data => data['average_days_to_close']),
        fill: 'tozeroy'
    }];

    chart_count = [{
        type:'scatter',
        x: data.map(data => data['creation_month-day']),
        y: data.map(data => data['count_days_to_close']),
        fill: 'tozeroy'
    }];

    //Create Layout
    layout_average = {
        title: "Average Days to Close vs Date",
        xaxis: {title: "Date"},
        yaxis: {title: "Average Days to Close"}
    };

    layout_count = {
        title: "Count Days to Close vs Date",
        xaxis: {title: "Date"},
        yaxis: {title: "Count Days to Close"}
    };

    //Assign Plot to ID
    Plotly.newPlot('average', chart_average, layout_average);
    Plotly.newPlot('count', chart_count, layout_count);
});