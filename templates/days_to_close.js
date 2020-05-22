//Create Code for Base Chart
var calls_info = JSON.parse('{{ calls_info | tojson | safe }}');
document.getElementById('aggregate_dates').innerHTML = calls_info[0];
document.getElementById('aggregate_dates_filters').innerHTML = calls_info[1];